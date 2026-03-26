import{R as p,V as g,S as b,P as w,W as y,a as M,C as k,b as x,D as C,c as T,M as O,g as v,d as D,e as U,L as E,r as d,o as I,w as S,f as L,h as P}from"./index-DILs9UI0.js";class B{constructor(e,t,i,s,a){this.cards=[],this.radius=4,this.offset=0,this.targetOffset=0,this.velocity=0,this.isDragging=!1,this.lastMouseX=0,this.totalMoved=0,this.raycaster=new p,this.mouse=new g,this.isDark=!1,this.lastActiveIndex=-1,this.container=e,this.items=t,this.isDark=i,this.onSelect=s,this.onActiveChange=a,this.boundOnMouseMove=this.onMouseMove.bind(this),this.boundOnMouseUp=this.onMouseUp.bind(this),this.boundOnTouchMove=this.onTouchMove.bind(this),this.boundOnResize=this.onResize.bind(this),this.scene=new b,this.camera=new w(45,e.clientWidth/e.clientHeight,.1,1e3),this.camera.position.z=10,this.renderer=new y({antialias:!0,alpha:!0}),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.appendChild(this.renderer.domElement),this.initCards(),this.initEvents(),this.animate()}initCards(){const e=new M(1.92,2.88),t=`
      varying vec2 vUv;
      varying float vDist;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDist = mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,i=`
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
    `;this.items.forEach((s,a)=>{const o=document.createElement("canvas");o.width=512,o.height=768;const l=o.getContext("2d");this.drawCardCanvas(l,s);const r=new k(o),c=new x({uniforms:{tMap:{value:r},uOpacity:{value:1},uTint:{value:new T(3368601)},uBlur:{value:0},uTime:{value:0},uIsDark:{value:this.isDark}},vertexShader:t,fragmentShader:i,transparent:!0,side:C}),n=new O(e,c);this.scene.add(n),this.cards.push(n)})}drawCardCanvas(e,t){const i=this.isDark,s=e.createLinearGradient(0,0,0,768);i?(s.addColorStop(0,"#1A1A1A"),s.addColorStop(1,"#0A0A0A")):(s.addColorStop(0,"#F0F4F8"),s.addColorStop(1,"#D9E2EC")),e.fillStyle=s,e.fillRect(0,0,512,768);const a=i?"#00E5FF":"#044E3A";e.strokeStyle=a,e.lineWidth=10,e.strokeRect(20,20,472,728),e.shadowColor=a,e.shadowBlur=20,e.strokeStyle=a,e.lineWidth=2,e.strokeRect(30,30,452,708),e.shadowBlur=0,e.font="160px serif",e.textAlign="center",e.textBaseline="middle",e.fillText(t.icon,256,250),e.fillStyle=a,e.font='bold 48px "Courier New", monospace',e.fillText(t.title,256,450),e.fillStyle=i?"#FFFFFF":"#102A43",e.font='24px "Courier New", monospace',t.description.split("");let o="",l=520;const r=400;for(let c=0;c<t.description.length;c++){const n=o+t.description[c];e.measureText(n).width>r&&c>0?(e.fillText(o,256,l),o=t.description[c],l+=40):o=n}e.fillText(o,256,l),e.strokeStyle="#00E5FF",e.lineWidth=1,e.beginPath(),e.moveTo(100,480),e.lineTo(412,480),e.stroke()}initEvents(){this.container.addEventListener("mousedown",this.onMouseDown.bind(this)),window.addEventListener("mousemove",this.boundOnMouseMove),window.addEventListener("mouseup",this.boundOnMouseUp),this.container.addEventListener("touchstart",this.onTouchStart.bind(this)),window.addEventListener("touchmove",this.boundOnTouchMove),window.addEventListener("touchend",this.boundOnMouseUp),this.container.addEventListener("click",this.onClick.bind(this)),window.addEventListener("resize",this.boundOnResize),window.DeviceOrientationEvent&&window.addEventListener("deviceorientation",e=>{if(e.gamma){const t=e.gamma/90;this.scene.position.x=t*.5}if(e.beta){const t=(e.beta-45)/90;this.scene.position.y=-t*.5}})}onResize(){this.camera.aspect=this.container.clientWidth/this.container.clientHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight)}onMouseDown(e){this.isDragging=!0,this.lastMouseX=e.clientX,this.totalMoved=0,this.velocity=0}onMouseMove(e){if(!this.isDragging)return;const t=e.clientX-this.lastMouseX;this.totalMoved+=Math.abs(t),this.lastMouseX=e.clientX,this.targetOffset+=t*.01,this.velocity=t*.01}onTouchStart(e){this.isDragging=!0,this.lastMouseX=e.touches[0].clientX,this.totalMoved=0,this.velocity=0}onTouchMove(e){if(!this.isDragging)return;const t=e.touches[0].clientX-this.lastMouseX;this.totalMoved+=Math.abs(t),this.lastMouseX=e.touches[0].clientX,this.targetOffset+=t*.01,this.velocity=t*.01}onMouseUp(){this.isDragging=!1;const e=this.velocity*10;this.targetOffset+=e;const t=Math.PI*2/this.cards.length,i=Math.round(this.targetOffset/t)*t;v.to(this,{targetOffset:i,duration:1.2,ease:"power3.out"})}onClick(e){if(this.totalMoved>10)return;const t=this.container.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/this.container.clientWidth*2-1,this.mouse.y=-((e.clientY-t.top)/this.container.clientHeight)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const i=this.raycaster.intersectObjects(this.cards);if(i.length>0){const s=i[0].object,a=this.cards.indexOf(s),o=Math.PI*2/this.cards.length,r=((a*o+this.offset)%(Math.PI*2)+Math.PI)%(Math.PI*2)-Math.PI;if(Math.abs(r)<.5)v.to(s.position,{z:s.position.z+5,duration:.5,ease:"back.in(2)",onComplete:()=>{this.onSelect(this.items[a])}}),v.to(s.scale,{x:2,y:2,duration:.5});else{let n=-a*o-this.targetOffset;for(;n>Math.PI;)n-=Math.PI*2;for(;n<-Math.PI;)n+=Math.PI*2;v.to(this,{targetOffset:this.targetOffset+n,duration:.8,ease:"power3.out"})}}}animate(){if(requestAnimationFrame(this.animate.bind(this)),this.cards.length===0)return;this.isDragging?this.offset=this.targetOffset:this.offset+=(this.targetOffset-this.offset)*.1;const e=Math.PI*2/this.cards.length;if(this.cards.forEach((t,i)=>{const s=i*e+this.offset;t.position.x=Math.sin(s)*this.radius,t.position.z=Math.cos(s)*this.radius,t.rotation.y=s;const o=(t.position.z+this.radius)/(this.radius*2),l=.5+o*.5;t.scale.set(l,l,1);const r=t.material;r.uniforms.uTime.value=performance.now()/1e3,r.uniforms.uOpacity.value=Math.pow(o,1.5)*.95+.05,r.uniforms.uBlur.value=(1-o)*4,o<.6?r.uniforms.uTint.value.setHex(this.isDark?3368601:10066329):r.uniforms.uTint.value.setHex(16777215)}),this.onActiveChange){const t=Math.PI*2/this.cards.length,s=(Math.round(-this.offset/t)%this.cards.length+this.cards.length)%this.cards.length;s!==this.lastActiveIndex&&(this.lastActiveIndex=s,this.onActiveChange(this.items[s]))}this.renderer.render(this.scene,this.camera)}updateTheme(e){this.isDark!==e&&(this.isDark=e,this.cards.forEach((t,i)=>{const s=t.material;s.uniforms.uIsDark.value=e;const a=s.uniforms.tMap.value,l=a.image.getContext("2d");this.drawCardCanvas(l,this.items[i]),a.needsUpdate=!0}))}setItems(e){this.cards.forEach(t=>{var s;const i=t.material;(s=i.uniforms.tMap.value)==null||s.dispose(),i.dispose(),t.geometry.dispose(),this.scene.remove(t)}),this.cards=[],this.items=e,this.offset=0,this.targetOffset=0,this.velocity=0,this.initCards()}destroy(){window.removeEventListener("mousemove",this.boundOnMouseMove),window.removeEventListener("mouseup",this.boundOnMouseUp),window.removeEventListener("touchmove",this.boundOnTouchMove),window.removeEventListener("touchend",this.boundOnMouseUp),window.removeEventListener("resize",this.boundOnResize),this.renderer.dispose(),this.cards.forEach(e=>{var i;const t=e.material;(i=t.uniforms.tMap.value)==null||i.dispose(),t.dispose(),e.geometry.dispose()})}}const z=U({name:"Home",components:{LayoutComponent:E},setup(){const u=d(null);let e=null;const t=d(null),i=d(localStorage.getItem("darkMode")==="true"),s=d("all"),a=d(!1),o=[{id:"packing-list",title:"打包清單",description:"出國旅行必備物品清單，幫您輕鬆整理行李",icon:"🧳",link:"/Per_OutTaiwan/src/view/TakeList/TakeList.html",category:"tool"},{id:"turntable",title:"幸運轉盤",description:"猶豫不決嗎？讓轉盤幫您做決定！支援自定義獎項",icon:"🎡",link:"/Per_OutTaiwan/src/view/Turntable/Turntable.html",category:"game"},{id:"itinerary",title:"行程規劃",description:"即將推出：智能行程規劃工具，讓您的旅程更完美",icon:"✈️",link:"#",category:"tool"},{id:"budget",title:"預算計算",description:"即將推出：精確的旅行預算管理，掌控每一分錢",icon:"💰",link:"#",category:"tool"}],l=[{id:"all",name:"全部項目",icon:"💠"},{id:"tool",name:"實用工具",icon:"🛠️"},{id:"game",name:"趣味遊戲",icon:"🎮"}],r=P(()=>s.value==="all"?o:o.filter(n=>n.category===s.value));return I(()=>{u.value&&(e=new B(u.value,r.value,i.value,h=>{h.link!=="#"?window.location.href=h.link:(t.value=h,setTimeout(()=>{t.value=null},2e3))})),S(r,h=>{e&&e.setItems(h)});const n=new MutationObserver(h=>{h.forEach(m=>{if(m.attributeName==="class"){const f=document.body.classList.contains("dark");i.value=f,e&&e.updateTheme(f)}})});n.observe(document.body,{attributes:!0}),L(()=>{n.disconnect(),e&&e.destroy()})}),{carouselContainer:u,activeItem:t,features:o,selectedCategory:s,isCategoryMenuOpen:a,categories:l,filteredFeatures:r,selectCategory:n=>{s.value=n,a.value=!1}}},template:`
    <LayoutComponent title="OutTaiwan 3D 導航">
      <template #bottom-left>
        <!-- Category Selector -->
        <div class="flex flex-col-reverse items-start gap-4">
          <!-- Toggle Button -->
          <button @click="isCategoryMenuOpen = !isCategoryMenuOpen" 
                  class="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-400/40 text-slate-900 dark:text-slate-300 shadow-slate-200/50 dark:shadow-[0_0_20px_rgba(148,163,184,0.3)]">
            <!-- Glow effect for dark mode -->
            <div class="absolute inset-0 hidden dark:block bg-slate-400/10 animate-pulse"></div>
            
            <span v-if="!isCategoryMenuOpen" class="text-2xl relative z-10">{{ categories.find(c => c.id === selectedCategory)?.icon }}</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <!-- Tooltip -->
            <span class="absolute left-20 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-200 dark:border-white/10">
                {{ isCategoryMenuOpen ? '關閉選單' : '類別：' + categories.find(c => c.id === selectedCategory)?.name }}
            </span>
          </button>

          <!-- Category Menu -->
          <transition 
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform -translate-x-8 opacity-0"
              enter-to-class="transform translate-x-0 opacity-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform translate-x-0 opacity-100"
              leave-to-class="transform -translate-x-8 opacity-0"
          >
            <div v-if="isCategoryMenuOpen" 
                 class="w-48 glass-card p-3 rounded-3xl border border-white/20 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col gap-2">
              <button v-for="cat in categories" 
                      :key="cat.id"
                      @click="selectCategory(cat.id)"
                      class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
                      :class="selectedCategory === cat.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'">
                <span class="text-xl">{{ cat.icon }}</span>
                <span class="font-bold text-sm">{{ cat.name }}</span>
              </button>
            </div>
          </transition>
        </div>
      </template>

      <div class="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-transparent">
        
        <!-- Three.js Container -->
        <div ref="carouselContainer" class="w-full h-full"></div>

        <!-- Developing Toast -->
        <transition name="fade">
          <div v-if="activeItem" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#1A1A1A] border border-[#00E5FF] p-6 rounded-lg shadow-[0_0_30px_rgba(0,229,255,0.3)] text-[#00E5FF] font-mono text-center">
            <div class="text-2xl mb-2">🚧 ACCESS DENIED 🚧</div>
            <div>{{ activeItem.title }} 正在開發中...</div>
          </div>
        </transition>

      </div>
    </LayoutComponent>
  `});D(z).mount("#app");
