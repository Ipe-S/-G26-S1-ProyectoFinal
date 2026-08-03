# CLIENT DATA — Documentación Inicial del Proyecto

---

## 1. Ficha del Cliente

| Campo | Detalle |
|-------|---------|
| **Cliente** | Ilustre Municipalidad de Puente Alto |
| **Región** | Metropolitana de Santiago, Chile |
| **Sector** | Gobierno local — Dirección de Medio Ambiente y Sustentabilidad |
| **Iniciativa** | Aplicación ciudadana para incentivar y gestionar proyectos de huertos domiciliarios (cultivo sustentable) |
| **Nombre del producto** | Sistema SDD — Siembra en tu Hogar |
| **Metodología** | Spec-Driven Development |

### Contextualización

La Municipalidad de Puente Alto, una de las comunas más pobladas de Chile con más de 600.000 habitantes, busca fomentar prácticas de sustentabilidad urbana a nivel domiciliario. Ante la creciente preocupación por la seguridad alimentaria, la huella de carbono y la desconexión de los vecinos con los ciclos naturales de la tierra, la Dirección de Medio Ambiente impulsa esta plataforma digital como herramienta de educación, acompañamiento y vinculación comunitaria en torno al cultivo sustentable en espacios reducidos.

La aplicación busca democratizar el acceso al conocimiento agrícola urbano, permitiendo que cualquier vecino —sin importar su experiencia previa— pueda iniciar y mantener un huerto domiciliario con orientación personalizada según su ubicación, espacio disponible y nivel de conocimiento.

---

## 2. Objetivos Estratégicos

### Visión
Convertir a Puente Alto en una comuna referente en agricultura urbana sustentable, donde cada hogar tenga la posibilidad de cultivar alimentos de manera informada y comunitaria.

### Objetivos

| N.° | Objetivo | Indicador de éxito |
|-----|----------|-------------------|
| OE-1 | Incentivar la creación de huertos domiciliarios en la comuna | Al menos 500 vecinos registrados con un huerto activo en el primer año |
| OE-2 | Proveer orientación técnica accesible y localizada | 100% de los usuarios del flujo "Inicia mi Huerto" reciben recomendaciones basadas en su ubicación real |
| OE-3 | Reducir la barrera de entrada al cultivo urbano | Flujo guiado de 5 pasos desde cero hasta la primera siembra |
| OE-4 | Fomentar la comunidad entre vecinos cultivadores | Funcionalidades de registro y perfil que permitan interacción futura |
| OE-5 | Generar datos municipales sobre agricultura urbana | Dashboard administrativo con métricas de adopción por sector |

---

## 3. Perfiles de Usuario

### 3.1 Vecino Principiante

| Atributo | Descripción |
|----------|-------------|
| **Descripción** | Residente de Puente Alto sin experiencia previa en cultivo. Tiene interés pero no sabe por dónde comenzar. |
| **Motivación** | Cultivar alimentos propios, actividad familiar, ahorro en el hogar. |
| **Necesidades** | Guía paso a paso clara, lenguaje simple, recomendaciones automatizadas según su espacio y ubicación. |
| **Flujo principal** | Registro → Login → "Inicia mi Huerto" (Pasos 1 al 5) |
| **Frustraciones** | Información técnica excesiva, no saber qué plantar según la época, falta de espacio percibida. |

### 3.2 Vecino con Experiencia

| Atributo | Descripción |
|----------|-------------|
| **Descripción** | Residente que ya cultiva en su hogar y busca optimizar, diversificar o compartir conocimiento. |
| **Motivación** | Mejorar rendimiento, probar nuevos cultivos, conectar con otros vecinos. |
| **Necesidades** | Información climática avanzada, acceso a bitácora de cultivos previos, datos históricos. |
| **Flujo principal** | Login → "Inicia mi Huerto" (para nuevo huerto) o consulta directa de guías estacionales |
| **Frustraciones** | Plataformas genéricas que no consideran el microclima local de la comuna. |

---

## 4. Módulo Principal: "Inicia mi Huerto" (Flujo de 5 Pasos)

### Descripción General

El módulo **"Inicia mi Huerto"** es el componente central del MVP. Consiste en un flujo guiado de 5 pasos donde el usuario define progresivamente los parámetros necesarios para crear un pequeño huerto en su hogar. Cada paso recopila información específica y genera recomendaciones personalizadas.

> **Acceso restringido:** Este módulo solo está disponible para usuarios con sesión iniciada en el sistema. Si el usuario no está autenticado, será redirigido al flujo de login/registro.

### Flujo de Acceso

```
Landing Page → Botón "Inicia mi Huerto" → ¿Sesión activa?
  ├─ SÍ → Paso 1
  └─ NO → Login/Registro (Supabase) → Paso 1
```

### Detalle de los 5 Pasos

#### Paso 1 — Ubicación del Huerto

| Campo | Detalle |
|-------|---------|
| **Objetivo** | Determinar la ubicación geográfica del usuario para adaptar las recomendaciones climáticas y estacionales. |
| **Datos recopilados** | Dirección, comuna, sector (autocompletado o selección). |
| **Fuente de datos** | API pública de geolocalización/direcciones (ver sección 5). |
| **Interacción** | El usuario escribe su dirección y el sistema sugiere opciones mediante la API. También puede seleccionar manualmente su sector desde una lista. |
| **Salida** | Coordenadas y sector almacenados en el perfil del huerto. |

#### Paso 2 — Espacio Disponible

| Campo | Detalle |
|-------|---------|
| **Objetivo** | Identificar el tipo y tamaño del espacio que el usuario destinará al huerto. |
| **Datos recopilados** | Tipo de espacio (balcón, patio, terraza, jardín, interior), superficie aproximada en m², orientación solar (norte, sur, este, oeste). |
| **Interacción** | Selección mediante opciones visuales (iconos/cards) y un slider o input numérico para la superficie. |
| **Salida** | Perfil de espacio que determina las recomendaciones de cultivos y contenedores. |

#### Paso 3 — Condiciones Ambientales

| Campo | Detalle |
|-------|---------|
| **Objetivo** | Evaluar las condiciones de luz, agua y suelo disponibles en el espacio del usuario. |
| **Datos recopilados** | Horas de sol directas estimadas, acceso a agua (grifo cercano, riego manual, sistema de riego), tipo de sustrato disponible (tierra natural, necesita comprar, tiene compost). |
| **Interacción** | Preguntas con opciones múltiples y tooltips informativos para cada opción. |
| **Salida** | Índice de condiciones que filtra los cultivos recomendables. |

#### Paso 4 — Selección de Cultivos

| Campo | Detalle |
|-------|---------|
| **Objetivo** | Recomendar y permitir elegir qué cultivar según la ubicación, espacio, condiciones y época del año. |
| **Datos recopilados** | Cultivos seleccionados por el usuario (de una lista recomendada), preferencias alimentarias. |
| **Interacción** | Lista de cultivos recomendados con filtros (por dificultad, tiempo de cosecha, espacio requerido). El usuario selecciona entre 1 y 5 cultivos para su primer huerto. |
| **Lógica** | Las recomendaciones se generan cruzando: ubicación (Paso 1) + espacio (Paso 2) + condiciones (Paso 3) + estación actual. |
| **Salida** | Lista de cultivos elegidos con ficha técnica básica de cada uno. |

#### Paso 5 — Plan de Acción y Confirmación

| Campo | Detalle |
|-------|---------|
| **Objetivo** | Generar un resumen del huerto planificado y un calendario básico de acciones iniciales. |
| **Datos presentados** | Resumen de los pasos anteriores, calendario de siembra y riego para los cultivos elegidos, lista de materiales sugeridos, tips de inicio. |
| **Interacción** | Revisión del plan, opción de editar pasos anteriores, botón de confirmación "Crear mi Huerto". |
| **Salida** | Huerto registrado en la base de datos del usuario. Se almacena en Supabase vinculado a su cuenta. |

### Resumen Visual del Flujo

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PASO 1    │───▶│   PASO 2    │───▶│   PASO 3    │───▶│   PASO 4    │───▶│   PASO 5    │
│  Ubicación  │    │   Espacio   │    │ Condiciones │    │  Cultivos   │    │    Plan     │
│  (API Geo)  │    │ Disponible  │    │ Ambientales │    │ Selección   │    │  de Acción  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 5. API Pública para Ubicación

### Requerimiento

El **Paso 1** del flujo "Inicia mi Huerto" requiere que el usuario ingrese o seleccione su ubicación. Para ello se integrará una API pública de geolocalización o autocompletado de direcciones.

### Opciones Evaluadas

| API | Descripción | Costo | Idoneidad |
|-----|-------------|-------|-----------|
| **Nominatim (OpenStreetMap)** | Geocodificación y búsqueda de direcciones. Datos abiertos, sin clave API para uso moderado. | Gratuita | Alta — cobertura en Chile, sin autenticación compleja |
| Google Places API | Autocompletado de direcciones con alta precisión. | Freemium (requiere billing) | Media — requiere cuenta de pago |
| Mapbox Geocoding | Geocodificación con buenos datos en Latinoamérica. | Freemium | Media — requiere token |

### Decisión

Se utilizará **Nominatim (OpenStreetMap)** como API principal por ser:
- Totalmente gratuita y de datos abiertos.
- Sin necesidad de registro ni clave API para volúmenes bajos.
- Con cobertura adecuada de direcciones en Puente Alto y la Región Metropolitana.
- Coherente con el principio de accesibilidad del proyecto municipal.

**Endpoint base:** `https://nominatim.openstreetmap.org/search`

---

## 6. Sistema de Autenticación

### Requerimiento

Para acceder al módulo "Inicia mi Huerto" (Pasos 1 al 5), el usuario debe tener una cuenta registrada y una sesión activa en el sistema.

### Proveedor: Supabase

| Aspecto | Detalle |
|---------|---------|
| **Servicio** | Supabase Authentication |
| **Método de registro** | Email + contraseña |
| **Almacenamiento** | Base de datos PostgreSQL gestionada por Supabase |
| **Datos del usuario** | Email, nombre, fecha de registro, huertos asociados |
| **Protección de rutas** | Middleware de Next.js que verifica sesión antes de permitir acceso a `/inicia-mi-huerto` |
| **Recuperación** | Flujo de "olvidé mi contraseña" vía email |

### Flujo de Autenticación

```
Usuario no autenticado:
  "Inicia mi Huerto" → Redirect a /login

Página /login:
  ├─ Tiene cuenta → Ingresar email + contraseña → Sesión activa → Redirect a /inicia-mi-huerto
  └─ No tiene cuenta → Link a /registro

Página /registro:
  Formulario (nombre, email, contraseña) → Registro en Supabase → Confirmación → Login automático
```

### Tablas en Supabase (esquema inicial)

```
users (gestionada por Supabase Auth)
├── id (uuid)
├── email
├── created_at
└── user_metadata (nombre)

huertos (tabla personalizada)
├── id (uuid, PK)
├── user_id (uuid, FK → users.id)
├── ubicacion (jsonb: dirección, coordenadas, sector)
├── espacio (jsonb: tipo, superficie, orientación)
├── condiciones (jsonb: sol, agua, sustrato)
├── cultivos (jsonb[]: lista de cultivos seleccionados)
├── plan (jsonb: calendario, materiales)
├── created_at (timestamp)
└── updated_at (timestamp)
```

---

## 7. Tabla Resumen de Requerimientos Funcionales

| ID | Requerimiento | Prioridad | Módulo | Dependencia |
|----|---------------|-----------|--------|-------------|
| RF-01 | Registro de usuario con email y contraseña | Alta | Autenticación | Supabase |
| RF-02 | Inicio de sesión y gestión de sesiones | Alta | Autenticación | Supabase |
| RF-03 | Protección de rutas para usuarios no autenticados | Alta | Autenticación | Middleware Next.js |
| RF-04 | Paso 1: Captura de ubicación mediante API pública | Alta | Inicia mi Huerto | Nominatim API |
| RF-05 | Paso 2: Selección de tipo y tamaño de espacio | Alta | Inicia mi Huerto | — |
| RF-06 | Paso 3: Evaluación de condiciones ambientales | Alta | Inicia mi Huerto | — |
| RF-07 | Paso 4: Recomendación y selección de cultivos | Alta | Inicia mi Huerto | Datos de pasos 1-3 |
| RF-08 | Paso 5: Generación de plan de acción y confirmación | Alta | Inicia mi Huerto | Datos de pasos 1-4 |
| RF-09 | Almacenamiento del huerto creado en base de datos | Alta | Persistencia | Supabase DB |
| RF-10 | Navegación entre pasos (avanzar, retroceder, editar) | Media | Inicia mi Huerto | — |
| RF-11 | Página principal pública con información del proyecto | Media | Landing | — |
| RF-12 | Página 404 y manejo de errores | Baja | Sistema | — |
| RF-13 | Responsive design (móvil, tablet, escritorio) | Alta | Todos | Tailwind CSS |
| RF-14 | Recuperación de contraseña | Media | Autenticación | Supabase |

---

## 8. Consideraciones Técnicas Adicionales

- **Variable de entorno requerida:** `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` para la conexión con Supabase.
- **API de ubicación:** Respetar los límites de uso de Nominatim (máximo 1 request/segundo, incluir User-Agent personalizado).
- **Datos sensibles:** Las credenciales de usuario son gestionadas íntegramente por Supabase Auth; no se almacenan contraseñas en la aplicación.
- **Validaciones:** Todos los formularios del flujo de 5 pasos deben incluir validación client-side y server-side antes de persistir datos.

---

*Documento elaborado por el equipo de producto — Sistema SDD*
*Última actualización: 3 de agosto de 2026*
