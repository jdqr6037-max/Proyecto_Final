import React, { useState, useEffect, useCallback } from 'react';
import { 
  FoodTask, 
  AiExplanationSuggestion, 
  UserMealPreferences, 
  DayPlanRecommendation, 
  RecommendedMeal 
} from '../types';
import { 
  fetchTasks, 
  createTaskApi, 
  updateTaskApi, 
  generateAiExplanationApi, 
  runAutomatedTestsApi, 
  generateMealPlanApi,
  TestResultItem 
} from '../services/taskService';
import { NutritionalCharts } from '../components/planner/NutritionalCharts';
import { UserPreferencesForm } from '../components/planner/UserPreferencesForm';
import { RecommendedMealsList } from '../components/planner/RecommendedMealsList';

interface PlanificadorTareasViewProps {
  currentUserId: string;
  userName: string;
  onShowToast: (msg: string) => void;
  onAddToCart?: (dishName: string) => void;
}

type ActivePlannerTab = 'plan' | 'preferencias' | 'agenda' | 'pruebas';

export const PlanificadorTareasView: React.FC<PlanificadorTareasViewProps> = ({
  currentUserId: initialUserId,
  userName,
  onShowToast,
  onAddToCart
}) => {
  const [activeTab, setActiveTab] = useState<ActivePlannerTab>('plan');
  const [activeUserId, setActiveUserId] = useState<string>(initialUserId || 'user-mateo');

  // User Meal Preferences State
  const [preferences, setPreferences] = useState<UserMealPreferences>({
    dietStyle: 'balanceada',
    dailyCaloriesTarget: 2000,
    proteinTargetGrams: 125,
    restrictions: ['Bajo en sodio'],
    budgetLevel: 'balanceado',
    mealsPerDay: 4,
    cookingTimePreference: 'rapido',
  });

  // Recommended Day Plan State
  const [currentPlan, setCurrentPlan] = useState<DayPlanRecommendation | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [addedMealIds, setAddedMealIds] = useState<Set<string>>(new Set());

  // Existing Tasks Management State
  const [tasks, setTasks] = useState<FoodTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
  const [tasksErrorMsg, setTasksErrorMsg] = useState<string | null>(null);

  // Quick Task Form State
  const [taskTitle, setTaskTitle] = useState<string>('Almuerzo Criollo Recomendado');
  const [taskMeal, setTaskMeal] = useState<string>('Ají de Gallina Fit con Arroz Jazmín');
  const [taskTime, setTaskTime] = useState<string>('13:15');
  const [taskNotes, setTaskNotes] = useState<string>('Planificado con IA según meta calórica');
  const [taskStatus, setTaskStatus] = useState<'pendiente' | 'en_preparacion' | 'completada'>('pendiente');
  const [savingTask, setSavingTask] = useState<boolean>(false);

  // Task AI Suggestion State
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiExplanationSuggestion | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Automated Tests State
  const [testResults, setTestResults] = useState<TestResultItem[] | null>(null);
  const [testingInProgress, setTestingInProgress] = useState<boolean>(false);

  // Load user tasks
  const loadUserTasks = useCallback(async (userId: string) => {
    setLoadingTasks(true);
    setTasksErrorMsg(null);
    try {
      const data = await fetchTasks(userId);
      setTasks(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar tareas';
      setTasksErrorMsg(msg);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    loadUserTasks(activeUserId);
  }, [activeUserId, loadUserTasks]);

  // Initial Plan Generation
  const fetchMealPlan = useCallback(async (prefsToUse?: UserMealPreferences) => {
    setIsGeneratingPlan(true);
    setPlanError(null);
    try {
      const targetPrefs = prefsToUse || preferences;
      const plan = await generateMealPlanApi(userName, targetPrefs);
      setCurrentPlan(plan);
      onShowToast(`✨ Plan "${plan.title}" generado con éxito`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al generar recomendaciones';
      setPlanError(msg);
      onShowToast(`❌ ${msg}`);
    } finally {
      setIsGeneratingPlan(false);
    }
  }, [preferences, userName, onShowToast]);

  // Auto-generate initial plan on mount
  useEffect(() => {
    if (!currentPlan) {
      fetchMealPlan();
    }
  }, [fetchMealPlan, currentPlan]);

  // Handler: Add a Recommended Meal as a Scheduled Task
  const handleAddTaskFromMeal = async (meal: RecommendedMeal) => {
    try {
      const newTask = await createTaskApi(activeUserId, {
        title: `${meal.mealType}: ${meal.dishName}`,
        meal: meal.dishName,
        time: meal.time,
        status: 'pendiente',
        notes: `Restaurante: ${meal.restaurantHint}. Calorías: ${meal.calories} kcal. ${meal.recommendationReason}`,
        aiSuggestion: {
          isSuggestion: true,
          disclaimer: meal.disclaimer,
          resumen: `Comida recomendada de ${meal.calories} kcal (${meal.proteinGrams}g P, ${meal.carbsGrams}g C, ${meal.fatGrams}g G).`,
          proximosPasos: [
            `Solicitar despacho antes de las ${meal.time} hrs`,
            `Validar ingredientes frescos en ${meal.restaurantHint}`,
            `Acompañar con abundante hidratación`
          ],
          nivelDeSatisfaccion: `${meal.matchScore}% Afin`,
          generatedAt: new Date().toISOString()
        }
      });

      setTasks(prev => [newTask, ...prev]);
      setAddedMealIds(prev => new Set(prev).add(meal.id));
      onShowToast(`✅ "${meal.dishName}" programado en tu agenda de tareas`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al agendar tarea';
      onShowToast(`❌ ${msg}`);
    }
  };

  // Handler: Order Recommended Meal directly
  const handleOrderMeal = (meal: RecommendedMeal) => {
    if (onAddToCart) {
      onAddToCart(meal.dishName);
    } else {
      onShowToast(`Plato añadido a tu canasta: ${meal.dishName}`);
    }
  };

  // Handler: Update Task Status
  const handleUpdateStatus = async (taskId: string, newStatus: 'pendiente' | 'en_preparacion' | 'completada') => {
    try {
      const updated = await updateTaskApi(activeUserId, taskId, { status: newStatus });
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      onShowToast(`Estado actualizado: ${newStatus.replace('_', ' ')}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar tarea';
      onShowToast(`❌ ${msg}`);
    }
  };

  // Handler: Generate Explanation for custom task
  const handleGenerateExplanation = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const suggestion = await generateAiExplanationApi(taskTitle, taskMeal, taskTime);
      setAiSuggestion(suggestion);
      onShowToast('✨ Explicación culinaria generada');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fallo en llamada Gemini';
      setAiError(msg);
    } finally {
      setAiLoading(false);
    }
  };

  // Handler: Create manual custom task
  const handleCreateCustomTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTask(true);
    try {
      const created = await createTaskApi(activeUserId, {
        title: taskTitle,
        meal: taskMeal,
        time: taskTime,
        status: taskStatus,
        notes: taskNotes,
        aiSuggestion
      });
      setTasks(prev => [created, ...prev]);
      onShowToast(`✅ Tarea guardada con éxito`);
      setTaskTitle('');
      setTaskMeal('');
      setTaskTime('');
      setTaskNotes('');
      setAiSuggestion(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar tarea';
      onShowToast(`❌ ${msg}`);
    } finally {
      setSavingTask(false);
    }
  };

  // Handler: Run automated test suite
  const handleRunTests = async () => {
    setTestingInProgress(true);
    try {
      const res = await runAutomatedTestsApi();
      setTestResults(res.results);
      if (res.allPassed) {
        onShowToast(`🎉 Todas las ${res.total} pruebas automatizadas pasaron con éxito`);
      } else {
        onShowToast(`⚠️ ${res.passed}/${res.total} pruebas superadas`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fallo en pruebas';
      onShowToast(`❌ ${msg}`);
    } finally {
      setTestingInProgress(false);
    }
  };

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-6 sm:space-y-8" role="main" aria-label="Planificador Nutricional y Gastronómico">
      
      {/* Top Banner: Persona & IA Engine */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
              Planificador Gastronómico con IA
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold text-[10px]">
              Gemini 3.8 Flash
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Planificador & Recomendaciones Nutricionales
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Planifica comidas saludables adaptadas a tus objetivos, calorías y gustos culinarios, con gráficos interactivos y delivery inmediato.
          </p>
        </div>

        {/* User Switcher to verify data isolation */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl shrink-0 self-start md:self-auto">
          <span className="text-[11px] font-bold text-slate-500 pl-2">Perfil:</span>
          {(['user-mateo', 'user-valeria'] as const).map((uid) => (
            <button
              key={uid}
              type="button"
              onClick={() => setActiveUserId(uid)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeUserId === uid
                  ? 'bg-slate-900 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {uid === 'user-mateo' ? 'Mateo (Atleta)' : 'Valeria (Vegana)'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Accessible Tabs Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'plan'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-selected={activeTab === 'plan'}
        >
          <span className="material-symbols-outlined text-[20px] text-amber-600">pie_chart</span>
          <span>Plan Recomendado & Gráficos</span>
          {currentPlan && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
              {currentPlan.totalCalories} kcal
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferencias')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'preferencias'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-selected={activeTab === 'preferencias'}
        >
          <span className="material-symbols-outlined text-[20px] text-cyan-600">tune</span>
          <span>Configurar Preferencias</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('agenda')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'agenda'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-selected={activeTab === 'agenda'}
        >
          <span className="material-symbols-outlined text-[20px] text-emerald-600">checklist</span>
          <span>Agenda de Tareas</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black">
            {tasks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pruebas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'pruebas'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-selected={activeTab === 'pruebas'}
        >
          <span className="material-symbols-outlined text-[20px] text-purple-600">verified</span>
          <span>Pruebas de Sistema</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black">
            26 tests
          </span>
        </button>
      </div>

      {/* TAB 1: PLAN RECOMENDADO & GRÁFICOS */}
      {activeTab === 'plan' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Quick Preferences Bar (Inline) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase text-slate-500">Plan Actual:</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs">
                {preferences.dietStyle.toUpperCase()}
              </span>
              <span className="text-xs font-bold text-slate-700">
                Meta: {preferences.dailyCaloriesTarget} kcal • {preferences.mealsPerDay} comidas
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('preferencias')}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                Ajustar Preferencias
              </button>
              <button
                type="button"
                onClick={() => fetchMealPlan()}
                disabled={isGeneratingPlan}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                {isGeneratingPlan ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span>Re-calculando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px] text-amber-300">refresh</span>
                    <span>Actualizar con IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Gráficos Nutricionales (Recharts) */}
          {currentPlan ? (
            <NutritionalCharts plan={currentPlan} preferences={preferences} />
          ) : isGeneratingPlan ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
              <span className="material-symbols-outlined text-[36px] text-emerald-600 animate-spin">
                progress_activity
              </span>
              <h3 className="text-base font-bold text-slate-900">Generando Gráficos y Recomendaciones Nutricionales...</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                El chef nutricionista de Food Now está calculando los macronutrientes ideales según tu preferencia.
              </p>
            </div>
          ) : planError ? (
            <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 text-center">
              <p className="font-bold">{planError}</p>
              <button
                type="button"
                onClick={() => fetchMealPlan()}
                className="mt-3 px-4 py-2 rounded-xl bg-rose-700 text-white font-bold text-xs"
              >
                Reintentar
              </button>
            </div>
          ) : null}

          {/* Tarjetas de Comidas Recomendables */}
          {currentPlan && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-600 text-[24px]">restaurant_menu</span>
                  <span>Comidas Recomendables del Día</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Personalizadas para ti
                </span>
              </div>

              <RecommendedMealsList
                plan={currentPlan}
                onAddTaskFromMeal={handleAddTaskFromMeal}
                onOrderMeal={handleOrderMeal}
                addedMealIds={addedMealIds}
              />
            </div>
          )}

        </div>
      )}

      {/* TAB 2: CONFIGURAR PREFERENCIAS */}
      {activeTab === 'preferencias' && (
        <div className="animate-in fade-in duration-200">
          <UserPreferencesForm
            preferences={preferences}
            onChangePreferences={(newPrefs) => setPreferences(newPrefs)}
            onGeneratePlan={() => {
              fetchMealPlan();
              setActiveTab('plan');
            }}
            isLoading={isGeneratingPlan}
          />
        </div>
      )}

      {/* TAB 3: AGENDA DE TAREAS GASTRONÓMICAS */}
      {activeTab === 'agenda' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Quick Task Creation Form */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[22px]">add_task</span>
              <span>Añadir Tarea Gastronómica Personalizada</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Programa un recordatorio o pedido para {activeUserId === 'user-mateo' ? 'Mateo' : 'Valeria'}.
            </p>

            <form onSubmit={handleCreateCustomTask} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Título:</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Ej: Almuerzo ligero"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Plato / Bebida:</label>
                <input
                  type="text"
                  value={taskMeal}
                  onChange={(e) => setTaskMeal(e.target.value)}
                  placeholder="Ej: Tiradito al ají amarillo"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Hora:</label>
                <input
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-slate-900"
                  required
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={handleGenerateExplanation}
                  disabled={aiLoading}
                  className="h-10 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                  title="Consultar análisis con Gemini"
                >
                  <span className="material-symbols-outlined text-[16px] text-cyan-600">psychology</span>
                  <span>{aiLoading ? '...' : 'IA'}</span>
                </button>

                <button
                  type="submit"
                  disabled={savingTask}
                  className="flex-1 h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Guardar</span>
                </button>
              </div>
            </form>

            {/* AI Suggestion Box for this custom task */}
            {aiSuggestion && (
              <div className="mt-4 p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs">
                <div className="flex items-center gap-1 font-bold text-cyan-900 mb-1">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>Sugerencia Culinaria con Gemini:</span>
                </div>
                <p className="font-medium">{aiSuggestion.resumen}</p>
                <span className="block text-[10px] text-cyan-700 mt-2">{aiSuggestion.disclaimer}</span>
              </div>
            )}
          </div>

          {/* User Tasks List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-700 text-[20px]">format_list_bulleted</span>
                <span>Tareas Registradas ({tasks.length})</span>
              </h3>
              <span className="text-xs text-slate-500">
                Aislamiento estricto: {activeUserId}
              </span>
            </div>

            {loadingTasks ? (
              <div className="p-8 text-center text-xs text-slate-500">Cargando agenda...</div>
            ) : tasks.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs">
                No tienes tareas programadas aún. Añade una comida recomendada desde la pestaña "Plan Recomendado".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-black text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {task.time} hrs
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          task.status === 'completada'
                            ? 'bg-emerald-100 text-emerald-900'
                            : task.status === 'en_preparacion'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-black text-slate-900">{task.title}</h4>
                      <p className="text-xs font-semibold text-emerald-800 mt-0.5">{task.meal}</p>
                      {task.notes && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{task.notes}</p>
                      )}
                    </div>

                    {/* Status change actions */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400">Cambiar estado:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(task.id, 'pendiente')}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                            task.status === 'pendiente' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Pendiente
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(task.id, 'en_preparacion')}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                            task.status === 'en_preparacion' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          En Cocina
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(task.id, 'completada')}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                            task.status === 'completada' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Completada
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 4: PRUEBAS AUTOMATIZADAS DE SISTEMA */}
      {activeTab === 'pruebas' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600 text-[24px]">verified</span>
                <span>Suite de Verificación y Resiliencia Automatizada</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Valida aislamiento de usuarios, validaciones 400, 404, 403, schemas y motor de sugerencias Gemini.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunTests}
              disabled={testingInProgress}
              className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
            >
              {testingInProgress ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  <span>Ejecutando suite...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  <span>Ejecutar Suite de 26 Pruebas</span>
                </>
              )}
            </button>
          </div>

          {testResults && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase text-slate-700">Resultados Detallados:</span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs">
                  {testResults.filter(r => r.status === 'pass').length} / {testResults.length} Superadas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
                {testResults.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-medium"
                  >
                    <span className="truncate pr-2 text-slate-800 font-semibold">{t.name}</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 ${
                      t.status === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {t.status === 'pass' ? '✓ PASS' : '✗ FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
