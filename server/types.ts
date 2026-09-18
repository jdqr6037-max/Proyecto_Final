export interface AiExplanationSuggestion {
  isSuggestion: true;
  disclaimer: string;
  resumen: string;
  proximosPasos: string[];
  nivelDeSatisfaccion: string;
  generatedAt: string;
}

export interface FoodTask {
  id: string;
  userId: string;
  title: string;
  meal: string;
  time: string;
  status: 'pendiente' | 'en_preparacion' | 'completada';
  notes?: string;
  aiSuggestion?: AiExplanationSuggestion | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  meal: string;
  time: string;
  status?: 'pendiente' | 'en_preparacion' | 'completada';
  notes?: string;
  aiSuggestion?: AiExplanationSuggestion | null;
}

export interface UpdateTaskInput {
  title?: string;
  meal?: string;
  time?: string;
  status?: 'pendiente' | 'en_preparacion' | 'completada';
  notes?: string;
  aiSuggestion?: AiExplanationSuggestion | null;
}

export interface MealPlanRequestInput {
  userName?: string;
  dietStyle?: string;
  dailyCaloriesTarget?: number;
  restrictions?: string[];
  budgetLevel?: string;
  mealsPerDay?: number;
  cookingTimePreference?: string;
}

export interface RecommendedMeal {
  id: string;
  mealType: 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena';
  time: string;
  title: string;
  dishName: string;
  restaurantHint: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  priceSol: number;
  matchScore: number;
  recommendationReason: string;
  highlightBadges: string[];
  isSuggestion: true;
  disclaimer: string;
}

export interface DayPlanRecommendation {
  id: string;
  date: string;
  title: string;
  summary: string;
  dietTypeLabel: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: RecommendedMeal[];
  dailyTips: string[];
  aiGenerated: boolean;
  disclaimer: string;
}
