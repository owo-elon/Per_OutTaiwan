import * as THREE from 'three';
import gsap from 'gsap';

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  category: string;
}

export class ThreeCarousel {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cards: THREE.Mesh[] = [];
  private items: CarouselItem[];
  private renderItems: (CarouselItem & { uid: string, original: CarouselItem })[];
  
  private radius = 5.5;
  private offset = 0;
  private targetOffset = 0;
  private velocity = 0;
  private isDragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private totalMoved = 0;
  
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private isDark = false;
  
  private onSelect: (item: CarouselItem) => void;
  private onActiveChange?: (item: CarouselItem) => void;
  private lastActiveIndex = -1;

  private boundOnMouseMove: (e: MouseEvent) => void;
  private boundOnMouseUp: () => void;
  private boundOnTouchMove: (e: TouchEvent) => void;
  private boundOnResize: () => void;
  private boundOnWheel: (e: WheelEvent) => void;

  private hintOverlay: HTMLDivElement | null = null;
  private hintTimeout: any = null;
  private wheelSnapTimeout: any = null;

  constructor(container: HTMLElement, items: CarouselItem[], isDark: boolean, onSelect: (item: CarouselItem) => void, onActiveChange?: (item: CarouselItem) => void) {
    this.container = container;
    this.items = items;
    this.isDark = isDark;
    this.onSelect = onSelect;
    this.onActiveChange = onActiveChange;
    
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseUp = this.onMouseUp.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.z = 12; // Move camera slightly back to accommodate larger radius
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);
    
    this.prepareRenderItems();
    this.initCards();
    this.initEvents();
    this.initHint();
    this.animate();
  }

  private prepareRenderItems() {
    this.renderItems = [];
    if (this.items.length === 0) return;
    
    let tempItems = [...this.items];
    while (tempItems.length < 12) {
      tempItems = [...tempItems, ...this.items];
    }
    
    this.renderItems = tempItems.map((item, index) => ({
      ...item,
      uid: item.id + '_' + index,
      original: item
    }));
  }

  private initHint() {
    // Only inject styles once
    if (!document.getElementById('threecarousel-hint-style')) {
      const style = document.createElement('style');
      style.id = 'threecarousel-hint-style';
      style.innerHTML = `
        .carousel-swipe-hint {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.5s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          z-index: 10;
          background: rgba(0, 0, 0, 0.4);
          padding: 20px 30px;
          border-radius: 20px;
          backdrop-filter: blur(8px);
        }
        .carousel-swipe-hint.show {
          animation: swipeAnim 3s infinite;
        }
        .carousel-swipe-hint svg {
          width: 48px;
          height: 48px;
          margin-bottom: 10px;
          stroke: #00E5FF;
        }
        .carousel-swipe-hint .swipe-arrows {
          display: flex;
          gap: 30px;
          font-size: 24px;
          font-weight: bold;
          color: #00E5FF;
        }
        @keyframes swipeAnim {
          0% { transform: translate(-50%, -50%) translateX(0); opacity: 0; }
          15% { opacity: 1; }
          40% { transform: translate(-50%, -50%) translateX(-40px); }
          60% { transform: translate(-50%, -50%) translateX(40px); }
          85% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translateX(0); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    this.hintOverlay = document.createElement('div');
    this.hintOverlay.className = 'carousel-swipe-hint';
    this.hintOverlay.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 11V6a3 3 0 0 1 6 0v11M9 11l-3 3v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6l-3-3"/>
      </svg>
      <div class="swipe-arrows">
        <span>&larr;</span><span>&rarr;</span>
      </div>
    `;
    this.container.appendChild(this.hintOverlay);

    this.resetHintTimer();
  }

  private resetHintTimer() {
    if (!this.hintOverlay) return;
    
    this.hintOverlay.classList.remove('show');
    clearTimeout(this.hintTimeout);
    
    // Only show on mobile devices
    if (window.innerWidth >= 768) return;

    this.hintTimeout = setTimeout(() => {
      if (this.hintOverlay && !this.isDragging) {
        this.hintOverlay.classList.add('show');
      }
    }, 4000); // Show after 4 seconds of inactivity
  }

  private initCards() {
    // Shrink size by 20%: 2.4 * 0.8 = 1.92, 3.6 * 0.8 = 2.88
    const cardGeometry = new THREE.PlaneGeometry(1.92, 2.88);
    
    const vertexShader = `
      varying vec2 vUv;
      varying float vDist;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDist = mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform sampler2D tMap;
      uniform float uOpacity;
      uniform vec3 uTint;
      uniform float uBlur;
      uniform float uTime;
      uniform bool uIsDark;
      varying vec2 vUv;
      varying float vDist;

      void main() {
        // Simple blur by sampling neighbors
        vec4 color = texture2D(tMap, vUv);
        if (uBlur > 0.0) {
          float offset = uBlur * 0.005;
          color += texture2D(tMap, vUv + vec2(offset, 0.0));
          color += texture2D(tMap, vUv + vec2(-offset, 0.0));
          color += texture2D(tMap, vUv + vec2(0.0, offset));
          color += texture2D(tMap, vUv + vec2(0.0, -offset));
          color /= 5.0;
        }

        // High-Tech Inset Beam Flow Logic
        float inset = 0.05; // Distance from edge
        float thickness = 0.015; // Beam thickness
        
        // Define the track area (a thin rectangle inset from the edges)
        bool isOnTrack = (vUv.x > (inset - thickness) && vUv.x < (inset + thickness) && vUv.y > inset && vUv.y < (1.0 - inset)) ||
                         (vUv.x > (1.0 - inset - thickness) && vUv.x < (1.0 - inset + thickness) && vUv.y > inset && vUv.y < (1.0 - inset)) ||
                         (vUv.y > (inset - thickness) && vUv.y < (inset + thickness) && vUv.x > inset && vUv.x < (1.0 - inset)) ||
                         (vUv.y > (1.0 - inset - thickness) && vUv.y < (1.0 - inset + thickness) && vUv.x > inset && vUv.x < (1.0 - inset));
        
        if (isOnTrack) {
          // Calculate normalized perimeter position for the inset track
          float p = 0.0;
          float side = 1.0 - 2.0 * inset;
          if (abs(vUv.y - (1.0 - inset)) < thickness) p = (vUv.x - inset) / side; // Top
          else if (abs(vUv.x - (1.0 - inset)) < thickness) p = 1.0 + (1.0 - inset - vUv.y) / side; // Right
          else if (abs(vUv.y - inset) < thickness) p = 2.0 + (1.0 - inset - vUv.x) / side; // Bottom
          else p = 3.0 + (vUv.y - inset) / side; // Left
          
          float beamPos = mod(uTime * 2.0, 4.0);
          float beamWidth = 0.6;
          float distToBeam = abs(p - beamPos);
          if (distToBeam > 2.0) distToBeam = 4.0 - distToBeam;
          
          float beamIntensity = smoothstep(beamWidth, 0.0, distToBeam);
          // Sharper core
          float core = smoothstep(0.1, 0.0, distToBeam);
          
          vec3 beamColor = uIsDark ? vec3(0.0, 1.0, 0.9) : vec3(0.05, 0.4, 0.3);
          vec3 finalBeam = beamColor * beamIntensity * 0.7 + beamColor * core * 1.5;
          
          color.rgb = mix(color.rgb, finalBeam, beamIntensity);
          if (uIsDark) {
            color.rgb += finalBeam * 0.4; // Extra bloom
          }
        }

        color.rgb = mix(color.rgb, color.rgb * uTint, clamp(-vDist * 0.1, 0.0, 1.0));
        gl_FragColor = vec4(color.rgb, color.a * uOpacity);
      }
    `;

    this.renderItems.forEach((item, i) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 768;
      const ctx = canvas.getContext('2d')!;
      
      this.drawCardCanvas(ctx, item);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          tMap: { value: texture },
          uOpacity: { value: 1.0 },
          uTint: { value: new THREE.Color(0x336699) },
          uBlur: { value: 0.0 },
          uTime: { value: 0.0 },
          uIsDark: { value: this.isDark }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(cardGeometry, material);
      mesh.userData.uid = item.uid;
      this.scene.add(mesh);
      this.cards.push(mesh);
    });
  }

  private drawCardCanvas(ctx: CanvasRenderingContext2D, item: CarouselItem) {
    const isDark = this.isDark;
    const width = 512;
    const height = 768;
    const radius = 60; // Rounded corner radius
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Helper for rounded rect
    const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // Background with rounded corners
    ctx.save();
    roundedRect(0, 0, width, height, radius);
    ctx.clip();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isDark) {
      gradient.addColorStop(0, '#1A1A1A');
      gradient.addColorStop(1, '#0A0A0A');
    } else {
      gradient.addColorStop(0, '#F0F4F8');
      gradient.addColorStop(1, '#D9E2EC');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
    
    // Border with rounded corners
    const accentColor = isDark ? '#00E5FF' : '#044E3A';
    ctx.save();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 12;
    roundedRect(6, 6, width - 12, height - 12, radius - 6);
    ctx.stroke();
    
    // Inner Glow line
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    roundedRect(20, 20, width - 40, height - 40, radius - 20);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    
    // Icon
    ctx.font = '160px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.icon, 256, 250);
    
    // Title
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 48px "Courier New", monospace';
    ctx.fillText(item.title, 256, 450);
    
    // Description
    ctx.fillStyle = isDark ? '#FFFFFF' : '#102A43';
    ctx.font = '24px "Courier New", monospace';
    const words = item.description.split('');
    let line = '';
    let y = 520;
    const maxWidth = 400;
    
    // Simple word wrap for Chinese/English
    for (let n = 0; n < item.description.length; n++) {
      const testLine = line + item.description[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 256, y);
        line = item.description[n];
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 256, y);
    
    // Decorative lines (Star Atlas style)
    ctx.strokeStyle = isDark ? '#00E5FF' : '#044E3A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 480);
    ctx.lineTo(412, 480);
    ctx.stroke();
  }

  private initEvents() {
    this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mousemove', this.boundOnMouseMove);
    window.addEventListener('mouseup', this.boundOnMouseUp);
    
    this.container.addEventListener('touchstart', this.onTouchStart.bind(this));
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: false });
    window.addEventListener('touchend', this.boundOnMouseUp);
    window.addEventListener('touchcancel', this.boundOnMouseUp);
    
    this.container.addEventListener('click', this.onClick.bind(this));
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: false });
    
    window.addEventListener('resize', this.boundOnResize);
    
    // Gyroscope
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (event) => {
        if (event.gamma) {
          const tilt = event.gamma / 90; // -1 to 1
          this.scene.position.x = tilt * 0.5;
        }
        if (event.beta) {
          const tilt = (event.beta - 45) / 90;
          this.scene.position.y = -tilt * 0.5;
        }
      });
    }
  }

  private onResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  private onMouseDown(e: MouseEvent) {
    if (window.innerWidth >= 768) return; // Disable drag on desktop
    gsap.killTweensOf(this, 'targetOffset');
    this.isDragging = true;
    this.lastMouseX = e.clientX;
    this.totalMoved = 0;
    this.velocity = 0;
    this.resetHintTimer();
  }

  private onMouseMove(e: MouseEvent) {
    if (window.innerWidth >= 768) return; // Disable drag on desktop
    if (!this.isDragging) return;
    const delta = e.clientX - this.lastMouseX;
    this.totalMoved += Math.abs(delta);
    this.lastMouseX = e.clientX;
    this.targetOffset += delta * 0.01;
    this.velocity = delta * 0.01;
  }

  private onTouchStart(e: TouchEvent) {
    if (window.innerWidth >= 768) return; // Disable drag on desktop
    if (e.touches.length === 0) return;
    gsap.killTweensOf(this, 'targetOffset');
    this.isDragging = true;
    this.lastMouseX = e.touches[0].clientX;
    this.lastMouseY = e.touches[0].clientY;
    this.totalMoved = 0;
    this.velocity = 0;
    this.resetHintTimer();
  }

  private onTouchMove(e: TouchEvent) {
    if (window.innerWidth >= 768) return; // Disable drag on desktop
    if (!this.isDragging || e.touches.length === 0) return;
    
    // Only track the first touch point
    const touch = e.touches[0];
    
    const deltaX = touch.clientX - this.lastMouseX;
    const deltaY = touch.clientY - this.lastMouseY;
    
    // Prevent default scrolling only when dragging horizontally
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 5) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    
    const delta = touch.clientX - this.lastMouseX;
    this.totalMoved += Math.abs(delta);
    this.lastMouseX = touch.clientX;
    this.lastMouseY = touch.clientY;
    this.targetOffset += delta * 0.01;
    this.velocity = delta * 0.01;
  }

  private onMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    // Apply inertia based on velocity
    const inertiaDuration = 0.8;
    const inertiaDistance = this.velocity * 10;
    this.targetOffset += inertiaDistance;
    
    // Snap to nearest card
    const step = (Math.PI * 2) / this.cards.length;
    const nearest = Math.round(this.targetOffset / step) * step;
    
    gsap.to(this, {
      targetOffset: nearest,
      duration: 1.2,
      ease: 'power3.out'
    });
  }

  private onWheel(e: WheelEvent) {
    e.preventDefault();
    if (Math.abs(e.deltaY) > 0) {
      gsap.killTweensOf(this, 'targetOffset');
      
      const step = (Math.PI * 2) / this.cards.length;
      const speed = window.innerWidth >= 768 ? 0.4 : 0.2; // Faster on desktop
      this.targetOffset -= Math.sign(e.deltaY) * step * speed;
      this.resetHintTimer();

      clearTimeout(this.wheelSnapTimeout);
      this.wheelSnapTimeout = setTimeout(() => {
        const nearest = Math.round(this.targetOffset / step) * step;
        gsap.to(this, {
          targetOffset: nearest,
          duration: 0.6,
          ease: 'power3.out'
        });
      }, 150) as unknown as number;
    }
  }

  private onClick(e: MouseEvent) {
    if (this.totalMoved > 10) return;

    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cards);
    
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const index = this.renderItems.findIndex(item => item.uid === clickedMesh.userData.uid);
      
      // Instantly trigger selection without bringing it to the front or applying destructive animations
      this.onSelect(this.renderItems[index].original);
    }
  }

  public rotateToIndex(index: number) {
    if (this.cards.length === 0) return;
    
    const step = (Math.PI * 2) / this.cards.length;
    const target = -index * step;
    
    let diff = target - this.targetOffset;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    
    gsap.to(this, {
      targetOffset: this.targetOffset + diff,
      duration: 0.8,
      ease: 'power3.out'
    });
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    if (this.cards.length === 0) return;
    
    if (!this.isDragging) {
      this.offset += (this.targetOffset - this.offset) * 0.1;
    } else {
      this.offset = this.targetOffset;
    }
    
    const step = (Math.PI * 2) / this.cards.length;
    const isDesktop = window.innerWidth >= 768;
    const currentVirtualIndex = -this.offset / step;
    
    // Sort cards by depth (z-index) to ensure proper rendering order
    // On desktop, we need custom z sorting based on diff
    this.cards.sort((a, b) => {
      if (isDesktop) {
        return a.position.z - b.position.z;
      }
      return a.position.z - b.position.z;
    });
    
    this.cards.forEach((card) => {
      const index = this.renderItems.findIndex(item => item.uid === card.userData.uid);
      
      let diff = index - currentVirtualIndex;
      const N = this.cards.length;
      while (diff > N / 2) diff -= N;
      while (diff < -N / 2) diff += N;

      if (!card.userData.ejected) {
        if (isDesktop) {
          // Responsive scaling to prevent empty space
          let baseScale = 1.2;
          let laneWidth = 2.2;
          if (window.innerWidth >= 1600) {
            baseScale = 1.6;
            laneWidth = 2.8;
          } else if (window.innerWidth >= 1200) {
            baseScale = 1.4;
            laneWidth = 2.5;
          }

          // Star Atlas Roadmap Style: Alternating Left/Right Track
          const side = index % 2 === 0 ? 1 : -1;
          
          card.position.x = side * laneWidth;
          card.position.y = 0;
          // Bring cards closer to camera (camera is at z=12)
          card.position.z = 5.0 - diff * 4.0; 
          
          // Cards face forward with slight angle towards center
          card.rotation.x = 0;
          card.rotation.y = side * -0.12;
          card.rotation.z = 0;
          
          card.scale.set(baseScale, baseScale, 1);
        } else {
          // Mobile circular layout
          const angle = index * step + this.offset;
          let normalizedAngle = angle % (Math.PI * 2);
          if (normalizedAngle > Math.PI) normalizedAngle -= Math.PI * 2;
          if (normalizedAngle < -Math.PI) normalizedAngle += Math.PI * 2;
          
          card.position.x = Math.sin(normalizedAngle) * this.radius;
          card.position.z = Math.cos(normalizedAngle) * this.radius;
          card.rotation.y = normalizedAngle * 0.5;
          
          const distance = card.position.z;
          const normalizedDist = (distance + this.radius) / (this.radius * 2);
          
          // Dynamic scale for mobile based on screen width
          const mobileBaseScale = window.innerWidth > 400 ? 1.1 : 0.9;
          const scale = mobileBaseScale * (0.75 + normalizedDist * 0.25);
          card.scale.set(scale, scale, 1);
        }
      }
      
      const material = card.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = performance.now() / 1000;

      if (isDesktop) {
        let opacity = 0;
        let blur = 0;
        
        if (diff >= 0) {
          // Items behind: deeper visibility so we see several at once
          opacity = Math.max(0, 1 - diff * 0.2);
          blur = diff * 0.5; // Less blur so they are recognizable
        } else {
          // Items moving forward past the camera: rapid fade
          opacity = Math.max(0, 1 + diff * 1.5);
          blur = Math.abs(diff) * 3.0;
        }

        material.uniforms.uOpacity.value = opacity;
        material.uniforms.uBlur.value = blur;
        
        if (Math.abs(diff) > 0.5) {
          material.uniforms.uTint.value.setHex(this.isDark ? 0x224466 : 0xbbccdd);
        } else {
          material.uniforms.uTint.value.setHex(0xffffff);
        }
      } else {
        const distance = card.position.z;
        const normalizedDist = (distance + this.radius) / (this.radius * 2);
        material.uniforms.uOpacity.value = Math.pow(normalizedDist, 1.5) * 0.95 + 0.05;
        material.uniforms.uBlur.value = (1 - normalizedDist) * 4.0;
        
        if (normalizedDist < 0.6) {
          material.uniforms.uTint.value.setHex(this.isDark ? 0x336699 : 0x999999);
        } else {
          material.uniforms.uTint.value.setHex(0xffffff);
        }
      }
    });
    
    // Check for active card change
    if (this.onActiveChange) {
      const step = (Math.PI * 2) / this.cards.length;
      // Calculate which card is closest to the front (angle 0)
      // The offset is negative of the target angle
      const activeIndex = Math.round(-this.offset / step) % this.cards.length;
      const normalizedIndex = (activeIndex + this.cards.length) % this.cards.length;
      
      if (normalizedIndex !== this.lastActiveIndex) {
        this.lastActiveIndex = normalizedIndex;
        this.onActiveChange(this.renderItems[normalizedIndex].original);
      }
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  public updateTheme(isDark: boolean) {
    if (this.isDark === isDark) return;
    this.isDark = isDark;
    
    this.cards.forEach((card) => {
      const index = this.renderItems.findIndex(item => item.uid === card.userData.uid);
      const material = card.material as THREE.ShaderMaterial;
      material.uniforms.uIsDark.value = isDark;
      const texture = material.uniforms.tMap.value as THREE.CanvasTexture;
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      
      this.drawCardCanvas(ctx, this.renderItems[index].original);
      texture.needsUpdate = true;
    });
  }

  public setItems(newItems: CarouselItem[]) {
    // Clear existing cards
    this.cards.forEach(card => {
      const material = card.material as THREE.ShaderMaterial;
      material.uniforms.tMap.value?.dispose();
      material.dispose();
      card.geometry.dispose();
      this.scene.remove(card);
    });
    this.cards = [];
    this.items = newItems;
    
    // Reset offsets
    this.offset = 0;
    this.targetOffset = 0;
    this.velocity = 0;
    
    // Re-initialize cards
    this.prepareRenderItems();
    this.initCards();
  }

  public destroy() {
    window.removeEventListener('mousemove', this.boundOnMouseMove);
    window.removeEventListener('mouseup', this.boundOnMouseUp);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnMouseUp);
    window.removeEventListener('resize', this.boundOnResize);
    this.container.removeEventListener('wheel', this.boundOnWheel);
    
    if (this.hintOverlay) {
      this.hintOverlay.remove();
    }
    clearTimeout(this.hintTimeout);
    clearTimeout(this.wheelSnapTimeout);
    
    this.renderer.dispose();
    this.cards.forEach(c => {
      const material = c.material as THREE.ShaderMaterial;
      material.uniforms.tMap.value?.dispose();
      material.dispose();
      c.geometry.dispose();
    });
  }
}
