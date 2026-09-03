import type { WeatherCity } from '../types/takelist';

export const TAKELIST_ALL_CATEGORY = 'All';
export const TAKELIST_MUST_CATEGORY = '🚨 絕對不能忘記';

export const WEATHER_CITIES: WeatherCity[] = [
  { id: 'Tokyo', name: '東京', lat: 35.6895, lon: 139.6917 },
  { id: 'Seoul', name: '首爾', lat: 37.5665, lon: 126.978 },
  { id: 'Bangkok', name: '曼谷', lat: 13.7563, lon: 100.5018 },
  { id: 'Paris', name: '巴黎', lat: 48.8566, lon: 2.3522 },
  { id: 'London', name: '倫敦', lat: 51.5074, lon: -0.1278 },
  { id: 'New York', name: '紐約', lat: 40.7128, lon: -74.006 },
  { id: 'Taipei', name: '台北', lat: 25.033, lon: 121.5654 }
];
