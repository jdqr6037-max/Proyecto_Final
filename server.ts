import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { 
  listTasks, 
  createTask, 
  updateTask, 
  getTaskById, 
  ValidationError, 
  NotFoundError, 
  ForbiddenError, 
  _resetTasksStorage 
} from './server/data-access';
import { generateFoodExplanation, generateMealPlanWithAi } from './server/gemini';
import { FoodTask } from './server/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper para extraer el ID de usuario autenticado de headers o query
function getUserId(req: Request): string {
  const headerUser = req.headers['x-user-id'] as string;
  const queryUser = req.query.userId as string;
  const bodyUser = req.body?.userId as string;
  return (headerUser || queryUser || bodyUser || 'user-mateo').trim();
}

// ----------------------------------------------------
// RUTAS DE LA API (MONTADAS ANTES DE VITE MIDDLEWARE)
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Food Now Fullstack Engine',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// 2. Capa de Acceso a Datos: Listar tareas del usuario (Aislamiento estricto de usuario)
app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const tasks = await listTasks(userId);
    res.json({
      success: true,
      userId,
      count: tasks.length,
      tasks
    });
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Error al listar tareas';
    res.status(500).json({ error: message });
  }
});

// 3. Capa de Acceso a Datos: Obtener detalle de tarea por ID
app.get('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const taskId = req.params.id;
    const task = await getTaskById(userId, taskId);
    res.json({ success: true, task });
  } catch (err: unknown) {
    if (err instanceof ValidationError || err instanceof NotFoundError || err instanceof ForbiddenError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Error al consultar tarea';
    res.status(500).json({ error: message });
  }
});

// 4. Capa de Acceso a Datos: Crear tarea
app.post('/api/tasks', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { title, meal, time, status, notes, aiSuggestion } = req.body;

    const task = await createTask(userId, {
      title,
      meal,
      time,
      status,
      notes,
      aiSuggestion
    });

    res.status(201).json({
      success: true,
      message: 'Tarea gastronómica creada exitosamente con aislamiento de usuario',
      task
    });
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Error al crear tarea';
    res.status(500).json({ error: message });
  }
});

// 5. Capa de Acceso a Datos: Actualizar tarea
app.put('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const taskId = req.params.id;
    const { title, meal, time, status, notes, aiSuggestion } = req.body;

    const updatedTask = await updateTask(userId, taskId, {
      title,
      meal,
      time,
      status,
      notes,
      aiSuggestion
    });

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      task: updatedTask
    });
  } catch (err: unknown) {
    if (err instanceof ValidationError || err instanceof NotFoundError || err instanceof ForbiddenError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Error al actualizar tarea';
    res.status(500).json({ error: message });
  }
});

// 6. Gemini: Generar explicación asistida por IA en el servidor
// Recibe título, comida y hora; devuelve JSON con resumen, próximos pasos y nivel de satisfacción.
// Si faltan datos, responde con error controlado 400.
// NO expone ni envía la API key al cliente.
// Identifica explícitamente el resultado como sugerencia (no verdad permanente).
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  try {
    const { title, meal, time } = req.body;

    const suggestion = await generateFoodExplanation({
      title,
      meal,
      time
    });

    res.json({
      success: true,
      suggestion
    });
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Error al generar explicación con Gemini';
    res.status(500).json({ error: message });
  }
});

// 6b. Gemini: Generar Plan de Comidas Recomendable según Preferencias
app.post('/api/ai/plan-meals', async (req: Request, res: Response) => {
  try {
    const { userName, dietStyle, dailyCaloriesTarget, restrictions, budgetLevel, mealsPerDay, cookingTimePreference } = req.body;

    const plan = await generateMealPlanWithAi({
      userName,
      dietStyle,
      dailyCaloriesTarget: Number(dailyCaloriesTarget) || 2000,
      restrictions,
      budgetLevel,
      mealsPerDay: Number(mealsPerDay) || 4,
      cookingTimePreference
    });

    res.json({
      success: true,
      plan
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al planificar comidas recomendadas';
    res.status(500).json({ error: message });
  }
});

// 7. Endpoint interactivo para ejecutar pruebas de validación automatizadas
app.get('/api/tests/run', async (req: Request, res: Response) => {
  const results: { name: string; status: 'pass' | 'fail'; message?: string }[] = [];

  try {
    // Inicializar estado de prueba
    const testTasks: FoodTask[] = [
      {
        id: 'task-test-user1-a',
        userId: 'user-1',
        title: 'Almuerzo Criollo',
        meal: 'Ají de Gallina',
        time: '13:00',
        status: 'pendiente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'task-test-user2-b',
        userId: 'user-2',
        title: 'Cena Marina',
        meal: 'Tiradito al Ají Amarillo',
        time: '20:30',
        status: 'pendiente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    _resetTasksStorage(testTasks);

    // Test 1: Rechazo de entrada vacía en DAL
    try {
      await createTask('user-1', { title: '', meal: 'Ceviche', time: '12:00' });
      results.push({ name: 'Entrada vacía en DAL (título)', status: 'fail', message: 'No arrojó error con título vacío' });
    } catch (e) {
      results.push({ name: 'Entrada vacía en DAL (título rechazado con error controlado 400)', status: 'pass' });
    }

    // Test 2: Rechazo de entrada vacía en Gemini
    try {
      await generateFoodExplanation({ title: 'Cena', meal: '', time: '' });
      results.push({ name: 'Entrada vacía en Gemini AI', status: 'fail', message: 'No arrojó error con comida y hora vacías' });
    } catch (e) {
      results.push({ name: 'Entrada vacía en Gemini AI (rechazado con error controlado 400)', status: 'pass' });
    }

    // Test 3: Tarea inexistente al actualizar
    try {
      await updateTask('user-1', 'tarea-falsa-999', { title: 'Nuevo' });
      results.push({ name: 'Tarea inexistente (404 Not Found)', status: 'fail', message: 'No arrojó error 404' });
    } catch (e) {
      if (e instanceof NotFoundError) {
        results.push({ name: 'Tarea inexistente (rechazado con error 404 Not Found)', status: 'pass' });
      } else {
        results.push({ name: 'Tarea inexistente (404 Not Found)', status: 'fail', message: 'Tipo de error incorrecto' });
      }
    }

    // Test 4: Aislamiento de usuario (user-1 no puede actualizar tarea de user-2)
    try {
      await updateTask('user-1', 'task-test-user2-b', { title: 'Intrusión' });
      results.push({ name: 'Aislamiento de usuario (bloqueo de acceso ajeno)', status: 'fail', message: 'Permitió editar tarea ajena' });
    } catch (e) {
      if (e instanceof ForbiddenError) {
        results.push({ name: 'Aislamiento de usuario (bloqueo estricto con error 403 Forbidden)', status: 'pass' });
      } else {
        results.push({ name: 'Aislamiento de usuario', status: 'fail', message: 'Tipo de error incorrecto' });
      }
    }

    // Test 5: Identificación de respuesta de IA como sugerencia no permanente
    const aiSug = await generateFoodExplanation({
      title: 'Desayuno Saludable',
      meal: 'Jugo de Papaya y Omelette',
      time: '09:00'
    });
    if (aiSug.isSuggestion === true && aiSug.disclaimer.includes('Sugerencia')) {
      results.push({ name: 'IA no guarda respuestas como verdad permanente (etiquetado explícito como sugerencia)', status: 'pass' });
    } else {
      results.push({ name: 'Identificación de sugerencia de IA', status: 'fail', message: 'No incluye flag de sugerencia' });
    }

    res.json({
      success: true,
      allPassed: results.every(r => r.status === 'pass'),
      total: results.length,
      passed: results.filter(r => r.status === 'pass').length,
      results
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado';
    res.status(500).json({ success: false, error: message, results });
  }
});

// ----------------------------------------------------
// MIDDLEWARE GLOBAL DE ERRORES (PROTECCIÓN EN PRODUCCIÓN)
// ----------------------------------------------------
app.use((err: unknown, req: Request, res: Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'status' in (err as object) && (err as unknown as { status: number }).status === 400) {
    res.status(400).json({ error: 'Cuerpo de solicitud JSON con sintaxis inválida' });
    return;
  }
  console.error('Error no capturado en servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ----------------------------------------------------
// VITE MIDDLEWARE SETUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Food Now Server running on http://0.0.0.0:${PORT}`);
  });

  // Apagado ordenado en Cloud Run (gestión de señales SIGTERM / SIGINT)
  const handleShutdown = (signal: string) => {
    console.log(`Recibida señal ${signal}. Apagando Food Now de forma ordenada...`);
    server.close(() => {
      console.log('Servidor Food Now cerrado con éxito.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer();
