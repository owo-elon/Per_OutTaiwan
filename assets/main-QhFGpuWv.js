import{L as M}from"./index-BHD_QJgL.js";import{c as y,P as w,i as b,d as C,r as m,o as k,w as O,a as D,b as I}from"./vue-vendor-CPMyeukm.js";import{R as T,V as P,S as x,P as U,W as E,a as S,C as L,b as B,D as z,c as A,M as F}from"./three-DQbwDAWq.js";import{aN as u}from"./vendor-Bsgzf06I.js";class X{constructor(e,t,s,i,o){this.cards=[],this.radius=4,this.offset=0,this.targetOffset=0,this.velocity=0,this.isDragging=!1,this.lastMouseX=0,this.lastMouseY=0,this.totalMoved=0,this.raycaster=new T,this.mouse=new P,this.isDark=!1,this.lastActiveIndex=-1,this.container=e,this.items=t,this.isDark=s,this.onSelect=i,this.onActiveChange=o,this.boundOnMouseMove=this.onMouseMove.bind(this),this.boundOnMouseUp=this.onMouseUp.bind(this),this.boundOnTouchMove=this.onTouchMove.bind(this),this.boundOnResize=this.onResize.bind(this),this.scene=new x,this.camera=new U(45,e.clientWidth/e.clientHeight,.1,1e3),this.camera.position.z=10,this.renderer=new E({antialias:!0,alpha:!0}),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.appendChild(this.renderer.domElement),this.initCards(),this.initEvents(),this.animate()}initCards(){const e=new S(1.92,2.88),t=`
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
    `;this.items.forEach((i,o)=>{const n=document.createElement("canvas");n.width=512,n.height=768;const l=n.getContext("2d");this.drawCardCanvas(l,i);const r=new L(n),c=new B({uniforms:{tMap:{value:r},uOpacity:{value:1},uTint:{value:new A(3368601)},uBlur:{value:0},uTime:{value:0},uIsDark:{value:this.isDark}},vertexShader:t,fragmentShader:s,transparent:!0,side:z}),a=new F(e,c);a.userData.id=i.id,this.scene.add(a),this.cards.push(a)})}drawCardCanvas(e,t){const s=this.isDark,i=e.createLinearGradient(0,0,0,768);s?(i.addColorStop(0,"#1A1A1A"),i.addColorStop(1,"#0A0A0A")):(i.addColorStop(0,"#F0F4F8"),i.addColorStop(1,"#D9E2EC")),e.fillStyle=i,e.fillRect(0,0,512,768);const o=s?"#00E5FF":"#044E3A";e.strokeStyle=o,e.lineWidth=10,e.strokeRect(20,20,472,728),e.shadowColor=o,e.shadowBlur=20,e.strokeStyle=o,e.lineWidth=2,e.strokeRect(30,30,452,708),e.shadowBlur=0,e.font="160px serif",e.textAlign="center",e.textBaseline="middle",e.fillText(t.icon,256,250),e.fillStyle=o,e.font='bold 48px "Courier New", monospace',e.fillText(t.title,256,450),e.fillStyle=s?"#FFFFFF":"#102A43",e.font='24px "Courier New", monospace',t.description.split("");let n="",l=520;const r=400;for(let c=0;c<t.description.length;c++){const a=n+t.description[c];e.measureText(a).width>r&&c>0?(e.fillText(n,256,l),n=t.description[c],l+=40):n=a}e.fillText(n,256,l),e.strokeStyle="#00E5FF",e.lineWidth=1,e.beginPath(),e.moveTo(100,480),e.lineTo(412,480),e.stroke()}initEvents(){this.container.addEventListener("mousedown",this.onMouseDown.bind(this)),window.addEventListener("mousemove",this.boundOnMouseMove),window.addEventListener("mouseup",this.boundOnMouseUp),this.container.addEventListener("touchstart",this.onTouchStart.bind(this)),window.addEventListener("touchmove",this.boundOnTouchMove,{passive:!1}),window.addEventListener("touchend",this.boundOnMouseUp),window.addEventListener("touchcancel",this.boundOnMouseUp),this.container.addEventListener("click",this.onClick.bind(this)),window.addEventListener("resize",this.boundOnResize),window.DeviceOrientationEvent&&window.addEventListener("deviceorientation",e=>{if(e.gamma){const t=e.gamma/90;this.scene.position.x=t*.5}if(e.beta){const t=(e.beta-45)/90;this.scene.position.y=-t*.5}})}onResize(){this.camera.aspect=this.container.clientWidth/this.container.clientHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight)}onMouseDown(e){this.isDragging=!0,this.lastMouseX=e.clientX,this.totalMoved=0,this.velocity=0}onMouseMove(e){if(!this.isDragging)return;const t=e.clientX-this.lastMouseX;this.totalMoved+=Math.abs(t),this.lastMouseX=e.clientX,this.targetOffset+=t*.01,this.velocity=t*.01}onTouchStart(e){e.touches.length!==0&&(this.isDragging=!0,this.lastMouseX=e.touches[0].clientX,this.lastMouseY=e.touches[0].clientY,this.totalMoved=0,this.velocity=0)}onTouchMove(e){if(!this.isDragging||e.touches.length===0)return;const t=e.touches[0],s=t.clientX-this.lastMouseX,i=t.clientY-this.lastMouseY;Math.abs(s)>Math.abs(i)&&Math.abs(s)>5&&e.cancelable&&e.preventDefault();const o=t.clientX-this.lastMouseX;this.totalMoved+=Math.abs(o),this.lastMouseX=t.clientX,this.lastMouseY=t.clientY,this.targetOffset+=o*.01,this.velocity=o*.01}onMouseUp(){if(!this.isDragging)return;this.isDragging=!1;const e=this.velocity*10;this.targetOffset+=e;const t=Math.PI*2/this.cards.length,s=Math.round(this.targetOffset/t)*t;u.to(this,{targetOffset:s,duration:1.2,ease:"power3.out"})}onClick(e){if(this.totalMoved>10)return;const t=this.container.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/this.container.clientWidth*2-1,this.mouse.y=-((e.clientY-t.top)/this.container.clientHeight)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const s=this.raycaster.intersectObjects(this.cards);if(s.length>0){const i=s[0].object,o=this.items.findIndex(c=>c.id===i.userData.id),n=Math.PI*2/this.cards.length;let r=((o*n+this.offset)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);if(r>Math.PI&&(r-=Math.PI*2),Math.abs(r)<.5){i.userData.ejected=!0,window.threeBg&&typeof window.threeBg.celebrate=="function"&&window.threeBg.celebrate();const c=i.material;u.to(i.rotation,{y:i.rotation.y+Math.PI*2,duration:.8,ease:"power2.inOut"}),u.to(this,{targetOffset:this.targetOffset+Math.PI,duration:1.2,ease:"power3.inOut"}),u.to(c.uniforms.uOpacity,{value:0,duration:.8,ease:"power2.in"}),this.cards.forEach(a=>{const d=a.material;u.to(d.uniforms.uOpacity,{value:0,duration:1,ease:"power2.in"})}),u.to(i.position,{z:i.position.z+2,y:i.position.y+.5,duration:.8,ease:"power2.inOut",onComplete:()=>{this.onSelect(this.items[o]),setTimeout(()=>{i.userData.ejected=!1,this.cards.forEach(a=>{a.material.uniforms.uOpacity.value=1})},1e3)}})}else{let a=-o*n-this.targetOffset;for(;a>Math.PI;)a-=Math.PI*2;for(;a<-Math.PI;)a+=Math.PI*2;u.to(this,{targetOffset:this.targetOffset+a,duration:.8,ease:"power3.out"})}}}rotateToIndex(e){if(this.cards.length===0)return;const t=Math.PI*2/this.cards.length;let i=-e*t-this.targetOffset;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;u.to(this,{targetOffset:this.targetOffset+i,duration:.8,ease:"power3.out"})}animate(){if(requestAnimationFrame(this.animate.bind(this)),this.cards.length===0)return;this.isDragging?this.offset=this.targetOffset:this.offset+=(this.targetOffset-this.offset)*.1;const e=Math.PI*2/this.cards.length;if(this.cards.sort((t,s)=>t.position.z-s.position.z),this.cards.forEach(t=>{let o=(this.items.findIndex(c=>c.id===t.userData.id)*e+this.offset)%(Math.PI*2);if(o>Math.PI&&(o-=Math.PI*2),o<-Math.PI&&(o+=Math.PI*2),!t.userData.ejected){t.position.x=Math.sin(o)*this.radius,t.position.z=Math.cos(o)*this.radius,t.rotation.y=o;const d=.5+(t.position.z+this.radius)/(this.radius*2)*.5;t.scale.set(d,d,1)}const l=(t.position.z+this.radius)/(this.radius*2),r=t.material;r.uniforms.uTime.value=performance.now()/1e3,r.uniforms.uOpacity.value=Math.pow(l,1.5)*.95+.05,r.uniforms.uBlur.value=(1-l)*4,l<.6?r.uniforms.uTint.value.setHex(this.isDark?3368601:10066329):r.uniforms.uTint.value.setHex(16777215)}),this.onActiveChange){const t=Math.PI*2/this.cards.length,i=(Math.round(-this.offset/t)%this.cards.length+this.cards.length)%this.cards.length;i!==this.lastActiveIndex&&(this.lastActiveIndex=i,this.onActiveChange(this.items[i]))}this.renderer.render(this.scene,this.camera)}updateTheme(e){this.isDark!==e&&(this.isDark=e,this.cards.forEach(t=>{const s=this.items.findIndex(r=>r.id===t.userData.id),i=t.material;i.uniforms.uIsDark.value=e;const o=i.uniforms.tMap.value,l=o.image.getContext("2d");this.drawCardCanvas(l,this.items[s]),o.needsUpdate=!0}))}setItems(e){this.cards.forEach(t=>{var i;const s=t.material;(i=s.uniforms.tMap.value)==null||i.dispose(),s.dispose(),t.geometry.dispose(),this.scene.remove(t)}),this.cards=[],this.items=e,this.offset=0,this.targetOffset=0,this.velocity=0,this.initCards()}destroy(){window.removeEventListener("mousemove",this.boundOnMouseMove),window.removeEventListener("mouseup",this.boundOnMouseUp),window.removeEventListener("touchmove",this.boundOnTouchMove),window.removeEventListener("touchend",this.boundOnMouseUp),window.removeEventListener("resize",this.boundOnResize),this.renderer.dispose(),this.cards.forEach(e=>{var s;const t=e.material;(s=t.uniforms.tMap.value)==null||s.dispose(),t.dispose(),e.geometry.dispose()})}}const R=C({name:"Home",components:{LayoutComponent:M},setup(){const f=m(null);let e=null;const t=m(null),s=m(localStorage.getItem("darkMode")==="true"),i=m("all"),o=m(!1),n=[{id:"packing-list",title:"打包清單",description:"出國旅行必備物品清單，幫您輕鬆整理行李",icon:"🧳",link:"/Per_OutTaiwan/src/view/takelist/takelist.html",category:"tool"},{id:"turntable",title:"幸運轉盤",description:"猶豫不決嗎？讓轉盤幫您做決定！支援自定義獎項",icon:"🎡",link:"/Per_OutTaiwan/src/view/turntable/turntable.html",category:"game"},{id:"itinerary",title:"行程規劃",description:"即將推出：智能行程規劃工具，讓您的旅程更完美",icon:"✈️",link:"#",category:"tool"},{id:"budget",title:"預算計算",description:"即將推出：精確的旅行預算管理，掌控每一分錢",icon:"💰",link:"#",category:"tool"}],l=[{id:"all",name:"全部項目",icon:"💠"},{id:"tool",name:"實用工具",icon:"🛠️"},{id:"game",name:"趣味遊戲",icon:"🎮"}],r=I(()=>n);return k(()=>{f.value&&(e=new X(f.value,n,s.value,h=>{h.link!=="#"?window.location.href=h.link:(t.value=h,setTimeout(()=>{t.value=null},2e3))})),O(i,h=>{if(e)if(h==="all")e.rotateToIndex(0);else{const v=n.findIndex(g=>g.category===h);v!==-1&&e.rotateToIndex(v)}});const a=new MutationObserver(h=>{h.forEach(v=>{if(v.attributeName==="class"){const g=document.body.classList.contains("dark");s.value=g,e&&e.updateTheme(g)}})});a.observe(document.body,{attributes:!0});const d=h=>{h.target.closest(".home-category-container")||(o.value=!1)};window.addEventListener("click",d),D(()=>{a.disconnect(),window.removeEventListener("click",d),e&&e.destroy()})}),{carouselContainer:f,activeItem:t,features:n,selectedCategory:i,isCategoryMenuOpen:o,categories:l,filteredFeatures:r,selectCategory:a=>{i.value=a,o.value=!1}}},template:`
    <LayoutComponent title="OutTaiwan 3D 導航">
      <template #bottom-left>
        <!-- Category Selector -->
        <div class="home-category-container">
          <!-- Toggle Button -->
          <button @click="isCategoryMenuOpen = !isCategoryMenuOpen" 
                  class="home-category-toggle">
            <!-- Glow effect for dark mode -->
            <div class="home-category-glow"></div>
            
            <span v-if="!isCategoryMenuOpen" class="home-category-icon">{{ categories.find(c => c.id === selectedCategory)?.icon }}</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="home-category-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <!-- Tooltip -->
            <span class="home-category-tooltip">
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
            <div>{{ activeItem.title }} 正在開發中...</div>
          </div>
        </transition>

      </div>
    </LayoutComponent>
  `}),p=y(R);p.use(w,{theme:{preset:b,options:{darkModeSelector:".dark"}}});p.mount("#app");
