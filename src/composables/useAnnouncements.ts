import { computed, onBeforeUnmount, onMounted, ref, type MaybeRefOrGetter, toValue } from 'vue';
import { fetchJson } from '../services/json.service';
import type { AnnouncementConfig, AnnouncementMessage } from '../types/app';

type AnnouncementScope = 'global' | 'turntable' | 'country';

export function useAnnouncements(
  scope: AnnouncementScope = 'global',
  country?: MaybeRefOrGetter<string>
) {
  const config = ref<AnnouncementConfig | null>(null);
  const isLoading = ref(true);
  const errorMessage = ref('');
  let controller: AbortController | null = null;

  const announcement = computed<AnnouncementMessage | null>(() => {
    if (!config.value) {
      return null;
    }

    if (scope === 'country') {
      return config.value.countries[toValue(country) || ''] ?? config.value.global;
    }

    return config.value[scope];
  });

  onMounted(async () => {
    controller = new AbortController();
    try {
      config.value = await fetchJson<AnnouncementConfig>('announcements.json', controller.signal);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        errorMessage.value = '公告載入失敗';
        console.error(error);
      }
    } finally {
      isLoading.value = false;
    }
  });

  onBeforeUnmount(() => controller?.abort());

  return {
    announcement,
    isLoading,
    errorMessage
  };
}
