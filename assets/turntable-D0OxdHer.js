import{L as D,c as F}from"./index-BHD_QJgL.js";import{c as W,P as G,i as V,d as U,o as X,n as g,a as Y,r as s}from"./vue-vendor-CPMyeukm.js";import"./three-DQbwDAWq.js";import"./vendor-Bsgzf06I.js";const _=U({name:"Turntable",components:{LayoutComponent:D},setup(){const I=s(!0),S=s({show:!1,message:""}),w=s(null),y=s(null),p=s(!1),i=s(!1),o=s([{text:"100萬",color:"#fbbf24",level:1},{text:"10萬",color:"#94a3b8",level:2},{text:"1萬",color:"#d97706",level:3},{text:"銘謝惠顧",color:"#f1f5f9",level:0},{text:"銘謝惠顧",color:"#e2e8f0",level:0},{text:"銘謝惠顧",color:"#cbd5e1",level:0}]),f=s(""),m=s(0),h=s(null),B=s(!1);let x=0,c=0,u=null;const T=.988,j=5e-4,L=(t,e)=>{let n=parseInt(t.slice(1,3),16)+e,a=parseInt(t.slice(3,5),16)+e,l=parseInt(t.slice(5,7),16)+e;return n=Math.max(0,Math.min(255,n)),a=Math.max(0,Math.min(255,a)),l=Math.max(0,Math.min(255,l)),`#${n.toString(16).padStart(2,"0")}${a.toString(16).padStart(2,"0")}${l.toString(16).padStart(2,"0")}`},v=()=>{const t=w.value;if(!t)return;const e=t.getContext("2d",{alpha:!0});if(!e)return;const n=document.documentElement.classList.contains("dark"),a=t.width/2,l=t.height/2,r=Math.min(a,l)-20,d=Math.PI*2/o.value.length;e.clearRect(0,0,t.width,t.height),e.save(),e.beginPath(),e.arc(a,l,r+5,0,Math.PI*2),e.shadowBlur=30,e.shadowColor=n?"rgba(96, 165, 250, 0.3)":"rgba(0, 0, 0, 0.1)",e.fillStyle=n?"#0f172a":"#ffffff",e.fill(),e.restore(),o.value.forEach((b,H)=>{const z=x+H*d,q=z+d;e.save(),e.beginPath(),e.moveTo(a,l),e.arc(a,l,r,z,q);const M=e.createRadialGradient(a,l,0,a,l,r);M.addColorStop(0,b.color),M.addColorStop(1,L(b.color,-15)),e.fillStyle=M,e.fill(),e.strokeStyle=n?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.4)",e.lineWidth=1.5,e.stroke(),e.save(),e.translate(a,l),e.rotate(z+d/2),e.textAlign="right",b.level===1?(e.shadowBlur=8,e.shadowColor="#fff",e.fillStyle="#92400e"):e.fillStyle=n?"#f1f5f9":"#334155",e.font=`bold ${Math.max(14,r*.08)}px "Inter", system-ui, sans-serif`,e.fillText(b.text,r-25,6),e.restore(),e.restore()}),e.restore()},R=()=>{if(p.value){i.value||(i.value=!0,u&&(clearTimeout(u),u=null));return}h.value=null,p.value=!0,i.value=!1,c=Math.random()*.1+.4,u=window.setTimeout(()=>{p.value&&!i.value&&(i.value=!0)},8e3),window.threeBg&&window.threeBg.setSpeed&&window.threeBg.setSpeed(8),requestAnimationFrame(P)},P=()=>{x+=c,i.value?c*=T:(c*=.999,c<.2&&(c=.2)),window.threeBg&&window.threeBg.setSpeed&&window.threeBg.setSpeed(1+c*15),v(),i.value&&c<=j?(p.value=!1,i.value=!1,c=0,u&&(clearTimeout(u),u=null),window.threeBg&&window.threeBg.setSpeed&&window.threeBg.setSpeed(1),A()):requestAnimationFrame(P)},A=()=>{const t=Math.PI*2/o.value.length,e=(x%(Math.PI*2)+Math.PI*2)%(Math.PI*2),n=Math.PI*1.5;let a=-1;for(let l=0;l<o.value.length;l++){const r=(e+l*t)%(Math.PI*2),d=(r+t)%(Math.PI*2);if(r<d){if(n>=r&&n<=d){a=l;break}}else if(n>=r||n<=d){a=l;break}}a!==-1&&(h.value=o.value[a],B.value=!0,h.value.level===1&&(F(window.innerWidth/2,window.innerHeight/2,"#fbbf24"),window.threeBg&&typeof window.threeBg.celebrate=="function"&&window.threeBg.celebrate()))},O=()=>{if(!f.value)return;const t=["#f87171","#fb923c","#fbbf24","#34d399","#60a5fa","#818cf8","#a78bfa","#f472b6"],e=t[Math.floor(Math.random()*t.length)];o.value.unshift({text:f.value,color:e,level:m.value}),f.value="",m.value=0,g(v)},$=t=>{o.value.length<=2||(o.value.splice(t,1),g(v))},E=()=>{o.value=[{text:"阿寶Pay 100萬",color:"#fbbf24",level:1},{text:"阿寶Pay 10萬",color:"#94a3b8",level:2},{text:"阿寶Pay 1萬",color:"#d97706",level:3},{text:"銘謝惠顧",color:"#f1f5f9",level:0},{text:"銘謝惠顧",color:"#e2e8f0",level:0},{text:"銘謝惠顧",color:"#cbd5e1",level:0}],g(v)},k=()=>{const t=w.value,e=y.value;if(!t||!e)return;const n=Math.min(e.clientWidth,500);t.width=n,t.height=n,v()};return X(()=>{k(),window.addEventListener("resize",k),new MutationObserver(()=>{v()}).observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),g(()=>{fetch(`/Per_OutTaiwan/announcements.json?t=${Date.now()}`).then(e=>e.json()).then(e=>{e.turntable&&(S.value=e.turntable)}).catch(e=>console.error(e))})}),Y(()=>{window.removeEventListener("resize",k)}),{canvasRef:w,containerRef:y,isSpinning:p,isBraking:i,prizes:o,newItemText:f,newItemLevel:m,result:h,showResultModal:B,isSettingsOpen:I,announcement:S,toggleSpin:R,addPrize:O,removePrize:$,resetToDefault:E}},template:`<LayoutComponent title="幸運轉盤">
      <template #bottom-left>
        <!-- 手機版設定切換按鈕 -->
        <button 
          @click="isSettingsOpen = !isSettingsOpen"
          class="turntable-settings-toggle"
        >
          <!-- Glow effect for dark mode -->
          <div class="turntable-settings-glow"></div>
          
          <svg v-if="!isSettingsOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </template>

      <div class="turntable-main-wrapper">
        
        <!-- 公告欄 -->
        <div v-if="announcement.show" class="turntable-announcement">
            <div class="px-5 text-indigo-600 dark:text-indigo-400">
                <span class="text-2xl">📢</span>
            </div>
            <div class="marquee-container flex-1 py-1">
                <p class="marquee-content text-slate-900 dark:text-slate-100 font-black text-base">
                    {{ announcement.message }}
                    <span class="inline-block w-20"></span>
                    {{ announcement.message }}
                </p>
            </div>
        </div>

        <div class="turntable-layout-container" :class="isSettingsOpen ? 'items-start' : 'items-center justify-center min-h-[calc(100vh-200px)]'">
          
          <!-- 左側：轉盤區域 -->
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
  
          <!-- 右側：設定區域 -->
          <transition 
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform translate-x-full opacity-0"
            enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform translate-x-full opacity-0"
          >
            <div 
              v-if="isSettingsOpen"
              class="turntable-settings-panel"
            >
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
                <div class="max-h-[40vh] lg:max-h-96 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
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
          </transition>

          <!-- 桌面版展開按鈕 (當設定關閉時) -->
          <button 
            v-if="!isSettingsOpen"
            @click="isSettingsOpen = true"
            class="hidden lg:flex absolute top-8 right-4 w-12 h-12 glass-card rounded-full items-center justify-center text-slate-900 dark:text-slate-400 hover:text-black dark:hover:text-white border border-white/20 shadow-lg transition-all hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

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
    </LayoutComponent>`}),C=W(_);C.use(G,{theme:{preset:V,options:{darkModeSelector:".dark"}}});C.mount("#app");
