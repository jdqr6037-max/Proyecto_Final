export type ScreenId = 
  | 'tablero' 
  | 'tareas'
  | 'mapa' 
  | 'pedidos' 
  | 'login' 
  | 'explorar' 
  | 'favoritos' 
  | 'perfil' 
  | 'checkout';

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

export type SimulationState = 'normal' | 'loading' | 'error' | 'empty';

export interface Dish {
  id: string;
  name: string;
  restaurant: string;
  district: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  eta: string;
  deliveryFee: string;
  imageUrl: string;
  category: string;
  isPopular?: boolean;
  isFavorite?: boolean;
  freeDelivery?: boolean;
  description: string;
}

export interface Promotion {
  title: string;
  description: string;
  dateRangeText: string; // e.g. "Válido del 15 al 28 de Septiembre 2026"
  validUntil: string;
  discountTag: string; // e.g. "2x1", "-30%", "Envío Gratis"
  daysLeft: number;
  active: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  district: string;
  rating: number;
  reviewsCount: number;
  eta: string;
  deliveryFee: string;
  minOrder: number;
  imageUrl: string;
  badge?: string;
  isFavorite?: boolean;
  isOpen: boolean;
  statusLabel: string; // "Abierto ahora" | "Cerrado hoy"
  openingHoursText: string; // "Lun - Dom: 11:30 - 22:30"
  scheduleNote?: string;
  distanceKm: number;
  stallType: 'Puesto Callejero' | 'Restaurante Gourmet' | 'Huco Tradicional' | 'Cevichería Local';
  address: string;
  coordinates: {
    mapTop: string;
    mapLeft: string;
  };
  promotion?: Promotion;
  dishes?: Dish[];
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  note?: string;
}

export interface DeliveryTimelineStep {
  step: number;
  label: string;
  time: string;
  completed: boolean;
  current: boolean;
  description: string;
  icon: string;
}

export interface OrderTracking {
  id: string;
  status: 'confirmado' | 'cocina' | 'reparto' | 'entregado';
  stepNumber: number; // 1 to 4
  statusText: string;
  title: string;
  etaMinutes: number;
  estimatedArrivalHour: string;
  total: number;
  restaurantName: string;
  restaurantAddress: string;
  deliveryAddress: string;
  itemsSummary: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    portion?: string;
  }[];
  driver: {
    name: string;
    vehicle: string;
    plate: string;
    rating: number;
    phone: string;
  };
  driverName?: string;
  driverVehicle?: string;
  driverRating?: number;
  dishImageUrl: string;
  timeline: DeliveryTimelineStep[];
}

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string;
  savedAddresses: { id: string; label: string; address: string; isDefault: boolean }[];
  activeOrdersCount: number;
  notificationsCount: number;
  token?: string;
}

export interface UserMealPreferences {
  dietStyle: 'balanceada' | 'alta_proteina' | 'keto' | 'vegetariana' | 'criolla_ligera' | 'mediterranea';
  dailyCaloriesTarget: number;
  proteinTargetGrams: number;
  carbsTargetGrams?: number;
  fatTargetGrams?: number;
  budgetLevel: 'economico' | 'balanceado' | 'gourmet';
  restrictions: string[];
  mealsPerDay: number;
  cookingTimePreference: 'rapido' | 'moderado' | 'elaborado';
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
  matchScore: number; // e.g. 95%
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
