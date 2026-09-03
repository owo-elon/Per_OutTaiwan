import type { PrizeLevel } from '../types/turntable';

export const TURN_TABLE_AUTO_BRAKE_DELAY_MS = 8000;
export const TURN_TABLE_FRICTION = 0.988;
export const TURN_TABLE_STOP_THRESHOLD = 0.0005;
export const TURN_TABLE_MIN_PRIZES = 2;

export const TURN_TABLE_RANDOM_COLORS = [
  '#f87171',
  '#fb923c',
  '#fbbf24',
  '#34d399',
  '#22d3ee',
  '#60a5fa',
  '#818cf8',
  '#a78bfa',
  '#f472b6'
];

export const PRIZE_LEVEL_LABELS: Record<Exclude<PrizeLevel, 0>, string> = {
  1: '一等獎',
  2: '二等獎',
  3: '三等獎'
};
