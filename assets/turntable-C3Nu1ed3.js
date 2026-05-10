import{L as W,c as q}from"./index-C6aJeBil.js";import{c as V,P as G,i as U,d as X,o as Y,a as _,r,n as y}from"./vue-vendor-CJvSAjNs.js";import"./three-DQbwDAWq.js";import"./vendor-Bsgzf06I.js";const J=X({name:"Turntable",components:{LayoutComponent:W},setup(){const T=r(!1),k=r(null),b=r(null),p=r(!1),o=r(!1),i=r([]),B=async()=>{const t="/Per_OutTaiwan/turntable/turntable.json";try{const e=await fetch(t);if(e.ok){const l=await e.json();l&&l.prizes&&(i.value=l.prizes)}}catch(e){console.log("loadPrizes",e)}y(d)},R=()=>{if(!f.value)return;const t=["#f87171","#fb923c","#fbbf24","#34d399","#60a5fa","#818cf8","#a78bfa","#f472b6"],e=t[Math.floor(Math.random()*t.length)];i.value.unshift({text:f.value,color:e,level:x.value}),f.value="",x.value=0,y(d)},L=t=>{i.value.length<=2||(i.value.splice(t,1),y(d))},A=async()=>{await B()},f=r(""),x=r(0),h=r(null),P=r(!1);let z=0,c=0,u=null;const O=.988,j=5e-4,E=(t,e)=>{let l=parseInt(t.slice(1,3),16)+e,a=parseInt(t.slice(3,5),16)+e,n=parseInt(t.slice(5,7),16)+e;return l=Math.max(0,Math.min(255,l)),a=Math.max(0,Math.min(255,a)),n=Math.max(0,Math.min(255,n)),`#${l.toString(16).padStart(2,"0")}${a.toString(16).padStart(2,"0")}${n.toString(16).padStart(2,"0")}`},d=()=>{const t=k.value;if(!t)return;const e=t.getContext("2d",{alpha:!0});if(!e)return;const l=document.documentElement.classList.contains("dark"),a=t.width/2,n=t.height/2,s=Math.max(0,Math.min(a,n)-20),v=Math.PI*2/i.value.length;if(s<=0){console.warn("Canvas size too small to draw turntable");return}e.clearRect(0,0,t.width,t.height),e.save(),e.beginPath(),e.arc(a,n,s+5,0,Math.PI*2),e.shadowBlur=30,e.shadowColor=l?"rgba(96, 165, 250, 0.3)":"rgba(0, 0, 0, 0.1)",e.fillStyle=l?"#0f172a":"#ffffff",e.fill(),e.restore(),i.value.forEach((m,D)=>{const M=z+D*v,F=M+v;e.save(),e.beginPath(),e.moveTo(a,n),e.arc(a,n,s,M,F);const S=e.createRadialGradient(a,n,0,a,n,s);S.addColorStop(0,m.color),S.addColorStop(1,E(m.color,-15)),e.fillStyle=S,e.fill(),e.strokeStyle=l?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.4)",e.lineWidth=1.5,e.stroke(),e.save(),e.translate(a,n),e.rotate(M+v/2),e.textAlign="right",m.level===1?(e.shadowBlur=8,e.shadowColor="#fff",e.fillStyle="#92400e"):e.fillStyle=l?"#f1f5f9":"#334155",e.font=`bold ${Math.max(14,s*.08)}px "Inter", system-ui, sans-serif`,e.fillText(m.text,s-25,6),e.restore(),e.restore()}),e.restore()},H=()=>{if(p.value){o.value||(o.value=!0,u&&(clearTimeout(u),u=null));return}h.value=null,p.value=!0,o.value=!1,c=Math.random()*.1+.4,u=window.setTimeout(()=>{p.value&&!o.value&&(o.value=!0)},8e3),window.threeBg&&window.threeBg.setSpeed&&window.threeBg.setSpeed(8),requestAnimationFrame(C)},C=()=>{z+=c,o.value?c*=O:(c*=.999,c<.2&&(c=.2)),window.threeBg&&window.threeBg.setSpeed&&window.threeBg.setSpeed(1+c*15),d(),o.value&&c<=j?(p.value=!1,o.value=!1,c=0,u&&(clearTimeout(u),u=null),window.threeBg&&window.threeBg.setSpeed&&window.threeBg.setSpeed(1),$()):requestAnimationFrame(C)},$=()=>{const t=Math.PI*2/i.value.length,e=(z%(Math.PI*2)+Math.PI*2)%(Math.PI*2),l=Math.PI*1.5;let a=-1;for(let n=0;n<i.value.length;n++){const s=(e+n*t)%(Math.PI*2),v=(s+t)%(Math.PI*2);if(s<v){if(l>=s&&l<=v){a=n;break}}else if(l>=s||l<=v){a=n;break}}a!==-1&&(h.value=i.value[a],P.value=!0,h.value.level===1&&(q(window.innerWidth/2,window.innerHeight/2,"#fbbf24"),window.threeBg&&typeof window.threeBg.celebrate=="function"&&window.threeBg.celebrate()))},g=()=>{const t=k.value,e=b.value;if(!t||!e)return;const l=Math.min(e.clientWidth,500);t.width=l,t.height=l,d()};let w=null;return Y(async()=>{await B(),g(),window.addEventListener("resize",g),b.value&&(w=new ResizeObserver(()=>{g()}),w.observe(b.value)),new MutationObserver(()=>{d()}).observe(document.documentElement,{attributes:!0,attributeFilter:["class"]})}),_(()=>{window.removeEventListener("resize",g),w&&w.disconnect()}),{canvasRef:k,containerRef:b,isSpinning:p,isBraking:o,prizes:i,newItemText:f,newItemLevel:x,result:h,showResultModal:P,isSettingsOpen:T,toggleSpin:H,addPrize:R,removePrize:L,resetToDefault:A}},template:`<LayoutComponent title="幸運轉盤" :show-announcement="false">
      <div class="turntable-main-wrapper">
        <div class="turntable-layout-container items-center justify-center min-h-[calc(100vh-200px)]">
          
          <!-- 轉盤區域 -->
          <div class="turntable-wheel-section" ref="containerRef">
            <div class="turntable-container">
              <div class="turntable-pointer"></div>
              <canvas id="turntableCanvas" ref="canvasRef" class="max-w-full h-auto"></canvas>
              
              <!-- 中心按鈕 -->
              <button 
                @click="toggleSpin"
                class="turntable-spin-btn"
                :class="isSpinning && !isBraking ? 'turntable-spin-btn-active' : (isBraking ? 'turntable-spin-btn-braking' : 'turntable-spin-btn-ready')"
                :disabled="isBraking"
              >
                <!-- Play Icon -->
                <svg v-if="!isSpinning" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <!-- Pause/Stop Icon -->
                <svg v-else-if="!isBraking" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z" />
                </svg>
                <!-- Braking Icon (Spinning) -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右下角設定切換按鈕 -->
      <div class="turntable-settings-toggle-container">
        <button 
          @click="isSettingsOpen = !isSettingsOpen"
          class="turntable-settings-toggle"
        >
          <svg v-if="!isSettingsOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 設定彈窗 -->
      <transition 
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isSettingsOpen" class="turntable-settings-modal-overlay" @click.self="isSettingsOpen = false">
          <div class="turntable-settings-panel">
            <div class="turntable-settings-header">
              <h2 class="turntable-settings-title">轉盤設定</h2>
              <button @click="isSettingsOpen = false" class="turntable-settings-close">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="mb-6">
              <label class="turntable-input-label">新增獎項</label>
              <div class="flex flex-col gap-3">
                <input 
                  v-model="newItemText" 
                  type="text" 
                  placeholder="輸入獎項名稱..."
                  @keyup.enter="addPrize"
                  class="turntable-input"
                />
                <div class="flex gap-2">
                  <select 
                    v-model="newItemLevel"
                    class="turntable-select"
                  >
                    <option :value="0">普通獎</option>
                    <option :value="3">三等獎</option>
                    <option :value="2">二等獎</option>
                    <option :value="1">一等獎</option>
                  </select>
                  <button 
                    @click="addPrize"
                    class="turntable-add-btn"
                  >
                    新增
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-2">
              <div class="turntable-prize-list-header">
                <label class="turntable-prize-list-title">目前獎項 ({{ prizes.length }})</label>
                <button @click="resetToDefault" class="turntable-reset-btn">重置預設</button>
              </div>
              <div class="max-h-[50vh] overflow-y-auto pr-2 space-y-3 no-scrollbar">
                <div v-for="(prize, index) in prizes" :key="index" 
                     class="turntable-prize-item"
                     :class="[
                       prize.level === 1 ? 'turntable-prize-item-level-1' : 
                       prize.level === 2 ? 'turntable-prize-item-level-2' : 
                       prize.level === 3 ? 'turntable-prize-item-level-3' : 
                       'turntable-prize-item-level-0'
                     ]">
                  <div class="flex items-center gap-3">
                    <div class="turntable-prize-color-swatch" :style="{ backgroundColor: prize.color }"></div>
                    <div class="flex flex-col">
                      <span class="turntable-prize-text" :class="prize.level === 1 ? 'turntable-prize-text-level-1' : 'turntable-prize-text-normal'">{{ prize.text }}</span>
                      <span v-if="prize.level > 0" :class="['turntable-prize-badge', 
                        prize.level === 1 ? 'turntable-prize-badge-level-1' : 
                        prize.level === 2 ? 'turntable-prize-badge-level-2' : 
                        'turntable-prize-badge-level-3'
                      ]">
                        {{ prize.level === 1 ? '一等獎' : prize.level === 2 ? '二等獎' : '三等獎' }}
                      </span>
                    </div>
                  </div>
                  <button @click="removePrize(index)" class="turntable-prize-delete-btn" title="刪除">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- 結果彈窗 -->
      <div v-if="showResultModal" class="turntable-modal-overlay bg-black/60">
        <div class="turntable-modal-content">
          <div class="text-center">
            <div class="turntable-modal-icon">🎉</div>
            <h3 class="turntable-modal-title">恭喜中獎！</h3>
            <div class="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6">{{ result?.text }}</div>
            <button 
              @click="showResultModal = false"
              class="turntable-modal-close-btn turntable-modal-close-btn-level-0"
            >
              太棒了！
            </button>
          </div>
        </div>
      </div>
    </LayoutComponent>`}),I=V(J);I.use(G,{theme:{preset:U,options:{darkModeSelector:".dark"}}});I.mount("#app");
