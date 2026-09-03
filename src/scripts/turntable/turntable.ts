import {
  createApp,
  defineComponent,
  onBeforeUnmount,
  ref,
  watch
} from 'vue';
import { PRIZE_LEVEL_LABELS } from '../../constants/turntable';
import { useDialogFocus } from '../../composables/useDialogFocus';
import { useTurntablePage } from '../../composables/useTurntablePage';
import { LayoutComponent } from '../../layout/layout';
import '../../css/_global/index.css';
import '../../css/_global/layout.css';
import '../../css/turntable/turntable.css';

const TurntableApp = defineComponent({
  name: 'TurntableApp',
  components: {
    LayoutComponent
  },
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const resultDialogRef = ref<HTMLElement | null>(null);
    const turntable = useTurntablePage(canvasRef);
    let feedbackTimer: number | null = null;

    const closeResult = () => {
      turntable.isResultOpen.value = false;
    };

    useDialogFocus(turntable.isResultOpen, resultDialogRef, closeResult);

    const stopFeedbackWatch = watch(turntable.feedbackMessage, (message) => {
      if (!message) {
        return;
      }
      if (feedbackTimer !== null) {
        clearTimeout(feedbackTimer);
      }
      feedbackTimer = window.setTimeout(() => {
        turntable.feedbackMessage.value = '';
        feedbackTimer = null;
      }, 2200);
    });

    onBeforeUnmount(() => {
      stopFeedbackWatch();
      if (feedbackTimer !== null) {
        clearTimeout(feedbackTimer);
      }
    });

    return {
      ...turntable,
      canvasRef,
      resultDialogRef,
      prizeLevelLabels: PRIZE_LEVEL_LABELS,
      closeResult
    };
  },
  template: `
    <LayoutComponent announcement-scope="turntable">
      <section class="turntable-page">
        <header class="turntable-header">
          <div>
            <p class="eyebrow">PROBABILITY ENGINE / ONLINE</p>
            <h1>命運選擇器</h1>
            <p>編輯候選項目、啟動轉盤，讓隨機結果替猶豫按下確認鍵。</p>
          </div>
          <button
            class="secondary-button settings-toggle"
            type="button"
            :aria-expanded="isPanelOpen"
            aria-controls="turntable-settings"
            @click="isPanelOpen = !isPanelOpen"
          >
            <span aria-hidden="true">⚙</span>
            {{ isPanelOpen ? '收起設定' : '調整獎項' }}
          </button>
        </header>

        <div v-if="isLoading" class="state-panel" role="status">
          <span class="loading-ring" aria-hidden="true"></span>
          正在校準轉盤…
        </div>
        <div v-else-if="errorMessage" class="state-panel state-panel--error" role="alert">
          {{ errorMessage }}
        </div>

        <div v-else class="turntable-workspace" :class="{ 'is-panel-open': isPanelOpen }">
          <div class="wheel-zone">
            <div class="wheel-readout wheel-readout--top">
              <span>ENTRIES</span>
              <strong>{{ prizes.length.toString().padStart(2, '0') }}</strong>
            </div>
            <div class="wheel-readout wheel-readout--bottom">
              <span>STATUS</span>
              <strong>{{ isSpinning ? 'RUNNING' : 'READY' }}</strong>
            </div>

            <div class="wheel-frame">
              <div class="wheel-pointer" aria-hidden="true"></div>
              <canvas ref="canvasRef" aria-label="獎項轉盤"></canvas>
              <button
                class="wheel-trigger"
                type="button"
                :disabled="isSpinning"
                :aria-label="isSpinning ? '轉盤運轉中' : '啟動轉盤'"
                @click="spin"
              >
                <span>{{ isSpinning ? 'RUN' : 'SPIN' }}</span>
              </button>
            </div>

            <button
              v-if="isSpinning"
              class="brake-button"
              type="button"
              @click="brake"
            >
              啟動減速程序
            </button>
            <p class="wheel-instruction">
              轉盤會自動減速，也可以手動提前啟動煞車。
            </p>
          </div>

          <aside
            v-show="isPanelOpen"
            id="turntable-settings"
            class="settings-hud"
            aria-labelledby="settings-title"
          >
            <div class="settings-hud__header">
              <div>
                <p class="eyebrow">CONTROL HUD</p>
                <h2 id="settings-title">獎項設定</h2>
              </div>
              <button
                class="icon-button"
                type="button"
                aria-label="關閉獎項設定"
                @click="isPanelOpen = false"
              >×</button>
            </div>

            <form class="prize-form" @submit.prevent="addPrize">
              <label>
                獎項名稱
                <input
                  v-model="newPrizeText"
                  type="text"
                  maxlength="40"
                  placeholder="輸入新的選項"
                />
              </label>
              <label>
                獎項層級
                <select v-model.number="newPrizeLevel">
                  <option :value="0">一般項目</option>
                  <option :value="1">一等獎</option>
                  <option :value="2">二等獎</option>
                  <option :value="3">三等獎</option>
                </select>
              </label>
              <button class="primary-button" type="submit">＋ 新增獎項</button>
            </form>

            <div class="prize-list" aria-label="目前獎項">
              <div
                v-for="(prize, index) in prizes"
                :key="index + '-' + prize.text"
                class="prize-item"
              >
                <i :style="{ backgroundColor: prize.color }"></i>
                <span>
                  <strong>{{ prize.text }}</strong>
                  <small>{{ prize.level === 0 ? '一般項目' : prizeLevelLabels[prize.level] }}</small>
                </span>
                <button
                  type="button"
                  :aria-label="'刪除 ' + prize.text"
                  @click="removePrize(index)"
                >×</button>
              </div>
            </div>

            <button class="text-button settings-reset" type="button" @click="resetPrizes">
              恢復預設獎項
            </button>
          </aside>
        </div>

        <Transition name="toast">
          <div v-if="feedbackMessage" class="app-toast" role="status">
            {{ feedbackMessage }}
          </div>
        </Transition>

        <Transition name="dialog">
          <div v-if="isResultOpen" class="dialog-backdrop" @click.self="closeResult">
            <section
              ref="resultDialogRef"
              class="app-dialog result-dialog"
              :class="'result-dialog--level-' + (result?.level ?? 0)"
              role="dialog"
              aria-modal="true"
              aria-labelledby="result-title"
              tabindex="-1"
              @keydown.esc.prevent="closeResult"
            >
              <p class="eyebrow">SELECTION COMPLETE</p>
              <span class="result-dialog__icon" aria-hidden="true">✦</span>
              <h2 id="result-title">{{ result?.text }}</h2>
              <p v-if="result?.level">
                {{ prizeLevelLabels[result.level] }}
              </p>
              <button class="primary-button" type="button" @click="closeResult">
                確認結果
              </button>
            </section>
          </div>
        </Transition>
      </section>
    </LayoutComponent>
  `
});

createApp(TurntableApp).mount('#app');
