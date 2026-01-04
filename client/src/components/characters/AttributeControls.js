export const BASE_SCORE = 8;
export const MAX_SCORE = 15;
export const POINTS_AVAILABLE = 27;

// Cost table for point buy
export function costFor(score) {
  if (score <= 13) return score - BASE_SCORE;
  if (score === 14) return 7;
  if (score === 15) return 9;
  return Infinity;
}

export function modifier(score) {
  return Math.floor((score - 10) / 2);
}

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
