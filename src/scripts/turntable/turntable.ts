import { createApp, defineComponent, ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { LayoutComponent, createParticles } from '../_global/layout';
import '../../css/turntable/turntable.css';
import '../../css/_global/index.css';

interface Prize {
  text: string;
  color: string;
  level: 1 | 2 | 3 | 0; // 1: 一等獎, 2: 二等獎, 3: 三等獎, 0: 普通
}

const Turntable = defineComponent({
  name: 'Turntable',
  components: { LayoutComponent },
  setup() {
    const isSettingsOpen = ref(false);
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const containerRef = ref<HTMLElement | null>(null);
    const isSpinning = ref(false);
    const isBraking = ref(false);
    const prizes = ref<Prize[]>([]);


    /* -----獎項部分----- */
    const loadPrizes = async () => {
      const url = `${import.meta.env.BASE_URL}turntable/turntable.json`;
      try {
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          if (data && data.prizes) prizes.value = data.prizes;
        }
      } catch (err) {
        console.log('loadPrizes', err)
      }

      nextTick(drawTurntable);
    };

    const addPrize = () => {
      if (!newItemText.value) return;
      const colors = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#60a5fa', '#818cf8', '#a78bfa', '#f472b6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      prizes.value.unshift({
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

    const resetToDefault = async () => {
      await loadPrizes();
    };

    /* -----獎項部分End----- */


    /* -----轉盤部分----- */
    const newItemText = ref('');
    const newItemLevel = ref<0 | 1 | 2 | 3>(0);
    const result = ref<Prize | null>(null);
    const showResultModal = ref(false);

    let currentRotation = 0;
    let velocity = 0;
    let autoBrakeTimeout: number | null = null;
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
      const radius = Math.max(0, Math.min(centerX, centerY) - 20);
      const sliceAngle = (Math.PI * 2) / prizes.value.length;

      if (radius <= 0) {
        console.warn("Canvas size too small to draw turntable");
        return;
      }

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

      // 4. 繪製中心軸 (Center Hub) - Removed as we use an HTML button now
      ctx.restore();
    };

    const toggleSpin = () => {
      if (isSpinning.value) {
        if (!isBraking.value) {
          isBraking.value = true;
          if (autoBrakeTimeout) {
            clearTimeout(autoBrakeTimeout);
            autoBrakeTimeout = null;
          }
        }
        return;
      }

      result.value = null;
      isSpinning.value = true;
      isBraking.value = false;
      velocity = Math.random() * 0.1 + 0.4; // 初始推動力

      // 8秒過後沒去按暫停會自己煞車
      autoBrakeTimeout = window.setTimeout(() => {
        if (isSpinning.value && !isBraking.value) {
          isBraking.value = true;
        }
      }, 8000);

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

      if (isBraking.value) {
        velocity *= friction; // 煞車時才減速
      } else {
        // 保持勻速或微幅減速
        velocity *= 0.999;
        // 確保最低速度
        if (velocity < 0.2) velocity = 0.2;
      }

      // 讓背景跟著轉盤速度連動
      // @ts-ignore
      if (window.threeBg && window.threeBg.setSpeed) {
        // @ts-ignore
        window.threeBg.setSpeed(1.0 + (velocity * 15));
      }

      drawTurntable();

      if (isBraking.value && velocity <= stopThreshold) {
        isSpinning.value = false;
        isBraking.value = false;
        velocity = 0;
        if (autoBrakeTimeout) {
          clearTimeout(autoBrakeTimeout);
          autoBrakeTimeout = null;
        }

        // Three.js 互動：恢復正常
        // @ts-ignore
        if (window.threeBg && window.threeBg.setSpeed) {
          // @ts-ignore
          window.threeBg.setSpeed(1.0);
        }
        determineResult();
      } else {
        requestAnimationFrame(updateSpin);
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
    /* -----轉盤部分End----- */

    const resizeCanvas = () => {
      const canvas = canvasRef.value;
      const container = containerRef.value;
      if (!canvas || !container) return;
      const size = Math.min(container.clientWidth, 500);
      canvas.width = size;
      canvas.height = size;
      drawTurntable();
    };

    let resizeObserver: ResizeObserver | null = null;


    /* -----hook----- */
    onMounted(async () => {
      await loadPrizes();
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      if (containerRef.value) {
        resizeObserver = new ResizeObserver(() => {
          resizeCanvas();
        });
        resizeObserver.observe(containerRef.value);
      }

      // 監聽深淺色切換，即時重繪 Canvas
      const observer = new MutationObserver(() => {
        drawTurntable();
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    });

    onUnmounted(() => {
      window.removeEventListener('resize', resizeCanvas);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    });
    /* -----hookEnd----- */

    return {
      canvasRef, containerRef, isSpinning, isBraking, prizes, newItemText, newItemLevel,
      result, showResultModal, isSettingsOpen,
      toggleSpin, addPrize, removePrize, resetToDefault
    };
  },
  template: `<LayoutComponent title="幸運轉盤" :show-announcement="false">
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
    </LayoutComponent>`
});

const app = createApp(Turntable);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
    }
  }
});
app.mount('#app');
