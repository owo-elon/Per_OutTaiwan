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
  
  private radius = 4;
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
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.z = 10;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);
    
    this.initCards();
    this.initEvents();
    this.animate();
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

    this.items.forEach((item, i) => {
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
      mesh.userData.id = item.id;
      this.scene.add(mesh);
      this.cards.push(mesh);
    });
  }

  private drawCardCanvas(ctx: CanvasRenderingContext2D, item: CarouselItem) {
    const isDark = this.isDark;
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, 768);
    if (isDark) {
      gradient.addColorStop(0, '#1A1A1A');
      gradient.addColorStop(1, '#0A0A0A');
    } else {
      gradient.addColorStop(0, '#F0F4F8');
      gradient.addColorStop(1, '#D9E2EC');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 768);
    
    // Border
    const accentColor = isDark ? '#00E5FF' : '#044E3A';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 472, 728);
    
    // Glow effect
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 452, 708);
    ctx.shadowBlur = 0;
    
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
    ctx.strokeStyle = '#00E5FF';
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
    this.isDragging = true;
    this.lastMouseX = e.clientX;
    this.totalMoved = 0;
    this.velocity = 0;
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    const delta = e.clientX - this.lastMouseX;
    this.totalMoved += Math.abs(delta);
    this.lastMouseX = e.clientX;
    this.targetOffset += delta * 0.01;
    this.velocity = delta * 0.01;
  }

  private onTouchStart(e: TouchEvent) {
    if (e.touches.length === 0) return;
    this.isDragging = true;
    this.lastMouseX = e.touches[0].clientX;
    this.lastMouseY = e.touches[0].clientY;
    this.totalMoved = 0;
    this.velocity = 0;
  }

  private onTouchMove(e: TouchEvent) {
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

  private onClick(e: MouseEvent) {
    if (this.totalMoved > 10) return;

    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cards);
    
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const index = this.items.findIndex(item => item.id === clickedMesh.userData.id);
      
      // Check if it's the front card
      const step = (Math.PI * 2) / this.cards.length;
      const angle = index * step + this.offset;
      
      // Correct modulo for negative numbers
      let normalizedAngle = ((angle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
      if (normalizedAngle > Math.PI) normalizedAngle -= Math.PI * 2;
      
      if (Math.abs(normalizedAngle) < 0.5) {
        // Theme-consistent transition: Spin and Fade
        clickedMesh.userData.ejected = true;
        
        // Trigger background celebration if available (from layout.ts)
        if ((window as any).threeBg && typeof (window as any).threeBg.celebrate === 'function') {
          (window as any).threeBg.celebrate();
        }

        const material = clickedMesh.material as THREE.ShaderMaterial;
        
        // Spin the card
        gsap.to(clickedMesh.rotation, {
          y: clickedMesh.rotation.y + Math.PI * 2,
          duration: 0.8,
          ease: 'power2.inOut'
        });

        // Rotate the entire carousel 180 degrees (like the celestial dial)
        gsap.to(this, {
          targetOffset: this.targetOffset + Math.PI,
          duration: 1.2,
          ease: 'power3.inOut'
        });

        // Fade out the card
        gsap.to(material.uniforms.uOpacity, {
          value: 0,
          duration: 0.8,
          ease: 'power2.in'
        });

        // Fade out all cards in the carousel
        this.cards.forEach(c => {
          const mat = c.material as THREE.ShaderMaterial;
          gsap.to(mat.uniforms.uOpacity, {
            value: 0,
            duration: 1.0,
            ease: 'power2.in'
          });
        });

        // Move slightly forward and up
        gsap.to(clickedMesh.position, {
          z: clickedMesh.position.z + 2,
          y: clickedMesh.position.y + 0.5,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            this.onSelect(this.items[index]);
            // Reset state in case navigation is slow
            setTimeout(() => {
              clickedMesh.userData.ejected = false;
              this.cards.forEach(c => {
                (c.material as THREE.ShaderMaterial).uniforms.uOpacity.value = 1.0;
              });
            }, 1000);
          }
        });
      } else {
        // Scroll to this card
        const target = -index * step;
        // Find shortest path
        let diff = target - this.targetOffset;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        
        gsap.to(this, {
          targetOffset: this.targetOffset + diff,
          duration: 0.8,
          ease: 'power3.out'
        });
      }
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
    
    // Sort cards by depth (z-index) to ensure proper rendering order
    this.cards.sort((a, b) => a.position.z - b.position.z);
    
    this.cards.forEach((card) => {
      const index = this.items.findIndex(item => item.id === card.userData.id);
      const angle = index * step + this.offset;
      
      // Normalize angle to -PI to PI for seamless rotation and correct depth sorting
      let normalizedAngle = angle % (Math.PI * 2);
      if (normalizedAngle > Math.PI) normalizedAngle -= Math.PI * 2;
      if (normalizedAngle < -Math.PI) normalizedAngle += Math.PI * 2;
      
      if (!card.userData.ejected) {
        card.position.x = Math.sin(normalizedAngle) * this.radius;
        card.position.z = Math.cos(normalizedAngle) * this.radius;
        card.rotation.y = normalizedAngle;
        
        // Visuals based on distance
        const distance = card.position.z; // -radius to radius
        const normalizedDist = (distance + this.radius) / (this.radius * 2); // 0 to 1 (0 is back, 1 is front)
        
        const scale = 0.5 + normalizedDist * 0.5;
        card.scale.set(scale, scale, 1);
      }
      
      // We still update material uniforms even if ejected
      const distance = card.position.z;
      const normalizedDist = (distance + this.radius) / (this.radius * 2);
      
      const material = card.material as THREE.ShaderMaterial;
      // Update time for beam flow
      material.uniforms.uTime.value = performance.now() / 1000;

      // Enhanced fading: quadratic falloff
      material.uniforms.uOpacity.value = Math.pow(normalizedDist, 1.5) * 0.95 + 0.05;
      material.uniforms.uBlur.value = (1 - normalizedDist) * 4.0;
      
      // Color tint for back cards
      if (normalizedDist < 0.6) {
        material.uniforms.uTint.value.setHex(this.isDark ? 0x336699 : 0x999999);
      } else {
        material.uniforms.uTint.value.setHex(0xffffff);
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
        this.onActiveChange(this.items[normalizedIndex]);
      }
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  public updateTheme(isDark: boolean) {
    if (this.isDark === isDark) return;
    this.isDark = isDark;
    
    this.cards.forEach((card) => {
      const index = this.items.findIndex(item => item.id === card.userData.id);
      const material = card.material as THREE.ShaderMaterial;
      material.uniforms.uIsDark.value = isDark;
      const texture = material.uniforms.tMap.value as THREE.CanvasTexture;
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      
      this.drawCardCanvas(ctx, this.items[index]);
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
    this.initCards();
  }

  public destroy() {
    window.removeEventListener('mousemove', this.boundOnMouseMove);
    window.removeEventListener('mouseup', this.boundOnMouseUp);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnMouseUp);
    window.removeEventListener('resize', this.boundOnResize);
    
    this.renderer.dispose();
    this.cards.forEach(c => {
      const material = c.material as THREE.ShaderMaterial;
      material.uniforms.tMap.value?.dispose();
      material.dispose();
      c.geometry.dispose();
    });
  }
}
