// Mock data for food items available at Temple University campus

export interface FoodItem {
  id: number;
  name: string;
  source: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export interface MealEntry {
  id: number;
  date: string;
  description: string;
  foodItems: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// Mock food items from various Temple campus sources
export const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Coffee (Medium)",
    source: "Richie's",
    calories: 5,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: "12 oz"
  },
  {
    id: 2,
    name: "Bacon, Egg & Cheese Sandwich",
    source: "Richie's",
    calories: 450,
    protein: 22,
    carbs: 30,
    fat: 28,
    servingSize: "1 sandwich"
  },
  {
    id: 3,
    name: "Chicken Quesadilla",
    source: "The Truck",
    calories: 650,
    protein: 35,
    carbs: 50,
    fat: 32,
    servingSize: "1 quesadilla"
  },
  {
    id: 4,
    name: "Cheese Pizza Slice",
    source: "Maxi's",
    calories: 320,
    protein: 15,
    carbs: 42,
    fat: 12,
    servingSize: "1 slice"
  },
  {
    id: 5,
    name: "Chicken Caesar Wrap",
    source: "Morgan Hall Food Court",
    calories: 520,
    protein: 30,
    carbs: 45,
    fat: 22,
    servingSize: "1 wrap"
  },
  {
    id: 6,
    name: "Fruit Cup",
    source: "Student Center",
    calories: 90,
    protein: 1,
    carbs: 23,
    fat: 0,
    servingSize: "8 oz"
  },
  {
    id: 7,
    name: "Turkey and Provolone Sandwich",
    source: "Student Center",
    calories: 480,
    protein: 28,
    carbs: 48,
    fat: 18,
    servingSize: "1 sandwich"
  },
  {
    id: 8,
    name: "Chocolate Chip Cookie",
    source: "Saxbys",
    calories: 220,
    protein: 3,
    carbs: 28,
    fat: 12,
    servingSize: "1 cookie"
  },
  {
    id: 9,
    name: "Chicken Fingers",
    source: "The Wall",
    calories: 410,
    protein: 24,
    carbs: 26,
    fat: 22,
    servingSize: "5 pieces"
  },
  {
    id: 10,
    name: "French Fries",
    source: "The Wall",
    calories: 380,
    protein: 4,
    carbs: 48,
    fat: 19,
    servingSize: "Regular"
  }
];

// Mock meal entries
export const mealEntries: MealEntry[] = [
  {
    id: 1,
    date: "2025-03-28",
    description: "Coffee and a bacon, egg, and cheese from Richie's",
    foodItems: [foodItems[0], foodItems[1]],
    totalCalories: 455,
    totalProtein: 22,
    totalCarbs: 30,
    totalFat: 28
  },
  {
    id: 2,
    date: "2025-03-28",
    description: "Chicken quesadilla from The Truck",
    foodItems: [foodItems[2]],
    totalCalories: 650,
    totalProtein: 35,
    totalCarbs: 50,
    totalFat: 32
  }
];

// Function to search food items
export const searchFoodItems = (query: string): FoodItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return foodItems.filter(
    item => 
      item.name.toLowerCase().includes(lowercaseQuery) || 
      item.source.toLowerCase().includes(lowercaseQuery)
  );
};

// Function to parse a meal description and return matching food items
export const parseMealDescription = (description: string): FoodItem[] => {
  const lowercaseDesc = description.toLowerCase();
  return foodItems.filter(item => 
    lowercaseDesc.includes(item.name.toLowerCase()) || 
    lowercaseDesc.includes(item.source.toLowerCase())
  );
};

// Function to add a meal entry
export const addMealEntry = (description: string): MealEntry => {
  const matchedItems = parseMealDescription(description);
  
  const totalCalories = matchedItems.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = matchedItems.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = matchedItems.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = matchedItems.reduce((sum, item) => sum + item.fat, 0);
  
  const newEntry: MealEntry = {
    id: mealEntries.length + 1,
    date: new Date().toISOString().split('T')[0],
    description,
    foodItems: matchedItems,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat
  };
  
  mealEntries.push(newEntry);
  return newEntry;
};

// Function to get all meal entries
export const getMealEntries = (): MealEntry[] => {
  return [...mealEntries];
};

// Function to get meal entries for a specific date
export const getMealEntriesByDate = (date: string): MealEntry[] => {
  return mealEntries.filter(entry => entry.date === date);
};

// Function to calculate daily totals
export const getDailyTotals = (date: string) => {
  const entries = getMealEntriesByDate(date);
  
  return {
    totalCalories: entries.reduce((sum, entry) => sum + entry.totalCalories, 0),
    totalProtein: entries.reduce((sum, entry) => sum + entry.totalProtein, 0),
    totalCarbs: entries.reduce((sum, entry) => sum + entry.totalCarbs, 0),
    totalFat: entries.reduce((sum, entry) => sum + entry.totalFat, 0)
  };
};
