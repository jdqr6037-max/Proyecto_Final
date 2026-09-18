import React from 'react';
import { RecommendedMeal, DayPlanRecommendation } from '../../types';

interface RecommendedMealsListProps {
  plan: DayPlanRecommendation;
  onAddTaskFromMeal: (meal: RecommendedMeal) => void;
  onOrderMeal: (meal: RecommendedMeal) => void;
  addedMealIds: Set<string>;
}

export const RecommendedMealsList: React.FC<RecommendedMealsListProps> = ({
  plan,
  onAddTaskFromMeal,
  onOrderMeal,
  addedMealIds
}) => {
  const getMealTypeBadge = (type: RecommendedMeal['mealType']) => {
    switch (type) {
      case 'Desayuno':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: 'wb_sunny',
        };
      case 'Almuerzo':
        return {
          bg: 'bg-orange-100 text-orange-950 border-orange-300',
          icon: 'restaurant',
        };
      case 'Merienda':
        return {
          bg: 'bg-purple-100 text-purple-950 border-purple-300',
          icon: 'bakery_dining',
        };
      case 'Cena':
        return {
          bg: 'bg-indigo-100 text-indigo-950 border-indigo-300',
          icon: 'nights_stay',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-900 border-slate-300',
          icon: 'dinner_dining',
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Plan Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-stone-900 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-400 text-cyan-950 font-black text-xs uppercase tracking-wider">
              {plan.dietTypeLabel}
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              {plan.date}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">{plan.title}</h3>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
            {plan.summary}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 border-slate-700 pt-3 sm:pt-0">
          <div className="text-right">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Aporte Total del Día</span>
            <span className="text-2xl font-black text-amber-300">{plan.totalCalories} kcal</span>
          </div>
          <span className="text-xs text-slate-300 font-bold">
            {plan.meals.length} comidas programadas
          </span>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {plan.meals.map((meal, index) => {
          const badge = getMealTypeBadge(meal.mealType);
          const isAdded = addedMealIds.has(meal.id);

          return (
            <div
              key={meal.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Row: Time, Type & Match Score */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 border ${badge.bg}`}>
                      <span className="material-symbols-outlined text-[15px]">{badge.icon}</span>
                      <span>{meal.mealType}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {meal.time} hrs
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-black">
                    {meal.matchScore}% Match
                  </span>
                </div>

                {/* Dish Name and Restaurant Hint */}
                <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#ab3500] transition-colors leading-snug">
                  {meal.dishName}
                </h4>
                
                <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold mt-1">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">storefront</span>
                  <span>Restaurante sugerido: <strong>{meal.restaurantHint}</strong></span>
                </div>

                {/* Recommendation Reason */}
                <div className="mt-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
                  <div className="flex items-center gap-1 font-bold text-amber-900 mb-0.5">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    <span>¿Por qué te lo recomendamos?</span>
                  </div>
                  {meal.recommendationReason}
                </div>

                {/* Highlight Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {meal.highlightBadges.map((h, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {h}
                    </span>
                  ))}
                </div>

                {/* Macro Nutrients Strip */}
                <div className="grid grid-cols-4 gap-2 my-4 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Calorías</span>
                    <span className="block text-xs font-black text-slate-900">{meal.calories} kcal</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-emerald-700">Proteína</span>
                    <span className="block text-xs font-black text-emerald-800">{meal.proteinGrams}g</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-amber-700">Carbs</span>
                    <span className="block text-xs font-black text-amber-800">{meal.carbsGrams}g</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-blue-700">Grasas</span>
                    <span className="block text-xs font-black text-blue-800">{meal.fatGrams}g</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Precio Est.</span>
                  <span className="text-base font-black text-slate-900">S/ {meal.priceSol}.00</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Button 1: Add to Scheduled Tasks */}
                  <button
                    type="button"
                    onClick={() => onAddTaskFromMeal(meal)}
                    disabled={isAdded}
                    className={`h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                    title={isAdded ? 'Ya está en tus tareas' : 'Añadir a mi lista de tareas gastronómicas'}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isAdded ? 'check' : 'add_task'}
                    </span>
                    <span>{isAdded ? 'Añadida' : 'Planificar Tarea'}</span>
                  </button>

                  {/* Button 2: Order in Food Now */}
                  <button
                    type="button"
                    onClick={() => onOrderMeal(meal)}
                    className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                    <span>Pedir</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Daily Tips Banner */}
      {plan.dailyTips && plan.dailyTips.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950">
          <div className="flex items-center gap-2 mb-2 font-black text-amber-900">
            <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            <span>Consejos Nutricionales del Chef para tu Día:</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium list-disc list-inside">
            {plan.dailyTips.map((tip, idx) => (
              <li key={idx} className="leading-relaxed">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Official Disclaimer */}
      <div className="text-center text-[11px] text-slate-400 max-w-xl mx-auto py-2">
        {plan.disclaimer}
      </div>

    </div>
  );
};
