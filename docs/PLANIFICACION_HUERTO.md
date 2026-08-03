# Componente: Planificación de Huerto — "Inicia mi Huerto" (5 Pasos)

## Descripción General

Componente wizard de 5 pasos que guía al usuario en la planificación completa de su huerto domiciliario. Cada paso recopila información progresiva y al final genera un plan de acción operativo personalizado.

**Ruta:** `/inicia-mi-huerto`  
**Acceso:** Solo usuarios autenticados (requiere sesión activa en Supabase)  
**API principal:** Open-Meteo Geocoding + Open-Meteo Forecast  

---

## Flujo Visual

```
[Paso 1] ───→ [Paso 2] ───→ [Paso 3] ───→ [Paso 4] ───→ [Paso 5]
Ubicación     Espacio       Condiciones   Cultivos      Plan Final
 y Clima       y Suelo      Ambientales   (Matching)    (Resultado)
```

---

## Paso 1: Ubicación y Clima

### Funcionalidad Principal
Autocompletado de Comuna/Ciudad consultando la API pública de **Open-Meteo Geocoding**.

### Endpoint de Geocodificación
```
https://geocoding-api.open-meteo.com/v1/search?name={termino}&count=5&language=es&format=json
```

### Datos Clave Obtenidos
- Latitud y longitud
- Zona climática estimada
- Temperatura media de temporada
- Estimación de riesgo de heladas

### Mecanismo de Fallback (Modo Manual)
Si la consulta a la API falla o el usuario prefiere ingresar manualmente, se debe habilitar un formulario manual para escribir `comuna`, `ciudad` y seleccionar la región/zona climática.

### Resultado del paso
```typescript
{
  direccion: string;
  comuna: string;
  latitud: number;
  longitud: number;
  zonaClimatica: string;
  tempMediaTemporada: number;
  riesgoHeladas: boolean;
  modoIngreso: "api" | "manual";
}
```

---

## Paso 2: Espacio Disponible y Estructura del Terreno

### Campos

| Campo | Tipo de Input | Opciones |
|-------|---------------|----------|
| **Tipo de Suelo** | Selector | `arcilloso`, `arenoso`, `franco`, `maceta_sustrato` |
| **Superficie Disponible** | Input numérico o deslizador | Valor en m² |
| **Orientación Solar** | Selector visual | `norte`, `sur`, `oriente`, `poniente` |

### Lógica
- El tipo de suelo influye en qué cultivos son viables (ej: zanahoria necesita suelo suelto, no arcilloso)
- La superficie define cuántos cultivos caben y si aplican hortalizas de expansión horizontal
- La orientación estima la cantidad de sol recibida según la época del año

### Resultado del paso
```typescript
{
  tipoSuelo: "arcilloso" | "arenoso" | "franco" | "maceta_sustrato";
  superficie: number; // m²
  orientacion: "norte" | "sur" | "oriente" | "poniente";
}
```

---

## Paso 3: Condiciones Ambientales

### Campos

| Campo | Tipo de Input | Opciones |
|-------|---------------|----------|
| **Exposición Solar** | Radio buttons | `< 3 horas` (sombra_parcial), `3 a 6 horas` (sol_medio), `> 6 horas` (sol_pleno) |
| **Disponibilidad y Tipo de Riego** | Selector | `manual` (regadera/manguera), `goteo` (sistema automatizado), `secano` |
| **Drenaje del Sustrato** | Selector | `alto`, `medio`, `bajo` |

### Lógica
- Las horas de sol filtran cultivos por `horasSolMinimas` del catálogo
- El tipo de riego determina qué nivel de `necesidadHidrica` es sostenible
- El drenaje afecta la viabilidad de cultivos sensibles al encharcamiento

### Resultado del paso
```typescript
{
  exposicionSolar: "sombra_parcial" | "sol_medio" | "sol_pleno";
  horasSolEstimadas: number; // 2, 4.5, 7 según selección
  tipoRiego: "manual" | "goteo" | "secano";
  drenaje: "alto" | "medio" | "bajo";
}
```

---

## Paso 4: Selección de Cultivos (Motor de Matching)

### Filtrado por Categorías

| Categoría | Descripción | Ejemplos |
|-----------|-------------|----------|
| `huerta` | Hierbas aromáticas, medicinales, frutos de huerta tradicional | Albahaca, romero, tomate cherry, frutilla |
| `vegetales` | Hortalizas de hoja, raíz y fruto | Lechuga, zanahoria, zapallo, espinaca |
| `legumbres` | Legumbres, cultivos de fijación de nitrógeno | Poroto, arveja, haba, lenteja, garbanzo |

### Algoritmo de Compatibilidad (Score 0% a 100%)

Cada cultivo del catálogo cuenta con requerimientos óptimos. Se calcula un **porcentaje de compatibilidad** comparando los parámetros de los Pasos 1, 2 y 3 con la ficha técnica de la planta:

| Factor | Peso | Parámetros cruzados |
|--------|------|---------------------|
| Temperatura (clima actual) | 25% | Paso 1 (lat/lon → Open-Meteo) vs. `tempOptimaMin/Max` del cultivo |
| Tipo de suelo | 20% | Paso 2 (`tipoSuelo`) vs. requerimiento del cultivo |
| Exposición solar | 20% | Paso 3 (`horasSolEstimadas`) vs. `horasSolMinimas` del cultivo |
| Drenaje | 15% | Paso 3 (`drenaje`) vs. tolerancia del cultivo |
| Riego disponible | 10% | Paso 3 (`tipoRiego`) vs. `necesidadHidrica` del cultivo |
| Época de siembra | 10% | Mes actual vs. `mesesSiembra` del cultivo |

### Visualización
- Se muestran primero las plantas con compatibilidad **≥ 70%**
- Cada cultivo se presenta como una tarjeta con:
  - Nombre + descripción breve
  - Badge de porcentaje de compatibilidad (verde ≥70%, amarillo 50-69%, rojo <50%)
  - Días hasta cosecha
  - Dificultad
- El usuario selecciona entre **1 y 5 cultivos**

### Resultado del paso
```typescript
{
  cultivosSeleccionados: Array<{
    id: string;
    nombre: string;
    compatibilidad: number; // 0-100
  }>;
  categoriaFiltrada: "huerta" | "vegetales" | "legumbres" | "todas";
}
```

---

## Paso 5: Resultado Final (Plan de Acción Operativo)

### Contenido Generado

#### 1. Calendario de Siembra y Cosecha
Cronograma mensual indicando:
- Semanas de almácigo
- Fecha estimada de trasplante
- Periodo de cosecha esperada

#### 2. Lista Consolidada de Materiales
Según los m² y cultivos elegidos:
- Herramientas necesarias
- Kilos/litros de sustrato
- Fertilizantes recomendados
- Insumos varios (tutores, malla, etc.)

#### 3. Recomendaciones Agronómicas
- Asociaciones beneficiosas (ej: tomate + albahaca)
- Manejo de plagas comunes
- Frecuencia de riego sugerida
- Advertencias según clima (heladas, UV alto)

#### 4. Condiciones Climáticas Actuales
- Temperatura actual y pronóstico (Open-Meteo)
- Insights del módulo `gardeningInsights`

### Acciones Disponibles
- **"Guardar mi huerto"** → Persiste el plan en Supabase (tabla `huertos`)
- **"Editar"** → Volver a cualquier paso anterior sin perder datos
- **"Descargar plan"** (futuro) → Exportar a PDF

---

## 2. Estructura de Archivos (8 Componentes)

```text
src/
└── componentes/
    └── planifica-huerto/
        ├── ContenedorWizardHuerto.tsx        # Shell principal: gestiona estado global y navegación entre pasos
        ├── BarraProgresoPasos.tsx            # Indicador visual de los 5 pasos (completado/activo/pendiente)
        ├── PasoUbicacionClima.tsx            # Paso 1: Autocompletado Open-Meteo Geocoding + fallback manual
        ├── PasoEspacioSuelo.tsx              # Paso 2: Superficie (m²), tipo de suelo y orientación solar
        ├── PasoCondicionesAmbientales.tsx    # Paso 3: Horas de sol, tipo de riego y drenaje
        ├── PasoSeleccionCultivos.tsx         # Paso 4: Catálogo filtrable + motor visual de compatibilidad
        ├── TarjetaCultivoRecomendado.tsx     # Tarjeta individual con % compatibilidad y badge de estado
        └── PasoPlanAccion.tsx                # Paso 5: Calendario, lista insumos, recomendaciones y guardado
```

### Responsabilidades por Componente

| Componente | Responsabilidad |
|------------|-----------------|
| **ContenedorWizardHuerto** | Maneja el estado global del wizard (`currentStep`, `data`). Controla navegación (siguiente/anterior). Valida que cada paso esté completo antes de avanzar. |
| **BarraProgresoPasos** | Renderiza los 5 pasos como indicador visual. Muestra estados: completado (✓), activo (●), pendiente (○). Permite click para navegar a pasos completados. |
| **PasoUbicacionClima** | Input con debounce que consulta Geocoding API. Muestra sugerencias en dropdown. Al seleccionar, guarda coordenadas. Incluye toggle para modo manual. |
| **PasoEspacioSuelo** | Tres selectores visuales (cards con iconos). Slider para superficie. Muestra preview de lo seleccionado. |
| **PasoCondicionesAmbientales** | Formulario con radio buttons y selectores. Tooltips explicativos en cada opción. |
| **PasoSeleccionCultivos** | Consulta `/api/cultivos` con coordenadas del Paso 1. Aplica filtros de Pasos 2 y 3. Renderiza grid de `TarjetaCultivoRecomendado`. Permite seleccionar 1-5 cultivos. |
| **TarjetaCultivoRecomendado** | Muestra: nombre, categoría, % compatibilidad (badge color), días cosecha, dificultad, checkbox de selección. |
| **PasoPlanAccion** | Genera resumen completo. Muestra calendario visual. Lista materiales. Botón "Guardar" que persiste en Supabase. |

---

## 3. Estado Global del Wizard

```typescript
interface HuertoWizardState {
  currentStep: 1 | 2 | 3 | 4 | 5;
  data: {
    // Paso 1 - Ubicación y Clima
    direccion: string;
    comuna: string;
    latitud: number | null;
    longitud: number | null;
    zonaClimatica: string;
    tempMediaTemporada: number | null;
    riesgoHeladas: boolean;
    modoIngreso: "api" | "manual";

    // Paso 2 - Espacio y Suelo
    tipoSuelo: "arcilloso" | "arenoso" | "franco" | "maceta_sustrato" | null;
    superficie: number | null;
    orientacion: "norte" | "sur" | "oriente" | "poniente" | null;

    // Paso 3 - Condiciones Ambientales
    exposicionSolar: "sombra_parcial" | "sol_medio" | "sol_pleno" | null;
    tipoRiego: "manual" | "goteo" | "secano" | null;
    drenaje: "alto" | "medio" | "bajo" | null;

    // Paso 4 - Cultivos
    cultivosSeleccionados: Array<{
      id: string;
      nombre: string;
      compatibilidad: number;
    }>;

    // Paso 5 - Plan
    planGenerado: boolean;
    planGuardado: boolean;
  };
}
```

---

## 4. Protección de Ruta

La página `/inicia-mi-huerto` requiere sesión activa en Supabase:
- Si el usuario **no está autenticado** → Redirect a `/login`
- Después del login exitoso → Redirect de vuelta a `/inicia-mi-huerto`
- Implementar via middleware de Next.js o verificación en el Server Component de la página

---

## 5. Dependencias Técnicas

| Dependencia | Uso | Paso |
|-------------|-----|------|
| Open-Meteo Geocoding API | Autocompletado de ubicación | Paso 1 |
| Open-Meteo Forecast API | Datos climáticos para matching | Paso 4 |
| Módulo `crop-matching.ts` | Algoritmo de compatibilidad | Paso 4 |
| Catálogo `crops.ts` | Base de datos de 35 cultivos | Paso 4 |
| Supabase Auth | Protección de ruta | Todos |
| Supabase Database | Guardado del plan | Paso 5 |

---

## 6. Tareas de Implementación

- [ ] Crear tipos en `src/types/huerto.ts`
- [ ] Crear `BarraProgresoPasos.tsx` (indicador visual de pasos)
- [ ] Crear `ContenedorWizardHuerto.tsx` (estado global y navegación)
- [ ] Crear `PasoUbicacionClima.tsx` (integración Open-Meteo Geocoding + fallback)
- [ ] Crear `PasoEspacioSuelo.tsx` (tipo suelo, superficie, orientación)
- [ ] Crear `PasoCondicionesAmbientales.tsx` (sol, riego, drenaje)
- [ ] Crear `PasoSeleccionCultivos.tsx` (matching + filtros)
- [ ] Crear `TarjetaCultivoRecomendado.tsx` (card individual de cultivo)
- [ ] Crear `PasoPlanAccion.tsx` (resultado final + guardado)
- [ ] Crear página `/inicia-mi-huerto/page.tsx` (protegida con auth)
- [ ] Integrar guardado en Supabase (tabla `huertos`)
- [ ] Agregar link "Inicia mi huerto" al Navbar (solo visible con sesión activa)

---

*Última actualización: 3 de agosto de 2026*
