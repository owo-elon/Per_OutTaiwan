import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { fetchJson } from '../services/json.service';
import type { CarouselItem, HomeCategory, HomeData } from '../types/home';

export function useHomeDashboard() {
  const features = ref<CarouselItem[]>([]);
  const categories = ref<HomeCategory[]>([]);
  const activeCategory = ref('all');
  const isLoading = ref(true);
  const errorMessage = ref('');
  let controller: AbortController | null = null;

  const filteredFeatures = computed(() => {
    if (activeCategory.value === 'all') {
      return features.value;
    }

    return features.value.filter((feature) => feature.category === activeCategory.value);
  });

  const selectCategory = (categoryId: string) => {
    activeCategory.value = categoryId;
  };

  onMounted(async () => {
    controller = new AbortController();
    try {
      const data = await fetchJson<HomeData>('home/home.json', controller.signal);
      features.value = data.features;
      categories.value = data.categories;
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        errorMessage.value = '功能資料載入失敗，請稍後再試。';
        console.error(error);
      }
    } finally {
      isLoading.value = false;
    }
  });

  onBeforeUnmount(() => controller?.abort());

  return {
    features,
    categories,
    activeCategory,
    filteredFeatures,
    isLoading,
    errorMessage,
    selectCategory,
    watchFeatures: (callback: () => void) => watch(filteredFeatures, callback)
  };
}
