export type PrizeLevel = 0 | 1 | 2 | 3;

export interface Prize {
  text: string;
  color: string;
  level: PrizeLevel;
}

export interface TurntableData {
  prizes: Prize[];
}
