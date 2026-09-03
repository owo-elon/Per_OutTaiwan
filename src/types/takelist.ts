export type TravelGender = '' | 'male' | 'female';

export interface CountryOption {
  name: string;
  flag: string;
  implemented: boolean;
}

export interface PackingItemDefinition {
  id: string;
  name: string;
  checked: boolean;
  gender?: TravelGender;
  country?: string;
  category?: string;
}

export interface PackingCategoryDefinition {
  name: string;
  icon: string;
  items: PackingItemDefinition[];
}

export interface TakelistDefaults {
  must: PackingItemDefinition[];
  categories: PackingCategoryDefinition[];
  [country: string]: PackingItemDefinition[] | PackingCategoryDefinition[];
}

export interface TakelistData {
  countries: Record<string, CountryOption>;
  defaultItems: TakelistDefaults;
}

export interface PackingListEntry extends PackingItemDefinition {
  isMust: boolean;
  category: string;
  isCustom?: boolean;
}

export interface DisplayPackingCategory {
  name: string;
  icon: string;
  items: PackingListEntry[];
}

export interface WeatherCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}
