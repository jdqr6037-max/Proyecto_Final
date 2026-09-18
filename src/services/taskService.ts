import { FoodTask, AiExplanationSuggestion, UserMealPreferences, DayPlanRecommendation } from '../types';

export interface TestResultItem {
  name: string;
  status: 'pass' | 'fail';
  message?: string;
}

export interface AutomatedTestsResponse {
  success: boolean;
  allPassed: boolean;
  total: number;
  passed: number;
  results: TestResultItem[];
}

export async function fetchTasks(userId: string): Promise<FoodTask[]> {
  const res = await fetch(`/api/tasks?userId=${encodeURIComponent(userId)}`, {
    headers: {
      'x-user-id': userId,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status}: No se pudieron cargar las tareas.`);
  }

  const json = await res.json();
  return json.tasks || [];
}

export async function createTaskApi(
  userId: string,
  data: {
    title: string;
    meal: string;
    time: string;
    status?: 'pendiente' | 'en_preparacion' | 'completada';
    notes?: string;
    aiSuggestion?: AiExplanationSuggestion | null;
  }
): Promise<FoodTask> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({
      userId,
      ...data,
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || `Error ${res.status}: Falló la creación de la tarea.`);
  }

  return json.task;
}

export async function updateTaskApi(
  userId: string,
  taskId: string,
  data: Partial<{
    title: string;
    meal: string;
    time: string;
    status: 'pendiente' | 'en_preparacion' | 'completada';
    notes: string;
    aiSuggestion: AiExplanationSuggestion | null;
  }>
): Promise<FoodTask> {
  const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({
      userId,
      ...data,
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || `Error ${res.status}: Falló la actualización de la tarea.`);
  }

  return json.task;
}

export async function generateAiExplanationApi(
  title: string,
  meal: string,
  time: string
): Promise<AiExplanationSuggestion> {
  const res = await fetch('/api/ai/explain', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      meal,
      time,
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || `Error ${res.status}: Falló la generación de explicación con Gemini.`);
  }

  return json.suggestion;
}

export async function runAutomatedTestsApi(): Promise<AutomatedTestsResponse> {
  const res = await fetch('/api/tests/run');
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || 'Error al ejecutar suite de pruebas.');
  }
  return json;
}

export async function generateMealPlanApi(
  userName: string,
  preferences: UserMealPreferences
): Promise<DayPlanRecommendation> {
  const res = await fetch('/api/ai/plan-meals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName,
      dietStyle: preferences.dietStyle,
      dailyCaloriesTarget: preferences.dailyCaloriesTarget,
      restrictions: preferences.restrictions,
      budgetLevel: preferences.budgetLevel,
      mealsPerDay: preferences.mealsPerDay,
      cookingTimePreference: preferences.cookingTimePreference,
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || `Error ${res.status}: No se pudo generar el plan de comidas.`);
  }

  return json.plan;
}
