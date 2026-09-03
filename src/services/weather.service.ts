import type { WeatherCity, WeatherData } from '../types/takelist';

interface OpenMeteoResponse {
  current_weather?: WeatherData;
}

export async function fetchCurrentWeather(city: WeatherCity, signal?: AbortSignal) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch weather: ${response.status}`);
  }

  const data = await response.json() as OpenMeteoResponse;
  return data.current_weather ?? null;
}
