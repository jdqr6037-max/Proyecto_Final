# Food Now — Delivery Gastronómico & Planificador Inteligente con IA

Aplicación web full-stack de última generación para la exploración gastronómica, gestión de pedidos en tiempo real y planificación de tareas culinarias con asistencia inteligente de **Google Gemini**.

---

## 📌 Tabla de Contenidos

1. [Propósito del Proyecto](#-propósito-del-proyecto)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Requisitos Previos](#-requisitos-previos)
4. [Variables de Entorno](#-variables-de-entorno)
5. [Instalación y Configuración](#-instalación-y-configuración)
6. [Ejecución en Entorno Local](#-ejecución-en-entorno-local)
7. [Suite de Pruebas Automatizadas](#-suite-de-pruebas-automatizadas)
8. [Compilación y Despliegue en Cloud Run](#-compilación-y-despliegue-en-cloud-run)
9. [Costos, Límites de Cuota y Revocación de la Clave API](#-costos-límites-de-cuota-y-revocación-de-la-clave-api)
10. [Decisiones de Diseño](#-decisiones-de-diseño)
11. [Prompts y Esquemas de IA Utilizados](#-prompts-y-esquemas-de-ia-utilizados)
12. [Seguridad y Buenas Prácticas](#-seguridad-y-buenas-prácticas)

---

## 🎯 Propósito del Proyecto

**Food Now** resuelve de forma integrada la experiencia gastronómica diaria del usuario a través de dos vertientes complementarias:

- **Experiencia de Delivery y Descubrimiento**: Exploración de restaurantes locales con filtro por radio de distancia (km), mapa interactivo, menú de especialidades peruanas e internacionales, carrito de compras, checkout digital y seguimiento de entregas en vivo con telemetría de ruta.
- **Planificador de Tareas Gastronómicas Asistido por IA**: Registro y programación de comidas, almuerzos corporativos y cenas personales. Cada tarea cuenta con enriquecimiento logístico generado en el servidor por **Google Gemini**, proporcionando resúmenes del momento, recomendaciones de preparación y estimación cualitativa de satisfacción.
- **Aislamiento Seguro de Usuarios**: Los usuarios solo pueden ver y gestionar sus propios registros gastronómicos, impidiendo cualquier acceso o alteración indebida de tareas entre diferentes cuentas.

---

## 🏗 Arquitectura del Sistema

El proyecto sigue una arquitectura **Full-Stack desacoplada y segura** (Node.js + Express + Vite + React):

```text
├── server.ts                  # Servidor Express principal y middleware de Vite / producción
├── server/
│   ├── types.ts              # Definiciones TypeScript de entidades (FoodTask, AiExplanationSuggestion)
│   ├── data-access.ts        # Capa de Acceso a Datos (DAL) con validación y aislamiento estricto de usuario
│   └── gemini.ts             # Cliente oficial de Google GenAI SDK con Structured Outputs (JSON Schema)
├── tests/
│   └── tasks-and-gemini.test.ts # Suite de pruebas automatizadas unitarias y de integración (26 tests)
├── data/
│   └── food_tasks.json       # Almacenamiento local persistente con esquema estructurado
├── src/                      # Código fuente del Frontend (React 18 SPA)
│   ├── components/           # Componentes modulares (Navbar, Sidebar, Modales, Tarjetas)
│   ├── views/                # Vistas principales (Tablero, PlanificadorTareasView, Mapa, Pedidos, Cuenta)
│   ├── services/             # Clientes API tipados (taskService.ts)
│   ├── types.ts              # Tipos compartidos en frontend
│   └── App.tsx               # Orquestador visual y enrutamiento interno
├── public/                   # Activos estáticos públicos
├── package.json              # Dependencias y scripts de desarrollo, build y pruebas
└── vite.config.ts            # Configuración de compilación de Vite y Tailwind CSS
```

### Componentes Clave:
1. **Frontend (Cliente)**: SPA desarrollada con **React 18**, **TypeScript** y **Tailwind CSS**. No almacena credenciales sensibles ni interactúa directamente con APIs externas protegidas.
2. **Backend (Servidor Express)**:
   - Actúa como proxy seguro y controlador de negocio en el puerto `3000`.
   - En desarrollo, orquesta Vite mediante `createServer({ server: { middlewareMode: true } })`.
   - En producción, es compilado de forma autocontenida a CommonJS (`dist/server.cjs`) mediante `esbuild`.
3. **Capa de Acceso a Datos (DAL)**:
   - Módulo independiente (`server/data-access.ts`) con funciones controladas: `listTasks`, `getTaskById`, `createTask`, `updateTask`.
   - Aplica validación obligatoria de campos y políticas de autorización por `userId`.
4. **Motor de IA Server-Side**:
   - Integrado mediante `@google/genai` ejecutado estrictamente en Node.js.
   - Utiliza `gemini-3.8-flash` con tipado estricto (`responseMimeType: 'application/json'`).
   - Dispone de generador heurístico de respaldo ante caídas de red o falta temporal de credenciales.

---

## 📋 Requisitos Previos

- **Node.js**: Versión 18.0.0 o superior (recomendado Node.js 20 LTS o 22 LTS).
- **Gestor de paquetes**: `npm` (v9 o superior) o `bun`.
- **Clave de Google Gemini**: Clave gratuita o de producción obtenible en [Google AI Studio](https://aistudio.google.com/).
- **Navegador web moderno**: Chrome, Edge, Safari o Firefox con soporte para ES2022.

---

## 🔐 Variables de Entorno

Copia el archivo de ejemplo `.env.example` para crear tu archivo `.env` local:

```bash
cp .env.example .env
```

### Detalle de Variables:

| Variable | Requerida | Valor por Defecto | Descripción |
| :--- | :---: | :---: | :--- |
| `GEMINI_API_KEY` | **Sí** | *(vacío)* | Clave de API de Google Gemini para generar explicaciones inteligentes en `/api/ai/explain`. Se mantiene exclusivamente en el servidor. |
| `PORT` | No | `3000` | Puerto en el que escucha el servidor Node.js/Express. |
| `NODE_ENV` | No | `development` | Entorno de ejecución (`development` o `production`). |

> ⚠️ **IMPORTANTE DE SEGURIDAD**: Nunca compartas ni hagas commit de tu archivo `.env`. El archivo `.gitignore` ya está configurado para excluirlo automáticamente.

---

## 🚀 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/food-now.git
   cd food-now
   ```

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto y añade tu clave de API:
   ```env
   GEMINI_API_KEY=tu_clave_de_gemini_aqui
   PORT=3000
   NODE_ENV=development
   ```

---

## 💻 Ejecución en Entorno Local

Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor iniciará en:
```text
http://localhost:3000
```

- Las peticiones de la interfaz gráfica y los endpoints REST (`/api/*`) se atenderán de manera unificada en el puerto `3000`.
- El linter de TypeScript puede verificarse en cualquier momento con:
  ```bash
  npm run lint
  ```

---

## 🧪 Suite de Pruebas Automatizadas

El proyecto incluye una suite exhaustiva de **26 pruebas automatizadas** que validan la robustez del backend, la seguridad de la capa de datos y el comportamiento del motor de IA.

### Ejecución de Pruebas por Consola:

```bash
npm test
```

### Grupos de Pruebas Cubiertos:
1. **Validación de Entradas Vacías (Errores 400)**:
   - Rechazo controlado al intentar crear tareas sin título, sin comida o sin hora.
   - Validación y sanitización de espacios en blanco (`trim`).
   - Rechazo controlado de parámetros vacíos en el endpoint de IA `/api/ai/explain`.
2. **Control de Recursos Inexistentes (Errores 404)**:
   - Manejo de excepciones controladas `NotFoundError` al consultar o actualizar tareas con IDs inexistentes.
3. **Aislamiento Estricto de Usuarios (Seguridad 403 Forbidden)**:
   - Verificación de que `user-1` no puede consultar ni editar tareas registradas por `user-2`.
   - Comprobación de que las consultas `listTasks(userId)` filtran estrictamente los registros correspondientes al usuario solicitante.
4. **Persistencia e Identificación de Respuestas de IA**:
   - Confirmación de que las respuestas generadas por Gemini incluyen el atributo `isSuggestion: true` y el descargo legal de responsabilidad.
   - Persistencia correcta de sugerencias vinculadas a tareas existentes.

### Verificador Interactivo en la Interfaz:
También puedes ejecutar las pruebas directamente desde la pantalla **Planificador & IA** de la aplicación web, haciendo clic en el botón **"Ejecutar Pruebas Automatizadas"**, el cual consume el endpoint `/api/tests/run`.

---

## 📦 Compilación y Despliegue en Cloud Run

### 1. Compilación para Producción:

```bash
npm run build
```

Este comando ejecuta dos pasos optimizados:
1. `vite build`: Compila y minifica todos los activos estáticos del frontend en la carpeta `dist/`.
2. `esbuild server.ts`: Empaqueta el servidor Express en un único archivo CommonJS optimizado (`dist/server.cjs`), con sourcemaps y dependencias externas delegadas al runtime de Node.js.

### 2. Inicio del Servidor en Producción:

```bash
npm start
```

### 3. Despliegue en Google Cloud Run:

Un ejemplo de `Dockerfile` listo para producción:

```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY data ./data

EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

#### Comando de Despliegue con gcloud CLI:
```bash
gcloud run deploy food-now \
  --image gcr.io/TU_PROYECTO/food-now:latest \
  --platform managed \
  --region us-central1 \
  --port 3000 \
  --set-env-vars NODE_ENV=production,PORT=3000 \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --allow-unauthenticated
```

---

## 💰 Costos, Límites de Cuota y Revocación de la Clave API

### 1. Modelo de Precios y Nivel Gratuito (Gemini API)
- **Modelo utilizado**: `gemini-3.8-flash`.
- **Nivel Gratuito (Free Tier)**:
  - Google AI Studio ofrece cuota gratuita para desarrollo y prototipado sin costo por token.
  - La cuota gratuita estándar típicamente otorga hasta **15 RPM (Peticiones por Minuto)**, **1,000,000 TPM (Tokens por Minuto)** y **1,500 RPD (Peticiones por Día)**.
- **Nivel de Pago por Uso (Pay-as-you-go)**:
  - Al vincular un proyecto de Google Cloud con facturación, se aplican tarifas por millón de tokens (generalmente las más económicas de la familia Gemini).
  - Consulta los precios actualizados en: [https://ai.google.dev/pricing](https://ai.google.dev/pricing).

### 2. Control de Límites y Resiliencia en la Aplicación
- **Degradación Elegante (Fallback Heurístico)**: Si se excede el límite de tasa (HTTP 429 *Too Many Requests*) o hay una interrupción temporal del servicio (HTTP 503), **Food Now no se detiene ni muestra una pantalla en blanco**. Su motor de respaldo heurístico (`generateHeuristicSuggestion`) genera sugerencias logísticas locales válidas inmediatamente, preservando la experiencia de usuario.
- **Presupuestos y Alertas en Google Cloud**:
  1. Ingresa a la consola de [Google Cloud Billing](https://console.cloud.google.com/billing).
  2. Crea un **Presupuesto con Alerta** (por ejemplo, $5 o $10 USD) para recibir notificaciones por correo antes de incurrir en gastos imprevistos.

### 3. Cómo Revocar o Rotar la Clave de API Inmediatamente
Si sospechas que tu clave ha sido expuesta o deseas deshabilitarla:

1. **En Google AI Studio**:
   - Accede a [Google AI Studio — Get API Key](https://aistudio.google.com/app/apikey).
   - Localiza la clave en la lista de credenciales asociadas a tu proyecto.
   - Haz clic en el ícono de **Papelera / Eliminar (Delete)** para revocar el acceso de inmediato. Las peticiones con esa clave serán rechazadas al instante con error 400/403.
   - Genera una nueva clave con el botón **Create API Key**.
2. **En Google Cloud Console (APIs & Services)**:
   - Dirígete a [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
   - Busca la clave en la sección *API Keys*.
   - Puedes hacer clic en **Delete** o editarla para restringir su uso a la API *Generative Language API* y por direcciones IP específicas.
3. **Actualización en el Entorno**:
   - En local: actualiza el valor de `GEMINI_API_KEY` en tu archivo `.env`.
   - En Cloud Run / Secret Manager: actualiza la versión del secreto en Secret Manager (`gcloud secrets versions add GEMINI_API_KEY --data-file=...`).

---

## 💡 Decisiones de Diseño

### 1. Seguridad de Credenciales y Arquitectura Server-Side
- **Problema**: Exponer claves de API (como `GEMINI_API_KEY`) en el frontend permite que cualquier usuario las extraiga mediante herramientas de desarrollador o inspección de red.
- **Decisión**: La integración con `@google/genai` se realiza **única y exclusivamente en el backend** (`server/gemini.ts`). El frontend sólo consume una ruta REST interna (`/api/ai/explain`) que actúa como barrera de seguridad, validando y sanitizando el tráfico.

### 2. Aislamiento Estricto por Usuario en la Capa DAL
- **Problema**: En sistemas de gestión de tareas o pedidos, las vulnerabilidades de tipo IDOR (*Insecure Direct Object References*) permiten que un usuario acceda o modifique registros ajenos modificando el ID en la petición.
- **Decisión**: La capa de datos (`server/data-access.ts`) exige el parámetro `userId` en cada operación. Antes de cualquier lectura o mutación, valida que el registro pertenezca estrictamente al usuario emisor, lanzando `ForbiddenError` (HTTP 403) si se detecta un intento de intrusión cruzada.

### 3. Ética y Transparencia de la IA: Respuestas como Sugerencias
- **Problema**: Los modelos de lenguaje pueden generar alucinaciones o interpretarse erróneamente como compromisos contractuales de entrega o disponibilidad real de insumos.
- **Decisión**: Toda respuesta devuelta por el servicio de IA se etiqueta formalmente con `isSuggestion: true` y se acompaña de un descargo explícito:
  > *"Sugerencia estimada generada por IA. No constituye una verdad permanente ni un compromiso contractual."*
  Tanto la base de datos como la interfaz visual diferencian de manera visual e inequívoca las sugerencias dinámicas de los datos verificados del restaurante.

### 4. Validación Defensiva Temprana
- **Problema**: Enviar cargas útiles vacías o incompletas al LLM consume cuota innecesaria y produce respuestas impredecibles.
- **Decisión**: Se implementó una capa de validación previa en el servidor que rechaza de inmediato (HTTP 400 `ValidationError`) peticiones sin título, comida u hora, devolviendo retroalimentación clara al usuario antes de invocar la API de Gemini.

### 5. Resiliencia mediante Degradación Elegante (Fallback Heurístico)
- **Problema**: Interrupciones de conectividad o agotamiento temporal de cuota con la API de IA podrían bloquear la funcionalidad del usuario.
- **Decisión**: Si la llamada a Gemini no puede completarse, el sistema activa automáticamente un generador heurístico local con recomendaciones estándar, asegurando que la aplicación continúe funcionando sin interrupciones ni pantallas de error críticas.

---

## 🤖 Prompts y Esquemas de IA Utilizados

Para garantizar que el modelo de lenguaje devuelva datos estructurados, predecibles y libres de texto conversacional irrelevante, se configuró el SDK con las siguientes directivas:

### 1. Instrucción de Sistema (`systemInstruction`):
```text
Eres el asistente gastronómico experto de "Food Now". Generas explicaciones concisas, útiles y optimistas sobre planes de comida, destacando recomendaciones prácticas y tiempos. Todas tus respuestas son sugerencias gastronómicas.
```

### 2. Prompt Dinámico de Generación:
```text
Analiza esta tarea/pedido de comida para el usuario:
Título: "${title}"
Comida/Plato: "${meal}"
Hora programada: "${time}"

Proporciona una explicación gastronómica y logística útil para el usuario.
Debes devolver un JSON estructurado con:
- resumen: Descripción concisa y apetitosa de la combinación y el momento del día.
- proximosPasos: Lista de 2 a 3 pasos recomendados para preparar o recibir el pedido a tiempo.
- nivelDeSatisfaccion: Estimación porcentual y cualitativa del nivel de satisfacción esperado (ej. "Muy Alto (96%)", "Alto (90%)").
```

### 3. Esquema Estructurado JSON (`responseSchema`):
```typescript
{
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
  required: ['resumen', 'proximosPasos', 'nivelDeSatisfaccion']
}
```

---

## 🛡 Seguridad y Buenas Prácticas

- **Sin secretos en el historial de Git**: El repositorio está protegido mediante reglas estrictas en `.gitignore` que previenen la subida accidental de archivos `.env`, certificados o claves privadas.
- **Protección contra inyecciones y desbordes**: Las entradas de texto son saneadas y procesadas mediante tipos TypeScript rigurosos en ambos lados del stack.
- **Control de Acceso Basado en Usuario**: Aislamiento estricto verificado mediante tests automatizados en cada ejecución.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
