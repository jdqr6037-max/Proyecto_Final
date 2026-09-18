import fs from 'fs';
import path from 'path';
import { FoodTask, CreateTaskInput, UpdateTaskInput } from './types';

export class ValidationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

const STORAGE_FILE = path.join(process.cwd(), 'data', 'food_tasks.json');

// In-memory memory-store cached and synced with persistent file
let tasksCache: FoodTask[] | null = null;

function ensureDataDirectory(): void {
  const dir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadTasksFromFile(): FoodTask[] {
  ensureDataDirectory();
  if (!fs.existsSync(STORAGE_FILE)) {
    // Seed with initial realistic user tasks for demo user 'user-mateo'
    const initialTasks: FoodTask[] = [
      {
        id: 'task-seed-1',
        userId: 'user-mateo',
        title: 'Almuerzo de trabajo con el equipo',
        meal: 'Ceviche Clásico y Arroz con Mariscos',
        time: '13:30',
        status: 'en_preparacion',
        notes: 'Coordinado para 4 personas en Miraflores',
        aiSuggestion: {
          isSuggestion: true,
          disclaimer: 'Sugerencia generada por IA. No constituye una verdad permanente ni un compromiso contractual.',
          resumen: 'Almuerzo corporativo fresco de gastronomía marina peruana para 4 comensales.',
          proximosPasos: [
            'Verificar disponibilidad de mesa en La Barra Marina',
            'Confirmar si hay restricciones alimentarias de mariscos en el equipo',
            'Revisar tiempo estimado de entrega de 25 minutos'
          ],
          nivelDeSatisfaccion: 'Muy Alto (95%)',
          generatedAt: new Date().toISOString()
        },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'task-seed-2',
        userId: 'user-mateo',
        title: 'Cena ligera post gimnasio',
        meal: 'Poke Bowl Salmón & Palta Criolla',
        time: '20:15',
        status: 'pendiente',
        notes: 'Bajo en carbohidratos, salsa de ají amarillo aparte',
        aiSuggestion: {
          isSuggestion: true,
          disclaimer: 'Sugerencia generada por IA. No constituye una verdad permanente ni un compromiso contractual.',
          resumen: 'Cena rica en proteínas y grasas saludables ideal para recuperación muscular.',
          proximosPasos: [
            'Programar pedido a las 19:45 para que llegue al terminar entrenamiento',
            'Pedir cubiertos biodegradables'
          ],
          nivelDeSatisfaccion: 'Alto (90%)',
          generatedAt: new Date().toISOString()
        },
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'task-seed-other',
        userId: 'user-valeria',
        title: 'Desayuno corporativo ejecutivo',
        meal: 'Pan con Chicharrón & Café Pasado',
        time: '08:30',
        status: 'pendiente',
        notes: 'Pedido privado de otro usuario para comprobar aislamiento',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(initialTasks, null, 2), 'utf-8');
    return initialTasks;
  }

  try {
    const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
    return JSON.parse(raw) as FoodTask[];
  } catch (err) {
    console.error('Error al leer food_tasks.json:', err);
    return [];
  }
}

function saveTasksToFile(tasks: FoodTask[]): void {
  ensureDataDirectory();
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error al guardar food_tasks.json:', err);
  }
}

function getCache(): FoodTask[] {
  if (tasksCache === null) {
    tasksCache = loadTasksFromFile();
  }
  return tasksCache;
}

/**
 * Capa de Acceso a Datos (DAL): Listar tareas.
 * Valida y restringe estrictamente para que el usuario solo acceda a sus propios registros.
 */
export async function listTasks(userId: string): Promise<FoodTask[]> {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new ValidationError("El parámetro 'userId' es obligatorio para listar tareas.");
  }

  const tasks = getCache();
  // Filtro estricto de propiedad: solo las tareas del usuario
  return tasks.filter(t => t.userId === userId.trim());
}

/**
 * Capa de Acceso a Datos (DAL): Obtener tarea por ID.
 * Valida existencia y pertenencia al usuario.
 */
export async function getTaskById(userId: string, taskId: string): Promise<FoodTask> {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new ValidationError("El parámetro 'userId' es obligatorio.");
  }
  if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
    throw new ValidationError("El parámetro 'taskId' es obligatorio.");
  }

  const tasks = getCache();
  const task = tasks.find(t => t.id === taskId.trim());

  if (!task) {
    throw new NotFoundError(`Tarea con id '${taskId}' no encontrada.`);
  }

  // Validación de seguridad de acceso a datos: solo sus propios registros
  if (task.userId !== userId.trim()) {
    throw new ForbiddenError(`Acceso denegado: No tienes permiso para ver registros de otro usuario.`);
  }

  return task;
}

/**
 * Capa de Acceso a Datos (DAL): Crear tarea.
 * Valida campos requeridos (title, meal, time) y asocia al usuario autenticado.
 */
export async function createTask(userId: string, input: CreateTaskInput): Promise<FoodTask> {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new ValidationError("El parámetro 'userId' es obligatorio para crear una tarea.");
  }

  const trimmedTitle = input?.title?.trim();
  const trimmedMeal = input?.meal?.trim();
  const trimmedTime = input?.time?.trim();

  // Validación de entrada vacía o faltante
  if (!trimmedTitle || !trimmedMeal || !trimmedTime) {
    throw new ValidationError(
      "Faltan datos obligatorios para crear la tarea: 'title' (título), 'meal' (comida) y 'time' (hora) son requeridos y no pueden estar vacíos."
    );
  }

  // Si se incluye una sugerencia de IA, asegurarse de que esté debidamente etiquetada como sugerencia
  let aiSuggestion = input.aiSuggestion || null;
  if (aiSuggestion) {
    aiSuggestion = {
      ...aiSuggestion,
      isSuggestion: true,
      disclaimer: aiSuggestion.disclaimer || 'Sugerencia generada por IA. No constituye una verdad permanente ni un compromiso contractual.'
    };
  }

  const newTask: FoodTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: userId.trim(),
    title: trimmedTitle,
    meal: trimmedMeal,
    time: trimmedTime,
    status: input.status || 'pendiente',
    notes: input.notes?.trim() || '',
    aiSuggestion,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const tasks = getCache();
  tasks.unshift(newTask);
  saveTasksToFile(tasks);

  return newTask;
}

/**
 * Capa de Acceso a Datos (DAL): Actualizar tarea.
 * Valida que la tarea exista y que el usuario solo pueda actualizar sus propios registros.
 */
export async function updateTask(
  userId: string,
  taskId: string,
  input: UpdateTaskInput
): Promise<FoodTask> {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new ValidationError("El parámetro 'userId' es obligatorio para actualizar una tarea.");
  }
  if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
    throw new ValidationError("El parámetro 'taskId' es obligatorio.");
  }

  const tasks = getCache();
  const index = tasks.findIndex(t => t.id === taskId.trim());

  if (index === -1) {
    throw new NotFoundError(`Tarea inexistente: No se encontró ninguna tarea con el id '${taskId}'.`);
  }

  const existingTask = tasks[index];

  // Validación estricta de aislamiento de usuario
  if (existingTask.userId !== userId.trim()) {
    throw new ForbiddenError(
      `Acceso denegado: No puedes actualizar la tarea '${taskId}' porque pertenece a otro usuario.`
    );
  }

  // Si se especifican campos clave, validar que no sean cadenas vacías si se enviaron
  if (input.title !== undefined && input.title.trim() === '') {
    throw new ValidationError("El título ('title') no puede quedar vacío.");
  }
  if (input.meal !== undefined && input.meal.trim() === '') {
    throw new ValidationError("El campo comida ('meal') no puede quedar vacío.");
  }
  if (input.time !== undefined && input.time.trim() === '') {
    throw new ValidationError("El campo hora ('time') no puede quedar vacío.");
  }

  let updatedAiSuggestion = existingTask.aiSuggestion;
  if (input.aiSuggestion !== undefined) {
    if (input.aiSuggestion) {
      updatedAiSuggestion = {
        ...input.aiSuggestion,
        isSuggestion: true,
        disclaimer: input.aiSuggestion.disclaimer || 'Sugerencia generada por IA. No constituye una verdad permanente ni un compromiso contractual.'
      };
    } else {
      updatedAiSuggestion = null;
    }
  }

  const updatedTask: FoodTask = {
    ...existingTask,
    title: input.title !== undefined ? input.title.trim() : existingTask.title,
    meal: input.meal !== undefined ? input.meal.trim() : existingTask.meal,
    time: input.time !== undefined ? input.time.trim() : existingTask.time,
    status: input.status || existingTask.status,
    notes: input.notes !== undefined ? input.notes.trim() : existingTask.notes,
    aiSuggestion: updatedAiSuggestion,
    updatedAt: new Date().toISOString()
  };

  tasks[index] = updatedTask;
  saveTasksToFile(tasks);

  return updatedTask;
}

/**
 * Función auxiliar para reiniciar el almacenamiento en pruebas unitarias
 */
export function _resetTasksStorage(tasks: FoodTask[]): void {
  tasksCache = [...tasks];
  saveTasksToFile(tasksCache);
}
