import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { fetchJson } from '../services/json.service';
import { TurntableEngine } from '../turntable/TurntableEngine';
import type { Prize, TurntableData } from '../types/turntable';
import { useTurntablePanel } from './useTurntablePanel';

export function useTurntablePage(canvasRef: Ref<HTMLCanvasElement | null>) {
  const prizes = ref<Prize[]>([]);
  const result = ref<Prize | null>(null);
  const isResultOpen = ref(false);
  const isSpinning = ref(false);
  const isLoading = ref(true);
  const errorMessage = ref('');
  const panel = useTurntablePanel(prizes);
  let engine: TurntableEngine | null = null;
  let controller: AbortController | null = null;

  const createEngine = () => {
    if (!canvasRef.value) {
      return;
    }

    engine?.destroy();
    engine = new TurntableEngine(canvasRef.value, {
      getPrizes: () => prizes.value,
      onStop: (prize) => {
        result.value = prize;
        isResultOpen.value = true;
        isSpinning.value = false;
        window.threeBg?.setSpeed(1, 700);
        window.threeBg?.celebrate();
      }
    });
  };

  const loadPrizes = async () => {
    controller?.abort();
    controller = new AbortController();
    const data = await fetchJson<TurntableData>('turntable/turntable.json', controller.signal);
    prizes.value = data.prizes.map((prize) => ({ ...prize }));
  };

  const resetPrizes = async () => {
    try {
      await loadPrizes();
      panel.showFeedback('已恢復預設獎項');
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        panel.showFeedback('無法恢復預設獎項');
        console.error(error);
      }
    }
  };

  const spin = () => {
    if (!engine?.spin()) {
      return;
    }

    isResultOpen.value = false;
    result.value = null;
    isSpinning.value = true;
    window.threeBg?.setSpeed(2.4, 400);
  };

  const brake = () => {
    engine?.brake();
    window.threeBg?.setSpeed(1.25, 600);
  };

  const addPrize = () => {
    if (panel.addPrize()) {
      engine?.redraw();
    }
  };

  const removePrize = (index: number) => {
    if (panel.removePrize(index)) {
      engine?.redraw();
    }
  };

  onMounted(async () => {
    try {
      await loadPrizes();
      isLoading.value = false;
      await nextTick();
      createEngine();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        errorMessage.value = '轉盤資料載入失敗，請稍後再試。';
        console.error(error);
      }
      isLoading.value = false;
    }
  });

  watch(prizes, () => engine?.redraw(), { deep: true });

  onBeforeUnmount(() => {
    controller?.abort();
    engine?.destroy();
    window.threeBg?.setSpeed(1, 0);
  });

  return {
    prizes,
    result,
    isResultOpen,
    isSpinning,
    isLoading,
    errorMessage,
    ...panel,
    spin,
    brake,
    addPrize,
    removePrize,
    resetPrizes
  };
}
