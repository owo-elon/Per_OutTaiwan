import{d as H,e as q,L as D,o as F,n as x,f as W,r as o,i as G}from"./index-DnCeteSS.js";const U=q({name:"Turntable",components:{LayoutComponent:D},setup(){const C=o(!0),S=o({show:!1,message:""}),g=o(null),z=o(null),f=o(!1),i=o(!1),r=o([{text:"100萬",color:"#fbbf24",level:1},{text:"10萬",color:"#94a3b8",level:2},{text:"1萬",color:"#d97706",level:3},{text:"銘謝惠顧",color:"#f1f5f9",level:0},{text:"銘謝惠顧",color:"#e2e8f0",level:0},{text:"銘謝惠顧",color:"#cbd5e1",level:0}]),h=o(""),p=o(0),b=o(null),B=o(!1);let m=0,d=0,c=null;const I=.988,j=5e-4,T=(t,e)=>{let a=parseInt(t.slice(1,3),16)+e,s=parseInt(t.slice(3,5),16)+e,l=parseInt(t.slice(5,7),16)+e;return a=Math.max(0,Math.min(255,a)),s=Math.max(0,Math.min(255,s)),l=Math.max(0,Math.min(255,l)),`#${a.toString(16).padStart(2,"0")}${s.toString(16).padStart(2,"0")}${l.toString(16).padStart(2,"0")}`},u=()=>{const t=g.value;if(!t)return;const e=t.getContext("2d",{alpha:!0});if(!e)return;const a=document.documentElement.classList.contains("dark"),s=t.width/2,l=t.height/2,n=Math.min(s,l)-20,v=Math.PI*2/r.value.length;e.clearRect(0,0,t.width,t.height),e.save(),e.beginPath(),e.arc(s,l,n+5,0,Math.PI*2),e.shadowBlur=30,e.shadowColor=a?"rgba(96, 165, 250, 0.3)":"rgba(0, 0, 0, 0.1)",e.fillStyle=a?"#0f172a":"#ffffff",e.fill(),e.restore(),r.value.forEach((w,$)=>{const y=m+$*v,E=y+v;e.save(),e.beginPath(),e.moveTo(s,l),e.arc(s,l,n,y,E);const M=e.createRadialGradient(s,l,0,s,l,n);M.addColorStop(0,w.color),M.addColorStop(1,T(w.color,-15)),e.fillStyle=M,e.fill(),e.strokeStyle=a?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.4)",e.lineWidth=1.5,e.stroke(),e.save(),e.translate(s,l),e.rotate(y+v/2),e.textAlign="right",w.level===1?(e.shadowBlur=8,e.shadowColor="#fff",e.fillStyle="#92400e"):e.fillStyle=a?"#f1f5f9":"#334155",e.font=`bold ${Math.max(14,n*.08)}px "Inter", system-ui, sans-serif`,e.fillText(w.text,n-25,6),e.restore(),e.restore()}),e.restore()},L=()=>{if(f.value){i.value||(i.value=!0,c&&(clearTimeout(c),c=null));return}b.value=null,f.value=!0,i.value=!1,d=Math.random()*.1+.4,c=window.setTimeout(()=>{f.value&&!i.value&&(i.value=!0)},8e3),window.threeBg&&window.threeBg.setSpeed&&window.threeBg.setSpeed(8),requestAnimationFrame(P)},P=()=>{m+=d,i.value?d*=I:(d*=.999,d<.2&&(d=.2)),window.threeBg&&window.threeBg.setSpeed&&window.threeBg.setSpeed(1+d*15),u(),i.value&&d<=j?(f.value=!1,i.value=!1,d=0,c&&(clearTimeout(c),c=null),window.threeBg&&window.threeBg.setSpeed&&window.threeBg.setSpeed(1),R()):requestAnimationFrame(P)},R=()=>{const t=Math.PI*2/r.value.length,e=(m%(Math.PI*2)+Math.PI*2)%(Math.PI*2),a=Math.PI*1.5;let s=-1;for(let l=0;l<r.value.length;l++){const n=(e+l*t)%(Math.PI*2),v=(n+t)%(Math.PI*2);if(n<v){if(a>=n&&a<=v){s=l;break}}else if(a>=n||a<=v){s=l;break}}s!==-1&&(b.value=r.value[s],B.value=!0,b.value.level===1&&(G(window.innerWidth/2,window.innerHeight/2,"#fbbf24"),window.threeBg&&typeof window.threeBg.celebrate=="function"&&window.threeBg.celebrate()))},A=()=>{if(!h.value)return;const t=["#f87171","#fb923c","#fbbf24","#34d399","#60a5fa","#818cf8","#a78bfa","#f472b6"],e=t[Math.floor(Math.random()*t.length)];r.value.push({text:h.value,color:e,level:p.value}),h.value="",p.value=0,x(u)},O=t=>{r.value.length<=2||(r.value.splice(t,1),x(u))},_=()=>{r.value=[{text:"阿寶Pay 100萬",color:"#fbbf24",level:1},{text:"阿寶Pay 10萬",color:"#94a3b8",level:2},{text:"阿寶Pay 1萬",color:"#d97706",level:3},{text:"銘謝惠顧",color:"#f1f5f9",level:0},{text:"銘謝惠顧",color:"#e2e8f0",level:0},{text:"銘謝惠顧",color:"#cbd5e1",level:0}],x(u)},k=()=>{const t=g.value,e=z.value;if(!t||!e)return;const a=Math.min(e.clientWidth,500);t.width=a,t.height=a,u()};return F(()=>{k(),window.addEventListener("resize",k),new MutationObserver(()=>{u()}).observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),x(()=>{fetch(`/Per_OutTaiwan/announcements.json?t=${Date.now()}`).then(e=>e.json()).then(e=>{e.turntable&&(S.value=e.turntable)}).catch(e=>console.error(e))})}),W(()=>{window.removeEventListener("resize",k)}),{canvasRef:g,containerRef:z,isSpinning:f,isBraking:i,prizes:r,newItemText:h,newItemLevel:p,result:b,showResultModal:B,isSettingsOpen:C,announcement:S,toggleSpin:L,addPrize:A,removePrize:O,resetToDefault:_}},template:`<LayoutComponent title="幸運轉盤">
      <template #bottom-left>
        <!-- 手機版設定切換按鈕 -->
        <button 
          @click="isSettingsOpen = !isSettingsOpen"
          class="lg:hidden w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-400/40 text-slate-900 dark:text-slate-300 shadow-slate-200/50 dark:shadow-[0_0_20px_rgba(148,163,184,0.3)]"
        >
          <!-- Glow effect for dark mode -->
          <div class="absolute inset-0 hidden dark:block bg-slate-400/10 animate-pulse"></div>
          
          <svg v-if="!isSettingsOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </template>

      <div class="max-w-6xl mx-auto px-4 py-8 relative">
        
        <!-- 公告欄 -->
        <div v-if="announcement.show" 
             class="mb-8 py-4 bg-slate-100 dark:bg-slate-800/50 border-l-4 border-indigo-600 dark:border-indigo-400 rounded-r-3xl flex items-center overflow-hidden shadow-sm animate-fade-in">
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

        <div class="flex flex-col lg:flex-row gap-8 transition-all duration-500" :class="isSettingsOpen ? 'items-start' : 'items-center justify-center min-h-[calc(100vh-200px)]'">
          
          <!-- 左側：轉盤區域 -->
          <div class="flex-1 w-full flex flex-col items-center" ref="containerRef">
            <div class="turntable-container mb-8 relative flex items-center justify-center">
              <div class="pointer"></div>
              <canvas id="turntableCanvas" ref="canvasRef" class="max-w-full h-auto"></canvas>
              
              <!-- 中心按鈕 -->
              <button 
                @click="toggleSpin"
                class="absolute z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 border-4 border-white dark:border-slate-800"
                :class="isSpinning && !isBraking ? 'bg-red-500 hover:bg-red-600 text-white' : (isBraking ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white')"
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
              class="w-full lg:w-96 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl sticky top-8 z-30"
            >
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-black dark:text-white">轉盤設定</h2>
                <button @click="isSettingsOpen = false" class="hidden lg:block text-slate-900 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="mb-6">
                <label class="block text-sm font-bold text-slate-900 dark:text-slate-400 mb-3 uppercase tracking-wider">新增獎項</label>
                <div class="flex flex-col gap-3">
                  <input 
                    v-model="newItemText" 
                    type="text" 
                    placeholder="輸入獎項名稱..."
                    @keyup.enter="addPrize"
                    class="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 dark:text-white"
                  />
                  <div class="flex gap-2">
                    <select 
                      v-model="newItemLevel"
                      class="flex-1 px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white"
                    >
                      <option :value="0">普通獎</option>
                      <option :value="3">三等獎</option>
                      <option :value="2">二等獎</option>
                      <option :value="1">一等獎</option>
                    </select>
                    <button 
                      @click="addPrize"
                      class="px-6 py-3 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10 dark:shadow-black/20"
                    >
                      新增
                    </button>
                  </div>
                </div>
              </div>
  
              <div class="mb-2">
                <div class="flex justify-between items-center mb-4">
                  <label class="text-sm font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider">目前獎項 ({{ prizes.length }})</label>
                  <button @click="resetToDefault" class="text-xs font-bold text-slate-900 dark:text-slate-100 hover:underline">重置預設</button>
                </div>
                <div class="max-h-[40vh] lg:max-h-96 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  <div v-for="(prize, index) in prizes" :key="index" 
                       class="flex items-center justify-between p-3 rounded-xl transition-all group border"
                       :class="[
                         prize.level === 1 ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 
                         prize.level === 2 ? 'bg-slate-400/10 border-slate-400/50' : 
                         prize.level === 3 ? 'bg-orange-600/10 border-orange-600/50' : 
                         'bg-white/30 dark:bg-slate-800/30 border-slate-200 dark:border-white/10 hover:border-slate-900/30 dark:hover:border-slate-100/30'
                       ]">
                    <div class="flex items-center gap-3">
                      <div class="w-5 h-5 rounded-full shadow-inner border border-white/20" :style="{ backgroundColor: prize.color }"></div>
                      <div class="flex flex-col">
                        <span class="text-sm font-bold" :class="prize.level === 1 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-200'">{{ prize.text }}</span>
                        <span v-if="prize.level > 0" :class="['text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md inline-block w-fit mt-0.5', 
                                                               prize.level === 1 ? 'bg-amber-500 text-slate-900 dark:text-white' : 
                                                               prize.level === 2 ? 'bg-slate-400 text-slate-900 dark:text-white' : 
                                                               'bg-orange-600 text-slate-900 dark:text-white']">
                          {{ prize.level === 1 ? '一等獎' : prize.level === 2 ? '二等獎' : '三等獎' }}
                        </span>
                      </div>
                    </div>
                    <button @click="removePrize(index)" class="text-slate-900 dark:text-slate-400 hover:text-red-500 transition-all p-1">
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
      <div v-if="showResultModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="glass-card max-w-sm w-full p-8 rounded-3xl border border-white/20 text-center animate-in fade-in zoom-in duration-300">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold text-black dark:text-white mb-2">恭喜中獎！</h3>
          <div class="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6">{{ result?.text }}</div>
          <button 
            @click="showResultModal = false"
            class="w-full py-3 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-black transition-colors shadow-lg"
          >
            太棒了！
          </button>
        </div>
      </div>
    </LayoutComponent>`});H(U).mount("#app");
