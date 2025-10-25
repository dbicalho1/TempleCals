// API Service for TempleCals Backend
// Handles all API requests with authentication

const API_BASE_URL = 'http://127.0.0.1:5001/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('templecals_token');
};

// Helper function to create headers with auth
const createHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || error.message || 'API request failed');
  }
  return response.json();
};

// ==================== DINING HALLS ====================

export interface DiningHall {
  id: number;
  name: string;
  location: string;
  description: string;
  hours: Record<string, any>;
}

export const getDiningHalls = async (): Promise<DiningHall[]> => {
  const response = await fetch(`${API_BASE_URL}/dining-halls`, {
    headers: createHeaders(),
  });
  return handleResponse(response);
};

export const getDiningHall = async (hallId: number): Promise<DiningHall> => {
  const response = await fetch(`${API_BASE_URL}/dining-halls/${hallId}`, {
    headers: createHeaders(),
  });
  return handleResponse(response);
};

// ==================== MEAL CATEGORIES ====================

export interface MealCategory {
  id: number;
  name: string;
  description: string;
}

export const getMealCategories = async (): Promise<MealCategory[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: createHeaders(),
  });
  return handleResponse(response);
};

// ==================== MEALS ====================

export interface Meal {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  price: number;
  allergens: string[];
  dietary_tags: string[];
  available_start: string | null;
  available_end: string | null;
  is_available: boolean;
  dining_hall: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface MealSearchParams {
  dining_hall_id?: number;
  category_id?: number;
  search?: string;
}

export const getMeals = async (params?: MealSearchParams): Promise<Meal[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.dining_hall_id) {
    queryParams.append('dining_hall_id', params.dining_hall_id.toString());
  }
  if (params?.category_id) {
    queryParams.append('category_id', params.category_id.toString());
  }
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  
  const url = `${API_BASE_URL}/meals${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: createHeaders(),
  });
  return handleResponse(response);
};

export const getMeal = async (mealId: number): Promise<Meal> => {
  const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
    headers: createHeaders(),
  });
  return handleResponse(response);
};

// ==================== USER MEALS ====================

export interface UserMeal {
  id: number;
  user_id: number;
  meal_id: number;
  serving_multiplier: number;
  consumed_at: string;
  date_consumed: string;
  notes: string | null;
  created_at: string;
  meal: Meal;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
}

export interface LogMealRequest {
  meal_id: number;
  serving_multiplier?: number;
  notes?: string;
  consumed_at?: string;
}

export const logMeal = async (data: LogMealRequest): Promise<{ message: string; user_meal: UserMeal }> => {
  const response = await fetch(`${API_BASE_URL}/user-meals/log`, {
    method: 'POST',
    headers: createHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export interface MealHistoryResponse {
  meals: UserMeal[];
  count: number;
}

export const getMealHistory = async (date?: string, limit?: number): Promise<MealHistoryResponse> => {
  const queryParams = new URLSearchParams();
  
  if (date) {
    queryParams.append('date', date);
  }
  if (limit) {
    queryParams.append('limit', limit.toString());
  }
  
  const url = `${API_BASE_URL}/user-meals/history${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: createHeaders(true),
  });
  return handleResponse(response);
};

export interface DailyMealsResponse {
  date: string;
  meals: UserMeal[];
  count: number;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const getDailyMeals = async (date: string): Promise<DailyMealsResponse> => {
  const response = await fetch(`${API_BASE_URL}/user-meals/daily/${date}`, {
    method: 'GET',
    headers: createHeaders(true),
  });
  return handleResponse(response);
};

export const deleteUserMeal = async (userMealId: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/user-meals/${userMealId}`, {
    method: 'DELETE',
    headers: createHeaders(true),
  });
  return handleResponse(response);
};

export interface UpdateUserMealRequest {
  serving_multiplier?: number;
  notes?: string;
  consumed_at?: string;
}

export const updateUserMeal = async (
  userMealId: number,
  data: UpdateUserMealRequest
): Promise<{ message: string; user_meal: UserMeal }> => {
  const response = await fetch(`${API_BASE_URL}/user-meals/${userMealId}`, {
    method: 'PUT',
    headers: createHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};
