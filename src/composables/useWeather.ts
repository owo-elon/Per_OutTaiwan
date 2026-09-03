import { onBeforeUnmount, ref } from 'vue';
import { WEATHER_CITIES } from '../constants/takelist';
import { readStorage, writeStorage } from '../services/storage.service';
import { fetchCurrentWeather } from '../services/weather.service';
import type { WeatherData } from '../types/takelist';

export function useWeather() {
  const selectedCity = ref(readStorage('weatherCity') ?? WEATHER_CITIES[0].id);
  const weather = ref<WeatherData | null>(null);
  const isLoadingWeather = ref(false);
  const weatherError = ref('');
  let controller: AbortController | null = null;

  const loadWeather = async () => {
    const city = WEATHER_CITIES.find((item) => item.id === selectedCity.value);
    if (!city) {
      weatherError.value = '找不到選擇的城市';
      return;
    }

    controller?.abort();
    const requestController = new AbortController();
    controller = requestController;
    isLoadingWeather.value = true;
    weatherError.value = '';
    writeStorage('weatherCity', city.id);

    try {
      weather.value = await fetchCurrentWeather(city, requestController.signal);
      if (!weather.value) {
        weatherError.value = '暫時沒有天氣資料';
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        weatherError.value = '天氣資料載入失敗';
        console.error(error);
      }
    } finally {
      if (controller === requestController) {
        isLoadingWeather.value = false;
      }
    }
  };

  onBeforeUnmount(() => controller?.abort());

  return {
    weatherCities: WEATHER_CITIES,
    selectedCity,
    weather,
    isLoadingWeather,
    weatherError,
    loadWeather
  };
}
