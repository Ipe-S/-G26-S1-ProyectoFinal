/**
 * Tipos para el wizard de planificación de huerto (5 pasos).
 */

// ══════════════════════════════════════════
// ENUMS Y TIPOS BASE
// ══════════════════════════════════════════

export type TipoSuelo = "arcilloso" | "arenoso" | "franco" | "maceta_sustrato";
export type Orientacion = "norte" | "sur" | "oriente" | "poniente";
export type ExposicionSolar = "sombra_parcial" | "sol_medio" | "sol_pleno";
export type TipoRiego = "manual" | "goteo" | "secano";
export type Drenaje = "alto" | "medio" | "bajo";
export type ModoIngreso = "api" | "manual";
export type CategoriaFiltro = "huerta" | "vegetales" | "legumbres" | "todas";
export type WizardStep = 1 | 2 | 3 | 4 | 5;

// ══════════════════════════════════════════
// DATOS POR PASO
// ══════════════════════════════════════════

/** Paso 1: Ubicación y Clima */
export interface DatosPaso1 {
  direccion: string;
  comuna: string;
  latitud: number | null;
  longitud: number | null;
  zonaClimatica: string;
  tempMediaTemporada: number | null;
  riesgoHeladas: boolean;
  modoIngreso: ModoIngreso;
}

/** Paso 2: Espacio Disponible y Estructura del Terreno */
export interface DatosPaso2 {
  tipoSuelo: TipoSuelo | null;
  superficie: number | null;
  orientacion: Orientacion | null;
}

/** Paso 3: Condiciones Ambientales */
export interface DatosPaso3 {
  exposicionSolar: ExposicionSolar | null;
  horasSolEstimadas: number | null;
  tipoRiego: TipoRiego | null;
  drenaje: Drenaje | null;
}

/** Paso 4: Selección de Cultivos */
export interface CultivoSeleccionado {
  id: string;
  nombre: string;
  compatibilidad: number;
}

export interface DatosPaso4 {
  cultivosSeleccionados: CultivoSeleccionado[];
  categoriaFiltrada: CategoriaFiltro;
}

/** Paso 5: Plan de Acción */
export interface DatosPaso5 {
  planGenerado: boolean;
  planGuardado: boolean;
}

// ══════════════════════════════════════════
// ESTADO GLOBAL DEL WIZARD
// ══════════════════════════════════════════

export interface HuertoWizardData {
  paso1: DatosPaso1;
  paso2: DatosPaso2;
  paso3: DatosPaso3;
  paso4: DatosPaso4;
  paso5: DatosPaso5;
}

export interface HuertoWizardState {
  currentStep: WizardStep;
  data: HuertoWizardData;
}

// ══════════════════════════════════════════
// VALORES INICIALES
// ══════════════════════════════════════════

export const INITIAL_WIZARD_DATA: HuertoWizardData = {
  paso1: {
    direccion: "",
    comuna: "",
    latitud: null,
    longitud: null,
    zonaClimatica: "",
    tempMediaTemporada: null,
    riesgoHeladas: false,
    modoIngreso: "api",
  },
  paso2: {
    tipoSuelo: null,
    superficie: null,
    orientacion: null,
  },
  paso3: {
    exposicionSolar: null,
    horasSolEstimadas: null,
    tipoRiego: null,
    drenaje: null,
  },
  paso4: {
    cultivosSeleccionados: [],
    categoriaFiltrada: "todas",
  },
  paso5: {
    planGenerado: false,
    planGuardado: false,
  },
};

// ══════════════════════════════════════════
// TIPOS DE LA API GEOCODING
// ══════════════════════════════════════════

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

// ══════════════════════════════════════════
// PROPS DE COMPONENTES
// ══════════════════════════════════════════

export interface StepProps<T> {
  data: T;
  onUpdate: (data: Partial<T>) => void;
  onNext: () => void;
  onBack?: () => void;
}
