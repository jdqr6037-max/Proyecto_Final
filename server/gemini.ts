import { GoogleGenAI, Type } from '@google/genai';
import { AiExplanationSuggestion, MealPlanRequestInput, DayPlanRecommendation, RecommendedMeal } from './types';
import { ValidationError } from './data-access';

let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

export interface ExplainRequestInput {
  title: string;
  meal: string;
  time: string;
}

/**
 * Genera la explicación asistida por IA en el servidor.
 * Recibe título, comida y hora. Devuelve JSON con resumen, próximos pasos y nivel de satisfacción.
 * Si faltan datos, lanza un ValidationError controlado (HTTP 400).
 * NUNCA envía la API key al navegador.
 * SIEMPRE marca el resultado explícitamente como SUGERENCIA (no verdad permanente).
 */
export async function generateFoodExplanation(
  input: ExplainRequestInput
): Promise<AiExplanationSuggestion> {
  const title = input?.title?.trim();
  const meal = input?.meal?.trim();
  const time = input?.time?.trim();

  // Validación de campos obligatorios con error controlado
  if (!title || !meal || !time) {
    const missing: string[] = [];
    if (!title) missing.push("'título' (title)");
    if (!meal) missing.push("'comida' (meal)");
    if (!time) missing.push("'hora' (time)");
    throw new ValidationError(
      `Faltan datos obligatorios para generar la explicación: ${missing.join(', ')} no pueden estar vacíos.`
    );
  }

  const disclaimerText =
    'Sugerencia estimada generada por IA. No constituye una verdad permanente ni un compromiso contractual.';

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Analiza esta tarea/pedido de comida para el usuario:
Título: "${title}"
Comida/Plato: "${meal}"
Hora programada: "${time}"

Proporciona una explicación gastronómica y logística útil para el usuario.
Debes devolver un JSON estructurado con:
- resumen: Descripción concisa y apetitosa de la combinación y el momento del día.
- proximosPasos: Lista de 2 a 3 pasos recomendados para preparar o recibir el pedido a tiempo.
- nivelDeSatisfaccion: Estimación porcentual y cualitativa del nivel de satisfacción esperado (ej. "Muy Alto (96%)", "Alto (90%)").`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Eres el asistente gastronómico experto de "Food Now". Generas explicaciones concisas, útiles y optimistas sobre planes de comida, destacando recomendaciones prácticas y tiempos. Todas tus respuestas son sugerencias gastronómicas.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              resumen: {
                type: Type.STRING,
                description: 'Resumen conciso y profesional del pedido gastronómico.',
              },
              proximosPasos: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Lista de 2 a 3 pasos clave a seguir.',
              },
              nivelDeSatisfaccion: {
                type: Type.STRING,
                description: 'Nivel estimado de satisfacción con porcentaje.',
              },
            },
            required: ['resumen', 'proximosPasos', 'nivelDeSatisfaccion'],
          },
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          isSuggestion: true,
          disclaimer: disclaimerText,
          resumen: parsed.resumen || `Plan gastronómico para degustar ${meal} a las ${time}.`,
          proximosPasos: Array.isArray(parsed.proximosPasos) && parsed.proximosPasos.length > 0
            ? parsed.proximosPasos
            : [
                `Revisar disponibilidad del plato en restaurantes cercanos`,
                `Confirmar la orden 25 minutos antes de las ${time}`,
                `Preparar la mesa y bebidas de acompañamiento`
              ],
          nivelDeSatisfaccion: parsed.nivelDeSatisfaccion || 'Alto (92%)',
          generatedAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('Fallo en la llamada a Gemini API, usando generador heurístico de sugerencia:', err);
    }
  }

  // Generador de sugerencia de respaldo (heurístico) si la clave no está configurada o hubo timeout
  return generateHeuristicSuggestion(title, meal, time, disclaimerText);
}

function generateHeuristicSuggestion(
  title: string,
  meal: string,
  time: string,
  disclaimer: string
): AiExplanationSuggestion {
  return {
    isSuggestion: true,
    disclaimer,
    resumen: `Plan gastronómico sugerido para "${title}": degustación de ${meal} programada puntualmente para las ${time} hrs.`,
    proximosPasos: [
      `Validar que el restaurante local prepare ${meal} con ingredientes frescos en ese horario`,
      `Coordinar el despacho para llegar antes de las ${time}`,
      `Añadir nota de cocina personalizada si se requiere picante o guarnición especial`
    ],
    nivelDeSatisfaccion: 'Muy Alto (94%)',
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Planificador Nutricional y Gastronómico Asistido por IA.
 * Recomienda comidas personalizadas según las preferencias del comensal.
 */
export async function generateMealPlanWithAi(
  input: MealPlanRequestInput
): Promise<DayPlanRecommendation> {
  const disclaimerText =
    'Plan nutricional sugerido por IA para fines informativos y de disfrute culinario. Consulte a un nutricionista colegiado para condiciones médicas.';
  const dietStyle = input.dietStyle || 'balanceada';
  const caloriesTarget = input.dailyCaloriesTarget || 2000;
  const restrictions = Array.isArray(input.restrictions) ? input.restrictions.join(', ') : 'Ninguna';
  const budget = input.budgetLevel || 'balanceado';
  const mealsCount = input.mealsPerDay || 4;
  const userName = input.userName || 'Comensal Food Now';

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Actúa como chef nutricionista experto de "Food Now" (Perú).
Genera un plan de comidas recomendado personalizado para ${userName} con las siguientes preferencias:
- Estilo de dieta: ${dietStyle}
- Meta calórica diaria: ${caloriesTarget} kcal
- Restricciones o alergias alimentarias: ${restrictions}
- Presupuesto aproximado: ${budget}
- Número de comidas al día: ${mealsCount} (distribuir entre Desayuno, Almuerzo, Merienda y Cena).

Proporciona platos deliciosos y realistas, inspirados en gastronomía peruana balanceada o internacional saludable disponible en restaurantes de delivery.
Devuelve un JSON con:
- title: Título atractivo del plan
- summary: Resumen explicativo de por qué este plan se ajusta a sus preferencias
- dietTypeLabel: Etiqueta descriptiva del estilo
- totalCalories: Total de calorías de la suma de comidas
- totalProtein: Gramos totales de proteína
- totalCarbs: Gramos totales de carbohidratos
- totalFat: Gramos totales de grasas saludables
- meals: Lista de ${mealsCount} comidas recomendadas, cada una con:
  - id: ID único (string corto)
  - mealType: "Desayuno", "Almuerzo", "Merienda" o "Cena"
  - time: Hora recomendada (ej: "08:30", "13:00", "16:30", "20:00")
  - title: Título del momento
  - dishName: Nombre del plato principal y guarnición
  - restaurantHint: Tipo o nombre de restaurante recomendado donde pedirlo
  - calories: Calorías estimadas del plato (número entero)
  - proteinGrams: Gramos de proteína (número)
  - carbsGrams: Gramos de carbohidratos (número)
  - fatGrams: Gramos de grasa (número)
  - priceSol: Precio estimado en Soles (PEN)
  - matchScore: Porcentaje de afinidad con sus preferencias (número entre 85 y 99)
  - recommendationReason: Razón específica por la que se recomienda según sus gustos
  - highlightBadges: Lista de 2 a 3 etiquetas cortas (ej: "Rico en Hierro", "Bajo en Grasa", "Superalimento")
- dailyTips: 2 o 3 consejos prácticos de hidratación y consumo`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Eres el nutricionista y chef experto de Food Now. Creas planes de comida personalizados, apetitosos, con macro-nutrientes precisos y respeto estricto a las preferencias del usuario. Todas tus respuestas son sugerencias gastronómicas.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              dietTypeLabel: { type: Type.STRING },
              totalCalories: { type: Type.NUMBER },
              totalProtein: { type: Type.NUMBER },
              totalCarbs: { type: Type.NUMBER },
              totalFat: { type: Type.NUMBER },
              meals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    mealType: { type: Type.STRING },
                    time: { type: Type.STRING },
                    title: { type: Type.STRING },
                    dishName: { type: Type.STRING },
                    restaurantHint: { type: Type.STRING },
                    calories: { type: Type.NUMBER },
                    proteinGrams: { type: Type.NUMBER },
                    carbsGrams: { type: Type.NUMBER },
                    fatGrams: { type: Type.NUMBER },
                    priceSol: { type: Type.NUMBER },
                    matchScore: { type: Type.NUMBER },
                    recommendationReason: { type: Type.STRING },
                    highlightBadges: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: [
                    'mealType',
                    'time',
                    'dishName',
                    'calories',
                    'proteinGrams',
                    'carbsGrams',
                    'fatGrams',
                    'recommendationReason',
                  ],
                },
              },
              dailyTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['title', 'summary', 'meals'],
          },
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        const meals: RecommendedMeal[] = (parsed.meals || []).map((m: any, idx: number) => ({
          id: m.id || `meal-rec-${Date.now()}-${idx}`,
          mealType: (['Desayuno', 'Almuerzo', 'Merienda', 'Cena'].includes(m.mealType) ? m.mealType : 'Almuerzo') as any,
          time: m.time || (idx === 0 ? '08:30' : idx === 1 ? '13:15' : idx === 2 ? '16:45' : '20:15'),
          title: m.title || `Comida ${idx + 1}`,
          dishName: m.dishName || 'Plato nutritivo recomendado',
          restaurantHint: m.restaurantHint || 'Restaurantes locales asociados',
          calories: Math.round(Number(m.calories) || 450),
          proteinGrams: Math.round(Number(m.proteinGrams) || 30),
          carbsGrams: Math.round(Number(m.carbsGrams) || 45),
          fatGrams: Math.round(Number(m.fatGrams) || 15),
          priceSol: Math.round(Number(m.priceSol) || 28),
          matchScore: Math.min(100, Math.max(80, Math.round(Number(m.matchScore) || 94))),
          recommendationReason: m.recommendationReason || 'Alineado con tus preferencias nutricionales.',
          highlightBadges: Array.isArray(m.highlightBadges) && m.highlightBadges.length > 0 ? m.highlightBadges : ['Saludable', 'Fresco'],
          isSuggestion: true,
          disclaimer: disclaimerText,
        }));

        const totalCals = meals.reduce((sum, m) => sum + m.calories, 0);
        const totalP = meals.reduce((sum, m) => sum + m.proteinGrams, 0);
        const totalC = meals.reduce((sum, m) => sum + m.carbsGrams, 0);
        const totalF = meals.reduce((sum, m) => sum + m.fatGrams, 0);

        return {
          id: `plan-${Date.now()}`,
          date: new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }),
          title: parsed.title || `Plan Nutricional ${dietStyle.toUpperCase()}`,
          summary: parsed.summary || `Menú equilibrado de ${totalCals} kcal diseñado según tu objetivo.`,
          dietTypeLabel: parsed.dietTypeLabel || dietStyle.replace('_', ' ').toUpperCase(),
          totalCalories: totalCals,
          totalProtein: totalP,
          totalCarbs: totalC,
          totalFat: totalF,
          meals,
          dailyTips: Array.isArray(parsed.dailyTips) && parsed.dailyTips.length > 0
            ? parsed.dailyTips
            : ['Bebe al menos 2 litros de agua a lo largo del día', 'Mantén una pausa de 20 minutos durante la comida'],
          aiGenerated: true,
          disclaimer: disclaimerText,
        };
      }
    } catch (err) {
      console.warn('Fallo en Gemini al generar plan de comidas, usando generador heurístico:', err);
    }
  }

  return generateHeuristicMealPlan(input, disclaimerText);
}

function generateHeuristicMealPlan(
  input: MealPlanRequestInput,
  disclaimer: string
): DayPlanRecommendation {
  const diet = input.dietStyle || 'balanceada';
  const targetCalories = input.dailyCaloriesTarget || 2000;

  // Catálogos culinarios específicos por estilo de preferencia
  const plansByDiet: Record<string, {
    label: string;
    summary: string;
    meals: Omit<RecommendedMeal, 'id' | 'isSuggestion' | 'disclaimer'>[];
    tips: string[];
  }> = {
    alta_proteina: {
      label: 'Alto en Proteína & Rendimiento',
      summary: 'Combinación óptima de proteínas magras, aminoácidos esenciales y carbohidratos complejos para recuperación muscular y energía sostenida.',
      meals: [
        {
          mealType: 'Desayuno',
          time: '08:00',
          title: 'Desayuno Power Andino',
          dishName: 'Huevos revueltos con trucha ahumada, palta fresca y tostadas de quinua',
          restaurantHint: 'Café & Natural Bistro',
          calories: 460,
          proteinGrams: 38,
          carbsGrams: 28,
          fatGrams: 20,
          priceSol: 24,
          matchScore: 98,
          recommendationReason: 'Aporte de 38g de proteína biodisponible y grasas monoinsaturadas para iniciar la jornada.',
          highlightBadges: ['38g Proteína', 'Omega 3', 'Sin azúcar añadida']
        },
        {
          mealType: 'Almuerzo',
          time: '13:00',
          title: 'Almuerzo Lomo Fino & Quinua Real',
          dishName: 'Lomo saltado magro con pimientos al wok, quinua perlada y ensalada criolla sin aderezos pesados',
          restaurantHint: 'Sabor Criollo Tradición',
          calories: 720,
          proteinGrams: 52,
          carbsGrams: 64,
          fatGrams: 24,
          priceSol: 38,
          matchScore: 96,
          recommendationReason: 'Corte magro de res al wok con vegetales frescos y carbohidratos de bajo índice glucémico.',
          highlightBadges: ['52g Proteína', 'Hierro Hemínico', 'Alto Rendimiento']
        },
        {
          mealType: 'Merienda',
          time: '16:30',
          title: 'Snack Post-Entreno / Media Tarde',
          dishName: 'Yogurt griego artesanal con arándanos andinos y semillas de chía',
          restaurantHint: 'EcoMarket & Bowls',
          calories: 240,
          proteinGrams: 22,
          carbsGrams: 20,
          fatGrams: 6,
          priceSol: 16,
          matchScore: 94,
          recommendationReason: 'Refuerzo proteico rápido con antioxidantes naturales.',
          highlightBadges: ['Probióticos', 'Antioxidantes', 'Rápida absorción']
        },
        {
          mealType: 'Cena',
          time: '20:15',
          title: 'Cena Ligera de Pescado Blanco',
          dishName: 'Filete de corvina al vapor con hierbas aromáticas y puré rústico de pallares verdes',
          restaurantHint: 'Cevichería Costa Azul',
          calories: 480,
          proteinGrams: 42,
          carbsGrams: 32,
          fatGrams: 16,
          priceSol: 34,
          matchScore: 97,
          recommendationReason: 'Digestión ligera nocturna con alto contenido de fósforo y proteína limpia.',
          highlightBadges: ['Fácil Digestión', 'Bajo en Sodio', 'Pescado Fresco']
        }
      ],
      tips: [
        'Acompaña las comidas con agua mineral con limón para mejorar la absorción de hierro.',
        'Consume la merienda 45 minutos antes de cualquier actividad física.',
        'La cena ligera favorece una recuperación muscular profunda durante el sueño.'
      ]
    },
    vegetariana: {
      label: 'Plant-Based & Vegetariana Nutritiva',
      summary: 'Selección 100% vegetariana con legumbres andinas, tubérculos nativos y vegetales frescos ricos en fibra y micronutrientes.',
      meals: [
        {
          mealType: 'Desayuno',
          time: '08:15',
          title: 'Desayuno Energético Verde',
          dishName: 'Pudín de chía con leche de almendras, plátano de la isla y tostada con palta y tomate confitado',
          restaurantHint: 'Verde & Raíz Vegana',
          calories: 410,
          proteinGrams: 16,
          carbsGrams: 52,
          fatGrams: 18,
          priceSol: 22,
          matchScore: 97,
          recommendationReason: 'Grasas vegetales nobles y fibra prebiótica para el sistema digestivo.',
          highlightBadges: ['100% Vegetal', 'Rico en Fibra', 'Superalimentos']
        },
        {
          mealType: 'Almuerzo',
          time: '13:15',
          title: 'Almuerzo Andino Solterito & Lentejas',
          dishName: 'Guiso cremoso de lentejas con ensalada Solterito arequipeño (choclo, queso fresco, habas y aceituna)',
          restaurantHint: 'La Huerta Orgánica',
          calories: 650,
          proteinGrams: 32,
          carbsGrams: 84,
          fatGrams: 18,
          priceSol: 28,
          matchScore: 99,
          recommendationReason: 'Combinación de legumbre y maíz andino que aporta el perfil de aminoácidos completo.',
          highlightBadges: ['Proteína Vegetal', 'Hierro no hemínico', 'Cultura Culinaria']
        },
        {
          mealType: 'Merienda',
          time: '16:45',
          title: 'Snack Crocante de Frutos Secos',
          dishName: 'Mix de nueces del Brasil, pecanas y chips de manzana deshidratada con infusión de muña',
          restaurantHint: 'Tostaduría Andina',
          calories: 220,
          proteinGrams: 8,
          carbsGrams: 18,
          fatGrams: 14,
          priceSol: 14,
          matchScore: 95,
          recommendationReason: 'Selenio y magnesio natural para reducir el estrés vespertino.',
          highlightBadges: ['Selenio Natural', 'Saciedad', 'Digestivo']
        },
        {
          mealType: 'Cena',
          time: '20:00',
          title: 'Cena Chaufa de Quinua & Tofu Salteado',
          dishName: 'Chaufa de tres quinuas salteadas al wok con tofu marinado, pimientos y cebollita china',
          restaurantHint: 'Chifa Vegano Fusión',
          calories: 490,
          proteinGrams: 26,
          carbsGrams: 58,
          fatGrams: 16,
          priceSol: 30,
          matchScore: 96,
          recommendationReason: 'Sabor chifa clásico sin grasas saturadas animales, muy saciante y reconfortante.',
          highlightBadges: ['Wok Saludable', 'Quinua Tricolor', '0 Colesterol']
        }
      ],
      tips: [
        'Añade unas gotas de limón sobre las lentejas para multiplicar la absorción de hierro vegetal.',
        'La infusión de muña después de la merienda es excelente para el confort gástrico.',
        'Las nueces del Brasil cubren el 100% del requerimiento diario de selenio.'
      ]
    },
    keto: {
      label: 'Keto / Cetogénica Controlada',
      summary: 'Alto porcentaje de grasas saludables, moderada proteína y carbohidratos netos minimizados (< 30g al día) para cetosis estable.',
      meals: [
        {
          mealType: 'Desayuno',
          time: '08:30',
          title: 'Omelette Keto con Queso Andino',
          dishName: 'Tortilla de 3 huevos de campo con espinaca baby, queso paria derretido y aguacate hass',
          restaurantHint: 'Brunch & Keto Spot',
          calories: 480,
          proteinGrams: 28,
          carbsGrams: 6,
          fatGrams: 38,
          priceSol: 22,
          matchScore: 98,
          recommendationReason: 'Cero harinas, alta saciedad matutina y energía cetogénica estable.',
          highlightBadges: ['< 4g Carbs Netos', 'Grasas Buenas', 'Keto Approved']
        },
        {
          mealType: 'Almuerzo',
          time: '13:30',
          title: 'Tiradito al Ají Amarillo & Chicharrón de Pescado',
          dishName: 'Tiradito de corvina en crema de ají amarillo con trozos crocantes de panceta y ensalada de hojas amargas',
          restaurantHint: 'Cevichería Puerto Madero',
          calories: 680,
          proteinGrams: 46,
          carbsGrams: 8,
          fatGrams: 48,
          priceSol: 42,
          matchScore: 95,
          recommendationReason: 'Pescado fresco marinado con acidez cítrica y proteína sin guarniciones almidonadas.',
          highlightBadges: ['Rico en Omega 3', 'Keto Gourmet', 'Sin Azúcar']
        },
        {
          mealType: 'Merienda',
          time: '17:00',
          title: 'Café Bomba & Macadamias',
          dishName: 'Café expreso con aceite MCT y puñado de almendras tostadas con sal marina',
          restaurantHint: 'Especialidad Café Bar',
          calories: 210,
          proteinGrams: 5,
          carbsGrams: 3,
          fatGrams: 20,
          priceSol: 15,
          matchScore: 94,
          recommendationReason: 'Claridad mental y supresión del apetito entre comidas.',
          highlightBadges: ['MCT Oil', 'Cero Glucosa', 'Energía Rápida']
        },
        {
          mealType: 'Cena',
          time: '20:30',
          title: 'Pollo al Horno con Crema de Huacatay & Espárragos',
          dishName: 'Muslo de pollo a la brasa estilo gourmet con crema de huacatay keto y espárragos grillados',
          restaurantHint: 'El Rincón Gourmet',
          calories: 540,
          proteinGrams: 44,
          carbsGrams: 7,
          fatGrams: 36,
          priceSol: 32,
          matchScore: 97,
          recommendationReason: 'Plato cálido y reconfortante con excelente perfil lipídico nocturno.',
          highlightBadges: ['Rico en Grasa Sana', 'Espárragos Verdes', 'Sabor Brasa']
        }
      ],
      tips: [
        'Mantén un aporte adecuado de sales y electrolitos (sodio, magnesio) en dieta keto.',
        'Evita bebidas azucaradas o chicha con azúcar; opta por infusiones o agua pura.',
        'La palta aporta potasio esencial para evitar calambres.'
      ]
    },
    balanceada: {
      label: 'Criolla Equilibrada & Saludable',
      summary: 'Equilibrio perfecto entre la tradición del recetario peruano y la densidad nutricional recomendada para el día a día.',
      meals: [
        {
          mealType: 'Desayuno',
          time: '08:00',
          title: 'Desayuno Criollo Balanceado',
          dishName: 'Pan campesino con palta fuerte, huevo pochado y jugo natural de maracuyá sin azúcar',
          restaurantHint: 'Panadería Artesanal del Valle',
          calories: 430,
          proteinGrams: 20,
          carbsGrams: 48,
          fatGrams: 18,
          priceSol: 19,
          matchScore: 96,
          recommendationReason: 'Carbohidratos complejos de absorción lenta y grasas cardiosaludables.',
          highlightBadges: ['Palta Fuerte', 'Vitamina C', 'Sin Harinas Refinadas']
        },
        {
          mealType: 'Almuerzo',
          time: '13:00',
          title: 'Almuerzo Ají de Gallina Fit',
          dishName: 'Ají de gallina con pechuga deshilachada, leche evaporada light, nueces molidas, arroz jazmín y huevo duro',
          restaurantHint: 'Don Alfredo Restaurante',
          calories: 680,
          proteinGrams: 44,
          carbsGrams: 66,
          fatGrams: 22,
          priceSol: 32,
          matchScore: 98,
          recommendationReason: 'Receta criolla clásica adaptada con corte magro y crema aligerada sin perder sabor.',
          highlightBadges: ['Pechuga Magra', 'Tradición Peruana', 'Balance Óptimo']
        },
        {
          mealType: 'Merienda',
          time: '16:30',
          title: 'Merienda de Fruta & Chicha Morada',
          dishName: 'Vaso de chicha morada natural hervida con canela y clavo, acompañado de rodajas de manzana y nueces',
          restaurantHint: 'Juguería El Manantial',
          calories: 210,
          proteinGrams: 6,
          carbsGrams: 34,
          fatGrams: 7,
          priceSol: 12,
          matchScore: 95,
          recommendationReason: 'Antocianinas de maíz morado con efecto antioxidante e hidratante.',
          highlightBadges: ['Maíz Morado', 'Antioxidante', 'Bajo Índice Glucémico']
        },
        {
          mealType: 'Cena',
          time: '20:00',
          title: 'Cena Ligera de Pescado a la Plancha',
          dishName: 'Filete de trucha andina a la plancha con puré de camote y ensalada verde con vinagreta de limón',
          restaurantHint: 'Pescados & Mariscos Del Norte',
          calories: 490,
          proteinGrams: 36,
          carbsGrams: 42,
          fatGrams: 16,
          priceSol: 35,
          matchScore: 97,
          recommendationReason: 'Carotenos del camote y proteína limpia para un descanso reparador.',
          highlightBadges: ['Omega 3', 'Camote Peruano', 'Fácil Digestión']
        }
      ],
      tips: [
        'Acompaña el almuerzo con abundante ensalada verde antes del plato principal.',
        'La chicha morada casera sin azúcar es un tesoro antioxidante nacional.',
        'Cenar al menos 2 horas antes de dormir optimiza el ritmo circadiano.'
      ]
    }
  };

  const selectedDietPlan = plansByDiet[diet] || plansByDiet.balanceada;
  const meals: RecommendedMeal[] = selectedDietPlan.meals.map((m, idx) => ({
    ...m,
    id: `rec-meal-${diet}-${idx + 1}`,
    isSuggestion: true,
    disclaimer,
  }));

  const totalCaloriesCalculated = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinCalculated = meals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const totalCarbsCalculated = meals.reduce((acc, m) => acc + m.carbsGrams, 0);
  const totalFatCalculated = meals.reduce((acc, m) => acc + m.fatGrams, 0);

  return {
    id: `plan-${diet}-${Date.now()}`,
    date: new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }),
    title: `Plan Gastronómico ${selectedDietPlan.label}`,
    summary: selectedDietPlan.summary,
    dietTypeLabel: selectedDietPlan.label,
    totalCalories: totalCaloriesCalculated,
    totalProtein: totalProteinCalculated,
    totalCarbs: totalCarbsCalculated,
    totalFat: totalFatCalculated,
    meals,
    dailyTips: selectedDietPlan.tips,
    aiGenerated: false,
    disclaimer,
  };
}
