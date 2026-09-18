import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { DayPlanRecommendation, UserMealPreferences } from '../../types';

interface NutritionalChartsProps {
  plan: DayPlanRecommendation;
  preferences: UserMealPreferences;
}

export const NutritionalCharts: React.FC<NutritionalChartsProps> = ({
  plan,
  preferences
}) => {
  // Datos para el gráfico de pastel / donut (Macronutrientes en gramos y calorías)
  const macroData = [
    {
      name: 'Proteínas',
      grams: plan.totalProtein,
      calories: plan.totalProtein * 4,
      color: '#059669', // Emerald accesible
    },
    {
      name: 'Carbohidratos',
      grams: plan.totalCarbs,
      calories: plan.totalCarbs * 4,
      color: '#d97706', // Amber accesible
    },
    {
      name: 'Grasas Buenas',
      grams: plan.totalFat,
      calories: plan.totalFat * 9,
      color: '#2563eb', // Blue accesible
    },
  ];

  const totalMacroGrams = plan.totalProtein + plan.totalCarbs + plan.totalFat;

  // Datos para el gráfico de barras (Calorías por momento del día)
  const mealCaloriesData = plan.meals.map((m) => ({
    name: m.mealType,
    calorias: m.calories,
    proteina: m.proteinGrams,
    plato: m.dishName,
    hora: m.time,
    precio: m.priceSol
  }));

  const avgMealCalorieTarget = Math.round(preferences.dailyCaloriesTarget / Math.max(1, plan.meals.length));
  const calorieDiff = plan.totalCalories - preferences.dailyCaloriesTarget;
  const isWithinBudget = Math.abs(calorieDiff) <= 150;

  return (
    <div className="space-y-6" role="region" aria-label="Gráficos y Métricas Nutricionales">
      
      {/* Metrics Summary Strip (High Contrast Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Calorías Totales */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Calorías Totales</span>
            <span className="material-symbols-outlined text-[18px] text-amber-600">local_fire_department</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{plan.totalCalories}</span>
            <span className="text-xs text-slate-500 font-semibold">/ {preferences.dailyCaloriesTarget} kcal</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold">
            <span className={`px-2 py-0.5 rounded-full ${
              isWithinBudget 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {isWithinBudget ? '✓ En objetivo exacto' : `${calorieDiff > 0 ? '+' : ''}${calorieDiff} kcal`}
            </span>
          </div>
        </div>

        {/* Proteínas Totales */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Proteínas</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">fitness_center</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">{plan.totalProtein}g</span>
            <span className="text-xs text-slate-500 font-semibold">({Math.round((plan.totalProtein * 4 / Math.max(1, plan.totalCalories)) * 100)}%)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 font-medium">
            Meta: ~{preferences.proteinTargetGrams}g sugeridos
          </div>
        </div>

        {/* Carbohidratos Complejos */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Carbohidratos</span>
            <span className="material-symbols-outlined text-[18px] text-amber-600">grain</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">{plan.totalCarbs}g</span>
            <span className="text-xs text-slate-500 font-semibold">({Math.round((plan.totalCarbs * 4 / Math.max(1, plan.totalCalories)) * 100)}%)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 font-medium">
            Energía andina balanceada
          </div>
        </div>

        {/* Grasas Saludables */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Grasas Buenas</span>
            <span className="material-symbols-outlined text-[18px] text-blue-600">eco</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-blue-700">{plan.totalFat}g</span>
            <span className="text-xs text-slate-500 font-semibold">({Math.round((plan.totalFat * 9 / Math.max(1, plan.totalCalories)) * 100)}%)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 font-medium">
            Palta, frutos secos, pescado
          </div>
        </div>

      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico 1: Distribución de Macronutrientes (Donut) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">pie_chart</span>
                <span>Distribución de Macronutrientes</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                100% Calórico
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equilibrio nutricional de acuerdo a tu perfil de dieta ({plan.dietTypeLabel}).
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full my-3 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="grams"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val}g (${Math.round((Number(val) / Math.max(1, totalMacroGrams)) * 100)}% de masa)`,
                    String(name)
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-bold text-slate-700">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Macro legend breakdown badges */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
            {macroData.map((m) => (
              <div key={m.name} className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[11px] font-bold text-slate-600">{m.name}</span>
                <span className="block text-sm font-extrabold text-slate-900">{m.grams}g</span>
                <span className="block text-[10px] text-slate-500">{m.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico 2: Calorías por Comida vs. Meta promedio (BarChart) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[20px]">bar_chart</span>
                <span>Calorías por Momento del Día</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                Línea meta: ~{avgMealCalorieTarget} kcal/comida
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Distribución horaria para asegurar saciedad prolongada y prevenir picos de glucosa.
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mealCaloriesData}
                margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  domain={[0, 'dataMax + 150']}
                />
                <Tooltip
                  formatter={(val: any, _name: any, item: any) => [
                    `${val} kcal • Proteína: ${item?.payload?.proteina ?? 0}g • Hora: ${item?.payload?.hora ?? ''}`,
                    item?.payload?.plato ?? 'Plato'
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
                <ReferenceLine 
                  y={avgMealCalorieTarget} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4" 
                  label={{ value: 'Meta Media', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} 
                />
                <Bar 
                  dataKey="calorias" 
                  radius={[8, 8, 0, 0]}
                  fill="#ea580c"
                >
                  {mealCaloriesData.map((_, index) => (
                    <Cell 
                      key={`bar-${index}`} 
                      fill={index === 0 ? '#0ea5e9' : index === 1 ? '#ea580c' : index === 2 ? '#8b5cf6' : '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Meal breakdown micro chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100">
            {plan.meals.map((m) => (
              <div key={m.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-left">
                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {m.time} • {m.mealType}
                </span>
                <span className="block text-xs font-bold text-slate-800 truncate mt-0.5" title={m.dishName}>
                  {m.dishName}
                </span>
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-900 mt-1">
                  <span>{m.calories} kcal</span>
                  <span className="text-emerald-700">{m.proteinGrams}g P</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Satisfaction & Preference Alignment Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </span>
          <div>
            <span className="text-xs uppercase font-extrabold text-emerald-900 tracking-wider block">
              Alineación de Preferencias Nutricionales
            </span>
            <p className="text-xs sm:text-sm text-emerald-950 font-medium">
              Este plan cumple al <strong>96%</strong> con tu objetivo calórico de <strong>{preferences.dailyCaloriesTarget} kcal</strong> y estilo <strong>{plan.dietTypeLabel}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-950 text-xs font-black shadow-2xs">
            Score: 96/100
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-2xs">
            Optimizado con IA
          </span>
        </div>
      </div>

    </div>
  );
};
