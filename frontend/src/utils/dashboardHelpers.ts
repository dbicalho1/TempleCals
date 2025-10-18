/**
 * Calculate percentage progress toward a goal
 */
export const calculateProgress = (current: number, goal: number): number => {
  if (goal === 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
};

/**
 * Check if value exceeds goal
 */
export const isOverLimit = (current: number, goal: number): boolean => {
  return current > goal;
};

/**
 * Get calories remaining
 */
export const getCaloriesRemaining = (consumed: number, goal: number): number => {
  return Math.max(goal - consumed, 0);
};

/**
 * Calculate daily streak (mock for now)
 */
export const calculateStreak = (): number => {
  // TODO: Implement with real backend data
  return 7;
};
