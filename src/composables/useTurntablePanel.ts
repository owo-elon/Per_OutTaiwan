import { ref } from 'vue';
import {
  TURN_TABLE_MIN_PRIZES,
  TURN_TABLE_RANDOM_COLORS
} from '../constants/turntable';
import type { Prize, PrizeLevel } from '../types/turntable';

export function useTurntablePanel(prizes: { value: Prize[] }) {
  const isPanelOpen = ref(false);
  const newPrizeText = ref('');
  const newPrizeLevel = ref<PrizeLevel>(0);
  const feedbackMessage = ref('');

  const showFeedback = (message: string) => {
    feedbackMessage.value = message;
  };

  const addPrize = () => {
    const text = newPrizeText.value.trim();
    if (!text) {
      showFeedback('請先輸入獎項名稱');
      return false;
    }

    prizes.value.push({
      text,
      level: newPrizeLevel.value,
      color: TURN_TABLE_RANDOM_COLORS[prizes.value.length % TURN_TABLE_RANDOM_COLORS.length]
    });
    newPrizeText.value = '';
    newPrizeLevel.value = 0;
    showFeedback('已新增獎項');
    return true;
  };

  const removePrize = (index: number) => {
    if (prizes.value.length <= TURN_TABLE_MIN_PRIZES) {
      showFeedback(`至少需要 ${TURN_TABLE_MIN_PRIZES} 個獎項`);
      return false;
    }

    prizes.value.splice(index, 1);
    showFeedback('已移除獎項');
    return true;
  };

  return {
    isPanelOpen,
    newPrizeText,
    newPrizeLevel,
    feedbackMessage,
    showFeedback,
    addPrize,
    removePrize
  };
}
