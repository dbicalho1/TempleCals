// Mock data for analytics features: trends, streaks, weight tracking

export interface DailyNutrition {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  metCalorieGoal: boolean;
  metProteinGoal: boolean;
}

export interface WeightEntry {
  date: string;
  weight: number; // in lbs
  notes?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  lastLoggedDate: string;
}

// Generate mock daily nutrition data for the past 30 days
export const generateMockNutritionHistory = (days: number = 30): DailyNutrition[] => {
  const data: DailyNutrition[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic-ish data with some variation
    const baseCalories = 1800 + Math.random() * 600;
    const variation = Math.sin(i / 7) * 200; // Weekly pattern
    
    const calories = Math.round(baseCalories + variation);
    const protein = Math.round(calories * 0.25 / 4); // 25% of calories from protein
    const carbs = Math.round(calories * 0.45 / 4); // 45% from carbs
    const fat = Math.round(calories * 0.30 / 9); // 30% from fat
    
    // Met goals? (85% chance for recent days, adds realism)
    const metCalorieGoal = calories >= 1800 && calories <= 2200;
    const metProteinGoal = protein >= 140;
    
    data.push({
      date: date.toISOString().split('T')[0],
      calories,
      protein,
      carbs,
      fat,
      metCalorieGoal,
      metProteinGoal
    });
  }
  
  return data;
};

// Mock weight tracking data
export const mockWeightHistory: WeightEntry[] = [
  { date: '2024-09-01', weight: 185.2 },
  { date: '2024-09-08', weight: 184.6 },
  { date: '2024-09-15', weight: 183.9 },
  { date: '2024-09-22', weight: 183.2 },
  { date: '2024-09-29', weight: 182.8 },
  { date: '2024-10-06', weight: 182.1 },
  { date: '2024-10-13', weight: 181.5, notes: 'Feeling great!' },
  { date: '2024-10-19', weight: 181.0 },
];

// Calculate streak based on nutrition history
export const calculateStreak = (history: DailyNutrition[]): StreakData => {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Sort by date descending (most recent first)
  const sorted = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate current streak from most recent day
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].metCalorieGoal) {
      if (i === currentStreak) {
        currentStreak++;
      }
    } else if (i === 0) {
      break; // Current streak broken
    }
  }
  
  // Calculate longest streak
  for (const day of sorted) {
    if (day.metCalorieGoal) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  return {
    currentStreak,
    longestStreak,
    totalDaysLogged: history.length,
    lastLoggedDate: sorted[0]?.date || new Date().toISOString().split('T')[0]
  };
};

// Mock function to add weight entry
export const addWeightEntry = (weight: number, notes?: string): WeightEntry => {
  const newEntry: WeightEntry = {
    date: new Date().toISOString().split('T')[0],
    weight,
    notes
  };
  
  mockWeightHistory.push(newEntry);
  return newEntry;
};

// Get weight trend (gain/loss over period)
export const getWeightTrend = (history: WeightEntry[]): {
  change: number;
  percentage: number;
  direction: 'up' | 'down' | 'stable';
} => {
  if (history.length < 2) {
    return { change: 0, percentage: 0, direction: 'stable' };
  }
  
  const sorted = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const oldest = sorted[0].weight;
  const newest = sorted[sorted.length - 1].weight;
  const change = newest - oldest;
  const percentage = (change / oldest) * 100;
  
  let direction: 'up' | 'down' | 'stable' = 'stable';
  if (Math.abs(change) > 0.5) {
    direction = change > 0 ? 'up' : 'down';
  }
  
  return {
    change: Math.round(change * 10) / 10,
    percentage: Math.round(percentage * 100) / 100,
    direction
  };
};

// Export default mock data (start with 5 days to show the "keep logging" message)
export const mockNutritionHistory = generateMockNutritionHistory(5);
export const mockStreakData = calculateStreak(mockNutritionHistory);
