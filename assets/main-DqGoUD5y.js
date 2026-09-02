import{L as b}from"./index-C6aJeBil.js";import{c as T,P as C,i as k,r as g,o as O,w as I,a as D,b as E}from"./vue-vendor-CJvSAjNs.js";import{R as U,V as S,S as L,P as x,W as P,a as W,C as B,b as z,D as A,c as F,M as H}from"./three-DQbwDAWq.js";import{aN as w}from"./vendor-Bsgzf06I.js";class X{constructor(e,t,s,i,o){this.cards=[],this.radius=5.5,this.offset=0,this.targetOffset=0,this.velocity=0,this.isDragging=!1,this.lastMouseX=0,this.lastMouseY=0,this.totalMoved=0,this.raycaster=new U,this.mouse=new S,this.isDark=!1,this.lastActiveIndex=-1,this.hintOverlay=null,this.hintTimeout=null,this.wheelSnapTimeout=null,this.container=e,this.items=t,this.isDark=s,this.onSelect=i,this.onActiveChange=o,this.boundOnMouseMove=this.onMouseMove.bind(this),this.boundOnMouseUp=this.onMouseUp.bind(this),this.boundOnTouchMove=this.onTouchMove.bind(this),this.boundOnResize=this.onResize.bind(this),this.boundOnWheel=this.onWheel.bind(this),this.scene=new L,this.camera=new x(45,e.clientWidth/e.clientHeight,.1,1e3),this.camera.position.z=12,this.renderer=new P({antialias:!0,alpha:!0}),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.appendChild(this.renderer.domElement),this.prepareRenderItems(),this.initCards(),this.initEvents(),this.initHint(),this.animate()}prepareRenderItems(){if(this.renderItems=[],this.items.length===0)return;let e=[...this.items];for(;e.length<12;)e=[...e,...this.items];this.renderItems=e.map((t,s)=>({...t,uid:t.id+"_"+s,original:t}))}initHint(){if(!document.getElementById("threecarousel-hint-style")){const e=document.createElement("style");e.id="threecarousel-hint-style",e.innerHTML=`
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
      `,document.head.appendChild(e)}this.hintOverlay=document.createElement("div"),this.hintOverlay.className="carousel-swipe-hint",this.hintOverlay.innerHTML=`
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 11V6a3 3 0 0 1 6 0v11M9 11l-3 3v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6l-3-3"/>
      </svg>
      <div class="swipe-arrows">
        <span>&larr;</span><span>&rarr;</span>
      </div>
    `,this.container.appendChild(this.hintOverlay),this.resetHintTimer()}resetHintTimer(){this.hintOverlay&&(this.hintOverlay.classList.remove("show"),clearTimeout(this.hintTimeout),!(window.innerWidth>=768)&&(this.hintTimeout=setTimeout(()=>{this.hintOverlay&&!this.isDragging&&this.hintOverlay.classList.add("show")},4e3)))}initCards(){const e=new W(1.92,2.88),t=`
      varying vec2 vUv;
      varying float vDist;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDist = mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,s=`
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
    `;this.renderItems.forEach((i,o)=>{const n=document.createElement("canvas");n.width=512,n.height=768;const d=n.getContext("2d");this.drawCardCanvas(d,i);const h=new B(n),c=new z({uniforms:{tMap:{value:h},uOpacity:{value:1},uTint:{value:new F(3368601)},uBlur:{value:0},uTime:{value:0},uIsDark:{value:this.isDark}},vertexShader:t,fragmentShader:s,transparent:!0,side:A}),a=new H(e,c);a.userData.uid=i.uid,this.scene.add(a),this.cards.push(a)})}drawCardCanvas(e,t){const s=this.isDark,i=512,o=768,n=60;e.clearRect(0,0,i,o);const d=(r,l,v,f,m)=>{e.beginPath(),e.moveTo(r+m,l),e.lineTo(r+v-m,l),e.quadraticCurveTo(r+v,l,r+v,l+m),e.lineTo(r+v,l+f-m),e.quadraticCurveTo(r+v,l+f,r+v-m,l+f),e.lineTo(r+m,l+f),e.quadraticCurveTo(r,l+f,r,l+f-m),e.lineTo(r,l+m),e.quadraticCurveTo(r,l,r+m,l),e.closePath()};e.save(),d(0,0,i,o,n),e.clip();const h=e.createLinearGradient(0,0,0,o);s?(h.addColorStop(0,"#1A1A1A"),h.addColorStop(1,"#0A0A0A")):(h.addColorStop(0,"#F0F4F8"),h.addColorStop(1,"#D9E2EC")),e.fillStyle=h,e.fillRect(0,0,i,o),e.restore();const c=s?"#00E5FF":"#044E3A";e.save(),e.strokeStyle=c,e.lineWidth=12,d(6,6,i-12,o-12,n-6),e.stroke(),e.shadowColor=c,e.shadowBlur=15,e.strokeStyle=c,e.lineWidth=2,d(20,20,i-40,o-40,n-20),e.stroke(),e.shadowBlur=0,e.restore(),e.font="160px serif",e.textAlign="center",e.textBaseline="middle",e.fillText(t.icon,256,250),e.fillStyle=c,e.font='bold 48px "Courier New", monospace',e.fillText(t.title,256,450),e.fillStyle=s?"#FFFFFF":"#102A43",e.font='24px "Courier New", monospace',t.description.split("");let a="",p=520;const u=400;for(let r=0;r<t.description.length;r++){const l=a+t.description[r];e.measureText(l).width>u&&r>0?(e.fillText(a,256,p),a=t.description[r],p+=40):a=l}e.fillText(a,256,p),e.strokeStyle=s?"#00E5FF":"#044E3A",e.lineWidth=1,e.beginPath(),e.moveTo(100,480),e.lineTo(412,480),e.stroke()}initEvents(){this.container.addEventListener("mousedown",this.onMouseDown.bind(this)),window.addEventListener("mousemove",this.boundOnMouseMove),window.addEventListener("mouseup",this.boundOnMouseUp),this.container.addEventListener("touchstart",this.onTouchStart.bind(this)),window.addEventListener("touchmove",this.boundOnTouchMove,{passive:!1}),window.addEventListener("touchend",this.boundOnMouseUp),window.addEventListener("touchcancel",this.boundOnMouseUp),this.container.addEventListener("click",this.onClick.bind(this)),this.container.addEventListener("wheel",this.boundOnWheel,{passive:!1}),window.addEventListener("resize",this.boundOnResize),window.DeviceOrientationEvent&&window.addEventListener("deviceorientation",e=>{if(e.gamma){const t=e.gamma/90;this.scene.position.x=t*.5}if(e.beta){const t=(e.beta-45)/90;this.scene.position.y=-t*.5}})}onResize(){this.camera.aspect=this.container.clientWidth/this.container.clientHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight)}onMouseDown(e){window.innerWidth>=768||(w.killTweensOf(this,"targetOffset"),this.isDragging=!0,this.lastMouseX=e.clientX,this.totalMoved=0,this.velocity=0,this.resetHintTimer())}onMouseMove(e){if(window.innerWidth>=768||!this.isDragging)return;const t=e.clientX-this.lastMouseX;this.totalMoved+=Math.abs(t),this.lastMouseX=e.clientX,this.targetOffset+=t*.01,this.velocity=t*.01}onTouchStart(e){window.innerWidth>=768||e.touches.length!==0&&(w.killTweensOf(this,"targetOffset"),this.isDragging=!0,this.lastMouseX=e.touches[0].clientX,this.lastMouseY=e.touches[0].clientY,this.totalMoved=0,this.velocity=0,this.resetHintTimer())}onTouchMove(e){if(window.innerWidth>=768||!this.isDragging||e.touches.length===0)return;const t=e.touches[0],s=t.clientX-this.lastMouseX,i=t.clientY-this.lastMouseY;Math.abs(s)>Math.abs(i)&&Math.abs(s)>5&&e.cancelable&&e.preventDefault();const o=t.clientX-this.lastMouseX;this.totalMoved+=Math.abs(o),this.lastMouseX=t.clientX,this.lastMouseY=t.clientY,this.targetOffset+=o*.01,this.velocity=o*.01}onMouseUp(){if(!this.isDragging)return;this.isDragging=!1;const e=this.velocity*10;this.targetOffset+=e;const t=Math.PI*2/this.cards.length,s=Math.round(this.targetOffset/t)*t;w.to(this,{targetOffset:s,duration:1.2,ease:"power3.out"})}onWheel(e){if(e.preventDefault(),Math.abs(e.deltaY)>0){w.killTweensOf(this,"targetOffset");const t=Math.PI*2/this.cards.length,s=window.innerWidth>=768?.4:.2;this.targetOffset-=Math.sign(e.deltaY)*t*s,this.resetHintTimer(),clearTimeout(this.wheelSnapTimeout),this.wheelSnapTimeout=setTimeout(()=>{const i=Math.round(this.targetOffset/t)*t;w.to(this,{targetOffset:i,duration:.6,ease:"power3.out"})},150)}}onClick(e){if(this.totalMoved>10)return;const t=this.container.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/this.container.clientWidth*2-1,this.mouse.y=-((e.clientY-t.top)/this.container.clientHeight)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const s=this.raycaster.intersectObjects(this.cards);if(s.length>0){const i=s[0].object,o=this.renderItems.findIndex(n=>n.uid===i.userData.uid);this.onSelect(this.renderItems[o].original)}}rotateToIndex(e){if(this.cards.length===0)return;const t=Math.PI*2/this.cards.length;let i=-e*t-this.targetOffset;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;w.to(this,{targetOffset:this.targetOffset+i,duration:.8,ease:"power3.out"})}animate(){if(requestAnimationFrame(this.animate.bind(this)),this.cards.length===0)return;this.isDragging?this.offset=this.targetOffset:this.offset+=(this.targetOffset-this.offset)*.1;const e=Math.PI*2/this.cards.length,t=window.innerWidth>=768,s=-this.offset/e;if(this.cards.sort((i,o)=>i.position.z-o.position.z),this.cards.forEach(i=>{const o=this.renderItems.findIndex(c=>c.uid===i.userData.uid);let n=o-s;const d=this.cards.length;for(;n>d/2;)n-=d;for(;n<-d/2;)n+=d;if(!i.userData.ejected)if(t){let c=1.2,a=2.2;window.innerWidth>=1600?(c=1.6,a=2.8):window.innerWidth>=1200&&(c=1.4,a=2.5);const p=o%2===0?1:-1;i.position.x=p*a,i.position.y=0,i.position.z=5-n*4,i.rotation.x=0,i.rotation.y=p*-.12,i.rotation.z=0,i.scale.set(c,c,1)}else{let a=(o*e+this.offset)%(Math.PI*2);a>Math.PI&&(a-=Math.PI*2),a<-Math.PI&&(a+=Math.PI*2),i.position.x=Math.sin(a)*this.radius,i.position.z=Math.cos(a)*this.radius,i.rotation.y=a*.5;const u=(i.position.z+this.radius)/(this.radius*2),l=(window.innerWidth>400?1.1:.9)*(.75+u*.25);i.scale.set(l,l,1)}const h=i.material;if(h.uniforms.uTime.value=performance.now()/1e3,t){let c=0,a=0;n>=0?(c=Math.max(0,1-n*.2),a=n*.5):(c=Math.max(0,1+n*1.5),a=Math.abs(n)*3),h.uniforms.uOpacity.value=c,h.uniforms.uBlur.value=a,Math.abs(n)>.5?h.uniforms.uTint.value.setHex(this.isDark?2245734:12307677):h.uniforms.uTint.value.setHex(16777215)}else{const a=(i.position.z+this.radius)/(this.radius*2);h.uniforms.uOpacity.value=Math.pow(a,1.5)*.95+.05,h.uniforms.uBlur.value=(1-a)*4,a<.6?h.uniforms.uTint.value.setHex(this.isDark?3368601:10066329):h.uniforms.uTint.value.setHex(16777215)}}),this.onActiveChange){const i=Math.PI*2/this.cards.length,n=(Math.round(-this.offset/i)%this.cards.length+this.cards.length)%this.cards.length;n!==this.lastActiveIndex&&(this.lastActiveIndex=n,this.onActiveChange(this.renderItems[n].original))}this.renderer.render(this.scene,this.camera)}updateTheme(e){this.isDark!==e&&(this.isDark=e,this.cards.forEach(t=>{const s=this.renderItems.findIndex(h=>h.uid===t.userData.uid),i=t.material;i.uniforms.uIsDark.value=e;const o=i.uniforms.tMap.value,d=o.image.getContext("2d");this.drawCardCanvas(d,this.renderItems[s].original),o.needsUpdate=!0}))}setItems(e){this.cards.forEach(t=>{var i;const s=t.material;(i=s.uniforms.tMap.value)==null||i.dispose(),s.dispose(),t.geometry.dispose(),this.scene.remove(t)}),this.cards=[],this.items=e,this.offset=0,this.targetOffset=0,this.velocity=0,this.prepareRenderItems(),this.initCards()}destroy(){window.removeEventListener("mousemove",this.boundOnMouseMove),window.removeEventListener("mouseup",this.boundOnMouseUp),window.removeEventListener("touchmove",this.boundOnTouchMove),window.removeEventListener("touchend",this.boundOnMouseUp),window.removeEventListener("resize",this.boundOnResize),this.container.removeEventListener("wheel",this.boundOnWheel),this.hintOverlay&&this.hintOverlay.remove(),clearTimeout(this.hintTimeout),clearTimeout(this.wheelSnapTimeout),this.renderer.dispose(),this.cards.forEach(e=>{var s;const t=e.material;(s=t.uniforms.tMap.value)==null||s.dispose(),t.dispose(),e.geometry.dispose()})}}const R={name:"Home",setup(){const M=g(null);let e=null;const t=g(null),s=g(localStorage.getItem("darkMode")==="true"),i=g("all"),o=g(!1),n=g([]),d=g([]),h=async()=>{try{const r=await fetch("/Per_OutTaiwan/home/home.json");if(r.ok){const l=await r.json();n.value=l.features||[],d.value=l.categories||[],a()}else console.error("Fetch failed with status:",r.status)}catch(u){console.error("Failed to load home data",u)}},c=E(()=>n.value),a=()=>{M.value&&n.value.length>0&&(e=new X(M.value,n.value,s.value,u=>{u.link!=="#"?window.location.href=`/Per_OutTaiwan/${u.link}`:(t.value=u,setTimeout(()=>{t.value=null},2e3))}))};return O(()=>{h(),I(i,v=>{if(e)if(v==="all")e.rotateToIndex(0);else{const f=n.value.findIndex(m=>m.category===v);f!==-1&&e.rotateToIndex(f)}});const u=new MutationObserver(v=>{v.forEach(f=>{if(f.attributeName==="class"){const m=document.body.classList.contains("dark");s.value=m,e&&e.updateTheme(m)}})});u.observe(document.body,{attributes:!0});const r=v=>{v.target.closest(".home-category-container")||(o.value=!1)},l=()=>{o.value=!1};window.addEventListener("click",r),window.addEventListener("scroll",l,{passive:!0}),D(()=>{u.disconnect(),window.removeEventListener("click",r),window.removeEventListener("scroll",l),e&&e.destroy()})}),{carouselContainer:M,activeItem:t,features:n,selectedCategory:i,isCategoryMenuOpen:o,categories:d,filteredFeatures:c,selectCategory:u=>{i.value=u,o.value=!1}}},template:`
    <LayoutComponent title="elon Tools" :show-announcement="false">
      <template #bottom-left>
        <!-- Category Selector -->
        <div class="home-category-container">
          <!-- Toggle Button -->
          <button @click.stop="isCategoryMenuOpen = !isCategoryMenuOpen" 
                  class="home-category-toggle">
            <!-- Glow effect for dark mode -->
            <div class="home-category-glow pointer-events-none"></div>
            
            <span v-if="!isCategoryMenuOpen" class="home-category-icon pointer-events-none">{{ categories.find(c => c.id === selectedCategory)?.icon }}</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="home-category-svg pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <!-- Tooltip -->
            <span class="home-category-tooltip pointer-events-none">
                {{ isCategoryMenuOpen ? '關閉選單' : '類別：' + categories.find(c => c.id === selectedCategory)?.name }}
            </span>
          </button>

          <!-- Category Menu -->
          <transition 
              enter-active-class="menu-enter-active"
              enter-from-class="menu-enter-from"
              enter-to-class="menu-enter-to"
              leave-active-class="menu-leave-active"
              leave-from-class="menu-leave-from"
              leave-to-class="menu-leave-to"
          >
            <div v-if="isCategoryMenuOpen" 
                 class="home-category-menu glass-card">
              <button v-for="cat in categories" 
                      :key="cat.id"
                      @click="selectCategory(cat.id)"
                      class="home-category-item"
                      :class="selectedCategory === cat.id ? 'home-category-item-active' : 'home-category-item-inactive'">
                <span class="home-category-item-icon">{{ cat.icon }}</span>
                <span class="home-category-item-text">{{ cat.name }}</span>
              </button>
            </div>
          </transition>
        </div>
      </template>

      <div class="home-carousel-wrapper">
        
        <!-- Three.js Container -->
        <div ref="carouselContainer" class="home-carousel-container"></div>

        <!-- Developing Toast -->
        <transition name="fade">
          <div v-if="activeItem" class="home-toast">
            <div class="home-toast-title">🚧 ACCESS DENIED 🚧</div>
            <div>{{ activeItem?.title }} 正在開發中...</div>
          </div>
        </transition>

      </div>
    </LayoutComponent>
  `},y=T(R);y.component("LayoutComponent",b);y.use(C,{theme:{preset:k,options:{darkModeSelector:".dark"}}});y.mount("#homeApp");
