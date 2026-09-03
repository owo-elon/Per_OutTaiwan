export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  category: string;
}

export interface HomeCategory {
  id: string;
  name: string;
  icon: string;
}

export interface HomeData {
  features: CarouselItem[];
  categories: HomeCategory[];
}
