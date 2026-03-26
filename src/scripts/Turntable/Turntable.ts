import { createApp, defineComponent, ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import { LayoutComponent, createParticles } from '../../Layout/Layout';
import '../../../css/Turntable.css';
import '../../../css/index.css';

interface Prize {
  text: string;
  color: string;
  level: 1 | 2 | 3 | 0; // 1: 一等獎, 2: 二等獎, 3: 三等獎, 0: 普通
}

const Turntable = defineComponent({
  name: 'Turntable',
  components: { LayoutComponent },
  setup() {
    const isSettingsOpen = ref(true);
    const announcement = ref({ show: false, message: '' });
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const containerRef = ref<HTMLElement | null>(null);
    const isSpinning = ref(false);
    const prizes = ref<Prize[]>([
      { text: '100萬', color: '#fbbf24', level: 1 },
      { text: '10萬', color: '#94a3b8', level: 2 },
      { text: '1萬', color: '#d97706', level: 3 },
      { text: '銘謝惠顧', color: '#f1f5f9', level: 0 },
      { text: '銘謝惠顧', color: '#e2e8f0', level: 0 },
      { text: '銘謝惠顧', color: '#cbd5e1', level: 0 },
    ]);

    const newItemText = ref('');
    const newItemLevel = ref<0 | 1 | 2 | 3>(0);
    const result = ref<Prize | null>(null);
    const showResultModal = ref(false);

    let currentRotation = 0;
    let velocity = 0;
    const friction = 0.988; // 稍微調高摩擦力，讓結尾更平滑
    const stopThreshold = 0.0005;

    // 輔助函式：調整顏色亮度（增加立體感用）
    const adjustColor = (hex: string, amt: number) => {
      let r = parseInt(hex.slice(1, 3), 16) + amt;
      let g = parseInt(hex.slice(3, 5), 16) + amt;
      let b = parseInt(hex.slice(5, 7), 16) + amt;
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const drawTurntable = () => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const isDark = document.documentElement.classList.contains('dark');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;
      const sliceAngle = (Math.PI * 2) / prizes.value.length;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. 繪製底部發光層 (Glow Effect)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
      ctx.shadowBlur = 30;
      ctx.shadowColor = isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(0, 0, 0, 0.1)';
      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.fill();
      ctx.restore();

      // 2. 繪製獎項扇形
      prizes.value.forEach((prize, i) => {
        const startAngle = currentRotation + i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        
        // 建立徑向漸層，外圈稍微調暗增加邊界感
        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        grad.addColorStop(0, prize.color);
        grad.addColorStop(1, adjustColor(prize.color, -15));
        
        ctx.fillStyle = grad;
        ctx.fill();
        
        // 分隔線
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3. 繪製文字
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        
        // 根據獎項等級設定文字質感
        if (prize.level === 1) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#fff';
            ctx.fillStyle = '#92400e'; // 深金色
        } else {
            ctx.fillStyle = isDark ? '#f1f5f9' : '#334155';
        }
        
        ctx.font = `bold ${Math.max(14, radius * 0.08)}px "Inter", system-ui, sans-serif`;
        ctx.fillText(prize.text, radius - 25, 6);
        ctx.restore();
        ctx.restore();
      });

      // 4. 繪製中心軸 (Center Hub)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
      const hubGrad = ctx.createLinearGradient(centerX - 20, centerY - 20, centerX + 20, centerY + 20);
      hubGrad.addColorStop(0, isDark ? '#334155' : '#f8fafc');
      hubGrad.addColorStop(1, isDark ? '#0f172a' : '#cbd5e1');
      ctx.fillStyle = hubGrad;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.fill();
      
      // 中心指示點
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.restore();
    };

    const spin = () => {
      if (isSpinning.value) return;
      
      result.value = null;
      isSpinning.value = true;
      velocity = Math.random() * 0.45 + 0.35; // 初始隨機推動力
      
      // Three.js 互動：進入加速模式
      // @ts-ignore
      if (window.threeBg && window.threeBg.setSpeed) {
        // @ts-ignore
        window.threeBg.setSpeed(8.0); 
      }
      
      requestAnimationFrame(updateSpin);
    };

    const updateSpin = () => {
      currentRotation += velocity;
      velocity *= friction;

      // 讓背景跟著轉盤速度連動
      // @ts-ignore
      if (window.threeBg && window.threeBg.setSpeed) {
        // @ts-ignore
        window.threeBg.setSpeed(1.0 + (velocity * 15));
      }

      drawTurntable();

      if (velocity > stopThreshold) {
        requestAnimationFrame(updateSpin);
      } else {
        isSpinning.value = false;
        velocity = 0;
        
        // Three.js 互動：恢復正常
        // @ts-ignore
        if (window.threeBg && window.threeBg.setSpeed) {
            // @ts-ignore
            window.threeBg.setSpeed(1.0);
        }
        determineResult();
      }
    };

    const determineResult = () => {
      const sliceAngle = (Math.PI * 2) / prizes.value.length;
      const normalizedRotation = ((currentRotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
      const pointerAngle = (Math.PI * 1.5); // 指針在正上方 (270度)
      
      let winningIndex = -1;
      for (let i = 0; i < prizes.value.length; i++) {
        const start = (normalizedRotation + i * sliceAngle) % (Math.PI * 2);
        const end = (start + sliceAngle) % (Math.PI * 2);
        
        if (start < end) {
          if (pointerAngle >= start && pointerAngle <= end) {
            winningIndex = i; break;
          }
        } else {
          if (pointerAngle >= start || pointerAngle <= end) {
            winningIndex = i; break;
          }
        }
      }

      if (winningIndex !== -1) {
        result.value = prizes.value[winningIndex];
        showResultModal.value = true;
        
        // 大獎特效
        if (result.value.level === 1) {
          createParticles(window.innerWidth / 2, window.innerHeight / 2, '#fbbf24');
          // @ts-ignore
          if (window.threeBg && typeof window.threeBg.celebrate === 'function') {
            // @ts-ignore
            window.threeBg.celebrate();
          }
        }
      }
    };

    const addPrize = () => {
      if (!newItemText.value) return;
      const colors = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#60a5fa', '#818cf8', '#a78bfa', '#f472b6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      prizes.value.push({
        text: newItemText.value,
        color: randomColor,
        level: newItemLevel.value as any
      });
      
      newItemText.value = '';
      newItemLevel.value = 0;
      nextTick(drawTurntable);
    };

    const removePrize = (index: number) => {
      if (prizes.value.length <= 2) return;
      prizes.value.splice(index, 1);
      nextTick(drawTurntable);
    };

    const resetToDefault = () => {
      prizes.value = [
        { text: '阿寶Pay 100萬', color: '#fbbf24', level: 1 },
        { text: '阿寶Pay 10萬', color: '#94a3b8', level: 2 },
        { text: '阿寶Pay 1萬', color: '#d97706', level: 3 },
        { text: '銘謝惠顧', color: '#f1f5f9', level: 0 },
        { text: '銘謝惠顧', color: '#e2e8f0', level: 0 },
        { text: '銘謝惠顧', color: '#cbd5e1', level: 0 },
      ];
      nextTick(drawTurntable);
    };

    const resizeCanvas = () => {
      const canvas = canvasRef.value;
      const container = containerRef.value;
      if (!canvas || !container) return;
      const size = Math.min(container.clientWidth, 500);
      canvas.width = size;
      canvas.height = size;
      drawTurntable();
    };

    onMounted(() => {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // 監聽深淺色切換，即時重繪 Canvas
      const observer = new MutationObserver(() => {
        drawTurntable();
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      nextTick(() => {
        const response = fetch(`${import.meta.env.BASE_URL}announcements.json?t=${Date.now()}`)
          .then(res => res.json())
          .then(data => { if (data.turntable) announcement.value = data.turntable; })
          .catch(e => console.error(e));
      });
    });

    onUnmounted(() => {
      window.removeEventListener('resize', resizeCanvas);
    });

    return {
      canvasRef, containerRef, isSpinning, prizes, newItemText, newItemLevel,
      result, showResultModal, isSettingsOpen, announcement,
      spin, addPrize, removePrize, resetToDefault
    };
  },
  template: `<LayoutComponent title="幸運轉盤">
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

        <div class="flex flex-col lg:flex-row gap-8 items-start">
          
          <!-- 左側：轉盤區域 -->
          <div class="flex-1 w-full flex flex-col items-center" ref="containerRef">
            <div class="turntable-container mb-8 relative">
              <div class="pointer"></div>
              <canvas id="turntableCanvas" ref="canvasRef" class="max-w-full h-auto"></canvas>
            </div>
            
            <button 
              @click="spin" 
              :disabled="isSpinning"
              class="neon-btn px-12 py-4 rounded-full text-slate-900 dark:text-white text-xl md:text-2xl font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-black shadow-lg shadow-black/10 dark:shadow-black/20"
            >
              {{ isSpinning ? '旋轉中...' : '開始抽獎' }}
            </button>
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
                    <button @click="removePrize(index)" class="text-slate-900 dark:text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
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
    </LayoutComponent>`
});

createApp(Turntable).mount('#app');
