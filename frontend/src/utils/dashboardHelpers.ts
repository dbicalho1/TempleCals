import { MealEntry } from '../services/mockData';

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
 * Categorize meal by time
 */
export const getMealCategory = (date: Date | string): string => {
  const hour = new Date(date).getHours();
  
  if (hour >= 5 && hour < 11) return 'Breakfast';
  if (hour >= 11 && hour < 16) return 'Lunch';
  if (hour >= 16 && hour < 22) return 'Dinner';
  return 'Snacks';
};

/**
 * Group meals by category
 */
export const groupMealsByCategory = (meals: MealEntry[]) => {
  const categories = {
    Breakfast: [] as MealEntry[],
    Lunch: [] as MealEntry[],
    Dinner: [] as MealEntry[],
    Snacks: [] as MealEntry[]
  };

  meals.forEach(meal => {
    const category = getMealCategory(meal.date);
    categories[category as keyof typeof categories].push(meal);
  });

  return categories;
};

/**
 * Calculate totals for a meal category
 */
export const calculateCategoryTotals = (meals: MealEntry[]) => {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.totalCalories,
      protein: totals.protein + meal.totalProtein,
      carbs: totals.carbs + meal.totalCarbs,
      fat: totals.fat + meal.totalFat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

/**
 * Calculate daily streak (mock for now)
 */
export const calculateStreak = (): number => {
  // TODO: Implement with real backend data
  return 7;
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Check if date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Get calories remaining
 */
export const getCaloriesRemaining = (consumed: number, goal: number): number => {
  return Math.max(goal - consumed, 0);
};

/**
 * Get status message for macros
 */
export const getMacroStatus = (
  protein: number, 
  proteinGoal: number, 
  carbs: number, 
  carbsGoal: number, 
  fat: number, 
  fatGoal: number
): { protein: boolean; carbs: boolean; fat: boolean } => {
  return {
    protein: protein >= proteinGoal,
    carbs: carbs >= carbsGoal,
    fat: fat >= fatGoal
  };
};
