import React from 'react';
import { UserMealPreferences } from '../../types';

interface UserPreferencesFormProps {
  preferences: UserMealPreferences;
  onChangePreferences: (prefs: UserMealPreferences) => void;
  onGeneratePlan: () => void;
  isLoading: boolean;
}

export const UserPreferencesForm: React.FC<UserPreferencesFormProps> = ({
  preferences,
  onChangePreferences,
  onGeneratePlan,
  isLoading
}) => {
  const dietOptions = [
    {
      id: 'balanceada',
      title: 'Criolla Equilibrada',
      subtitle: 'Sabor peruano auténtico y balance de macros',
      icon: 'restaurant',
      color: 'border-amber-300 hover:border-amber-500 bg-amber-50/40',
      activeColor: 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600',
    },
    {
      id: 'alta_proteina',
      title: 'Alto en Proteína',
      subtitle: 'Para fuerza muscular, saciedad y rendimiento',
      icon: 'fitness_center',
      color: 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/40',
      activeColor: 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600',
    },
    {
      id: 'vegetariana',
      title: 'Plant-Based & Veg',
      subtitle: 'Legumbres andinas, tubérculos y vegetales frescos',
      icon: 'spa',
      color: 'border-green-300 hover:border-green-500 bg-green-50/40',
      activeColor: 'border-green-600 bg-green-50 text-green-950 ring-2 ring-green-600',
    },
    {
      id: 'keto',
      title: 'Keto / Baja en Carbs',
      subtitle: 'Grasas saludables, moderada proteína y mínimos carbohidratos',
      icon: 'bolt',
      color: 'border-purple-300 hover:border-purple-500 bg-purple-50/40',
      activeColor: 'border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-600',
    },
  ];

  const commonRestrictions = [
    'Sin gluten',
    'Sin lactosa',
    'Bajo en sodio',
    'Sin mariscos',
    'Sin azúcar refinada',
    'Frutos secos libres'
  ];

  const toggleRestriction = (item: string) => {
    const exists = preferences.restrictions.includes(item);
    const updated = exists
      ? preferences.restrictions.filter((r) => r !== item)
      : [...preferences.restrictions, item];
    onChangePreferences({ ...preferences, restrictions: updated });
  };

  const applyPreset = (
    dietStyle: UserMealPreferences['dietStyle'],
    calories: number,
    restrictions: string[] = []
  ) => {
    onChangePreferences({
      ...preferences,
      dietStyle,
      dailyCaloriesTarget: calories,
      proteinTargetGrams: Math.round(calories * (dietStyle === 'alta_proteina' ? 0.3 : 0.22) / 4),
      restrictions,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
      
      {/* Header with Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ab3500] text-[24px]">tune</span>
            <span>Preferencias Gastronómicas y Nutricionales</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Ajusta tu objetivo calórico, estilo de alimentación y requerimientos para que el planificador cree tu menú ideal.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Atajos:</span>
          <button
            type="button"
            onClick={() => applyPreset('alta_proteina', 2300)}
            className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            ⚡ Atleta (2300 kcal)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('balanceada', 1900)}
            className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            🥑 Criollo (1900 kcal)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('vegetariana', 1800, ['Sin lactosa'])}
            className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-800 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
          >
            🌱 Vegano (1800 kcal)
          </button>
        </div>
      </div>

      {/* 1. Estilo de Dieta / Preferencia Culinaria */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2.5">
          1. Estilo de Alimentación Recomendado:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dietOptions.map((opt) => {
            const isSelected = preferences.dietStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  onChangePreferences({
                    ...preferences,
                    dietStyle: opt.id as any,
                  })
                }
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected ? opt.activeColor : `${opt.color} border-slate-200`
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="material-symbols-outlined text-[24px]">{opt.icon}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[12px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <span className="block text-sm font-extrabold text-slate-900">{opt.title}</span>
                  <span className="block text-[11px] text-slate-600 mt-1 leading-snug">{opt.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Meta Calórica Diaria & Distribución de Comidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
        
        {/* Slider de Calorías */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="cal-range" className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              2. Meta Calórica Diaria:
            </label>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-black text-sm">
              {preferences.dailyCaloriesTarget} kcal
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Ajusta según tu objetivo de peso o gasto calórico diario.
          </p>

          <input
            id="cal-range"
            type="range"
            min={1400}
            max={3200}
            step={50}
            value={preferences.dailyCaloriesTarget}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChangePreferences({
                ...preferences,
                dailyCaloriesTarget: val,
                proteinTargetGrams: Math.round(val * 0.25 / 4)
              });
            }}
            className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1.5">
            <span>1400 (Déficit)</span>
            <span>2000 (Estándar)</span>
            <span>2600 (Activo)</span>
            <span>3200 (Atleta)</span>
          </div>
        </div>

        {/* Número de Comidas & Presupuesto */}
        <div className="flex flex-col justify-between gap-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
              Comidas por Día:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { count: 3, label: '3 comidas', desc: 'Desayuno, Almuerzo, Cena' },
                { count: 4, label: '4 comidas', desc: '+ Merienda / Snack energético' },
              ].map((m) => (
                <button
                  key={m.count}
                  type="button"
                  onClick={() => onChangePreferences({ ...preferences, mealsPerDay: m.count as 3 | 4 })}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    preferences.mealsPerDay === m.count
                      ? 'bg-white border-slate-900 text-slate-900 shadow-xs font-extrabold ring-1 ring-slate-900'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="block text-xs font-bold">{m.label}</span>
                  <span className="block text-[10px] text-slate-500 truncate">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
              Rango de Presupuesto:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'economico', label: 'Económico', desc: 'S/ 15-25' },
                { id: 'balanceado', label: 'Balanceado', desc: 'S/ 25-45' },
                { id: 'gourmet', label: 'Gourmet', desc: 'S/ 45+' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onChangePreferences({ ...preferences, budgetLevel: b.id as any })}
                  className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                    preferences.budgetLevel === b.id
                      ? 'bg-white border-slate-900 text-slate-900 shadow-xs font-extrabold ring-1 ring-slate-900'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="block text-xs font-bold">{b.label}</span>
                  <span className="block text-[10px] text-slate-500">{b.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Restricciones o Alergias Alimentarias */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
          3. Restricciones o Alergias Alimentarias:
        </label>
        <div className="flex flex-wrap gap-2">
          {commonRestrictions.map((item) => {
            const isChecked = preferences.restrictions.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleRestriction(item)}
                className={`h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-rose-50 text-rose-950 border-rose-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                aria-pressed={isChecked}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isChecked ? 'check_circle' : 'add_circle'}
                </span>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action CTA: Generate Meal Plan with AI */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-cyan-600">auto_awesome</span>
          <span>Modelo Gemini conectado: adapta los restaurantes de Food Now a tus macros.</span>
        </div>

        <button
          type="button"
          onClick={onGeneratePlan}
          disabled={isLoading}
          className="w-full sm:w-auto h-12 px-6 rounded-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              <span>Chef IA diseñando tu plan gastronómico...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px] text-amber-300">sparkles</span>
              <span>Generar Plan de Comidas Recomendable</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
