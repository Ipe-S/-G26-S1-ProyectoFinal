/**
 * Tipos para el catálogo de cultivos y la lógica de matching con datos climáticos.
 */

/** Categoría del cultivo */
export type CropCategory = "hortaliza" | "legumbre" | "vegetal" | "hierba_aromatica" | "frutal_menor";

/** Necesidad hídrica del cultivo */
export type WaterNeed = "baja" | "media" | "alta";

/** Tolerancia a radiación UV */
export type UVTolerance = "baja" | "media" | "alta";

/** Dificultad de cultivo para el usuario */
export type Difficulty = "facil" | "media" | "dificil";

/** Tipo de espacio requerido */
export type SpaceType = "maceta" | "jardinera" | "suelo" | "cualquiera";

/** Meses del año (1-12) */
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Definición completa de un cultivo.
 * Los campos de temperatura se usan para hacer match con la API de Open-Meteo.
 */
export interface Crop {
  /** Identificador único */
  id: string;
  /** Nombre común en español */
  nombre: string;
  /** Nombre científico */
  nombreCientifico: string;
  /** Categoría principal */
  categoria: CropCategory;
  /** Descripción corta */
  descripcion: string;

  // === PARÁMETROS DE MATCHING CON OPEN-METEO ===

  /** Temperatura mínima que tolera sin morir (°C). Match con: temperature_2m_min */
  tempMinTolerada: number;
  /** Inicio del rango óptimo de crecimiento (°C). Match con: promedio temperature_2m */
  tempOptimaMin: number;
  /** Fin del rango óptimo de crecimiento (°C). Match con: promedio temperature_2m */
  tempOptimaMax: number;
  /** Temperatura mínima del suelo para germinación (°C). Match con: soil_temperature_6cm */
  tempSueloGerminacion: number;
  /** Necesidad hídrica. Match con: et0_fao_evapotranspiration + precipitation_sum */
  necesidadHidrica: WaterNeed;
  /** Tolerancia a radiación UV. Match con: uv_index_max */
  toleranciaUV: UVTolerance;

  // === INFORMACIÓN DE CULTIVO ===

  /** Meses recomendados para siembra en zona central de Chile */
  mesesSiembra: Month[];
  /** Días promedio desde siembra hasta cosecha */
  diasCosecha: number;
  /** Profundidad de siembra en cm */
  profundidadSiembra: number;
  /** Distancia entre plantas en cm */
  distanciaEntrePlantas: number;
  /** Horas mínimas de sol directo por día */
  horasSolMinimas: number;
  /** Dificultad de cultivo */
  dificultad: Difficulty;
  /** Tipo de espacio mínimo requerido */
  espacioMinimo: SpaceType;

  // === METADATA ===

  /** Tips de cultivo para el usuario */
  tips: string[];
  /** Plantas compañeras (asociación beneficiosa) */
  companeras: string[];
  /** Plantas incompatibles (no sembrar juntas) */
  incompatibles: string[];
}

/**
 * Resultado del matching de un cultivo con las condiciones climáticas actuales.
 */
export interface CropMatch {
  /** Datos del cultivo */
  crop: Crop;
  /** Puntuación de aptitud (0-100). Mayor = mejor condición para sembrar */
  score: number;
  /** Si es apto para sembrar ahora */
  isApt: boolean;
  /** Si está en época de siembra según el mes actual */
  isInSeason: boolean;
  /** Razones por las que es o no apto */
  reasons: MatchReason[];
  /** Recomendaciones específicas */
  recommendations: string[];
}

/** Razón individual del matching */
export interface MatchReason {
  /** Factor evaluado */
  factor: "temperatura" | "suelo" | "riego" | "uv" | "epoca";
  /** Si el factor es favorable */
  favorable: boolean;
  /** Descripción legible */
  description: string;
}

/** Parámetros climáticos para el matching (extraídos de Open-Meteo) */
export interface ClimateConditions {
  /** Temperatura mínima prevista en los próximos días (°C) */
  tempMin: number;
  /** Temperatura máxima prevista en los próximos días (°C) */
  tempMax: number;
  /** Temperatura promedio actual (°C) */
  tempPromedio: number;
  /** Temperatura del suelo a 6cm (°C) */
  tempSuelo: number;
  /** Evapotranspiración diaria promedio (mm) */
  evapotranspiracion: number;
  /** Precipitación acumulada prevista (mm) */
  precipitacion: number;
  /** Índice UV máximo previsto */
  uvMax: number;
  /** Mes actual (1-12) */
  mesActual: Month;
}
