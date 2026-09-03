export interface AnnouncementMessage {
  show: boolean;
  message: string;
}

export interface AnnouncementConfig {
  countries: Record<string, AnnouncementMessage>;
  global: AnnouncementMessage;
  turntable: AnnouncementMessage;
}

export interface ThreeBackgroundController {
  updateTheme: (isDark: boolean) => void;
  setSpeed: (multiplier: number, duration?: number) => void;
  celebrate: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    threeBg?: ThreeBackgroundController | null;
  }
}
