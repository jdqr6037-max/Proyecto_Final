import { 
  listTasks, 
  createTask, 
  updateTask, 
  getTaskById, 
  ValidationError, 
  NotFoundError, 
  ForbiddenError, 
  _resetTasksStorage 
} from '../server/data-access';
import { generateFoodExplanation } from '../server/gemini';
import { FoodTask } from '../server/types';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASÓ: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FALLÓ: ${testName}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 INICIANDO SUITE DE PRUEBAS: CAPA DE DATOS Y GEMINI');
  console.log('======================================================\n');

  // Inicializar estado de pruebas con datos limpios
  const testTasks: FoodTask[] = [
    {
      id: 'task-test-user1-a',
      userId: 'user-1',
      title: 'Almuerzo Criollo',
      meal: 'Ají de Gallina',
      time: '13:00',
      status: 'pendiente',
      notes: 'Sin aceituna',
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
      notes: 'Para compartir',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  _resetTasksStorage(testTasks);

  // ----------------------------------------------------
  // PRUEBA 1: Validación de entrada vacía al crear tarea
  // ----------------------------------------------------
  console.log('📋 [GRUPO 1] Pruebas de Entrada Vacía (Validaciones Controladas)');

  try {
    await createTask('user-1', { title: '', meal: 'Ceviche', time: '12:00' });
    assert(false, 'Debería rechazar título vacío al crear tarea');
  } catch (err) {
    assert(err instanceof ValidationError, 'Rechaza con ValidationError cuando el título está vacío');
    assert((err as Error).message.includes('Faltan datos obligatorios'), 'Mensaje de error descriptivo para título vacío');
  }

  try {
    await createTask('user-1', { title: 'Almuerzo', meal: '   ', time: '12:00' });
    assert(false, 'Debería rechazar comida (meal) vacía');
  } catch (err) {
    assert(err instanceof ValidationError, 'Rechaza con ValidationError cuando comida (meal) son solo espacios');
  }

  try {
    await createTask('user-1', { title: 'Almuerzo', meal: 'Seco de Res', time: '' });
    assert(false, 'Debería rechazar hora vacía');
  } catch (err) {
    assert(err instanceof ValidationError, 'Rechaza con ValidationError cuando la hora está vacía');
  }

  try {
    // Probando entrada vacía al servicio Gemini AI
    await generateFoodExplanation({ title: '', meal: 'Lomo Saltado', time: '14:00' });
    assert(false, 'Debería rechazar generación de explicación con título vacío');
  } catch (err) {
    assert(err instanceof ValidationError, 'Gemini rechaza con ValidationError controlado si falta el título');
  }

  try {
    // Probando hora vacía en Gemini AI
    await generateFoodExplanation({ title: 'Cena', meal: '', time: '' });
    assert(false, 'Debería rechazar generación de explicación si faltan comida y hora');
  } catch (err) {
    assert(err instanceof ValidationError, 'Gemini rechaza con ValidationError controlado si falta comida y hora');
  }

  // ----------------------------------------------------
  // PRUEBA 2: Validación de tarea inexistente (404)
  // ----------------------------------------------------
  console.log('\n📋 [GRUPO 2] Pruebas de Tarea Inexistente (Error 404)');

  try {
    await updateTask('user-1', 'tarea-que-no-existe-999', { title: 'Nuevo Título' });
    assert(false, 'Debería fallar al intentar actualizar una tarea inexistente');
  } catch (err) {
    assert(err instanceof NotFoundError, 'Actualizar tarea inexistente lanza NotFoundError');
    assert((err as Error).message.includes('Tarea inexistente'), 'Mensaje indica claramente que la tarea es inexistente');
  }

  try {
    await getTaskById('user-1', 'id-inexistente-xyz');
    assert(false, 'Debería fallar al consultar tarea inexistente');
  } catch (err) {
    assert(err instanceof NotFoundError, 'Consultar tarea inexistente lanza NotFoundError');
  }

  // ----------------------------------------------------
  // PRUEBA 3: Validación de Aislamiento de Usuario (Seguridad)
  // ----------------------------------------------------
  console.log('\n📋 [GRUPO 3] Pruebas de Aislamiento de Usuario (Solo sus propios registros)');

  // user-1 intenta actualizar la tarea de user-2
  try {
    await updateTask('user-1', 'task-test-user2-b', { title: 'Intrusión no permitida' });
    assert(false, 'Debería bloquear actualización de tarea de otro usuario');
  } catch (err) {
    assert(err instanceof ForbiddenError, 'Lanza ForbiddenError al intentar modificar tarea de otro usuario');
  }

  // user-1 intenta obtener la tarea de user-2
  try {
    await getTaskById('user-1', 'task-test-user2-b');
    assert(false, 'Debería bloquear lectura de tarea de otro usuario');
  } catch (err) {
    assert(err instanceof ForbiddenError, 'Lanza ForbiddenError al consultar tarea privada ajena');
  }

  // Listar tareas para user-1 solo debe traer las de user-1
  const user1Tasks = await listTasks('user-1');
  assert(user1Tasks.length === 1, 'user-1 solo ve 1 tarea en su listado');
  assert(user1Tasks.every(t => t.userId === 'user-1'), 'Todas las tareas listadas pertenecen estrictamente a user-1');

  // Listar tareas para user-2 solo debe traer las de user-2
  const user2Tasks = await listTasks('user-2');
  assert(user2Tasks.length === 1, 'user-2 solo ve 1 tarea en su listado');
  assert(user2Tasks[0].id === 'task-test-user2-b', 'La tarea listada corresponde a user-2');

  // ----------------------------------------------------
  // PRUEBA 4: Creación exitosa y etiquetado como SUGERENCIA de IA
  // ----------------------------------------------------
  console.log('\n📋 [GRUPO 4] Pruebas de Sugerencia de IA y Persistencia');

  const aiResult = await generateFoodExplanation({
    title: 'Cena con Amigos',
    meal: 'Anticuchos con Choclo y Papas Doradas',
    time: '21:00'
  });

  assert(aiResult.isSuggestion === true, 'El resultado de IA contiene isSuggestion: true');
  assert(typeof aiResult.resumen === 'string' && aiResult.resumen.length > 0, 'Contiene campo resumen');
  assert(Array.isArray(aiResult.proximosPasos) && aiResult.proximosPasos.length > 0, 'Contiene próximos pasos');
  assert(typeof aiResult.nivelDeSatisfaccion === 'string', 'Contiene nivel de satisfacción');
  assert(aiResult.disclaimer.includes('Sugerencia'), 'Contiene disclaimer explícito de sugerencia no vinculante');

  // Crear tarea con la sugerencia de IA
  const createdTask = await createTask('user-1', {
    title: 'Cena con Amigos',
    meal: 'Anticuchos con Choclo y Papas Doradas',
    time: '21:00',
    notes: 'Pedir salsa de rocoto aparte',
    aiSuggestion: aiResult
  });

  assert(createdTask.id.startsWith('task-'), 'Tarea creada con ID único');
  assert(createdTask.aiSuggestion?.isSuggestion === true, 'Tarea persiste la sugerencia explícitamente marcada como sugerencia');
  assert(createdTask.userId === 'user-1', 'Tarea asignada correctamente a user-1');

  // Actualizar la tarea recién creada
  const updated = await updateTask('user-1', createdTask.id, {
    status: 'en_preparacion',
    notes: 'Confirmado con la carretilla'
  });

  assert(updated.status === 'en_preparacion', 'Estado actualizado a en_preparacion');
  assert(updated.notes === 'Confirmado con la carretilla', 'Notas actualizadas');
  assert(updated.aiSuggestion?.isSuggestion === true, 'Mantiene la identificación de sugerencia intacta tras actualización');

  console.log('\n======================================================');
  console.log(`📊 RESULTADOS TOTALES: ${passedTests}/${totalTests} pruebas pasadas (${failedTests} fallos).`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

// Ejecutar cuando se llama directamente
runTests().catch((err) => {
  console.error('Error fatal al ejecutar pruebas:', err);
  process.exit(1);
});
