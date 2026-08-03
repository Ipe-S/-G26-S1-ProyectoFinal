/**
 * Tipos para la API de Open-Meteo.
 * Documentación: https://open-meteo.com/en/docs/
 */

/** Parámetros para solicitar datos meteorológicos */
export interface WeatherRequestParams {
  latitude: number;
  longitude: number;
  /** Variables horarias a solicitar */
  hourly?: string[];
  /** Variables diarias a solicitar */
  daily?: string[];
  /** Zona horaria (por defecto America/Santiago) */
  timezone?: string;
  /** Días de pronóstico (1-16) */
  forecast_days?: number;
}

/** Respuesta de clima actual */
export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  is_day: number;
}

/** Unidades de las variables horarias */
export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  precipitation_probability: string;
  precipitation: string;
  weather_code: string;
  wind_speed_10m: string;
  soil_temperature_6cm: string;
  soil_moisture_3_to_9cm: string;
  evapotranspiration: string;
  et0_fao_evapotranspiration: string;
}

/** Datos horarios del pronóstico */
export interface HourlyData {
  time: string[];
  temperature_2m?: number[];
  relative_humidity_2m?: number[];
  precipitation_probability?: number[];
  precipitation?: number[];
  weather_code?: number[];
  wind_speed_10m?: number[];
  soil_temperature_6cm?: number[];
  soil_moisture_3_to_9cm?: number[];
  evapotranspiration?: number[];
  et0_fao_evapotranspiration?: number[];
}

/** Unidades de las variables diarias */
export interface DailyUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  apparent_temperature_max: string;
  apparent_temperature_min: string;
  sunrise: string;
  sunset: string;
  precipitation_sum: string;
  precipitation_probability_max: string;
  wind_speed_10m_max: string;
  et0_fao_evapotranspiration: string;
  uv_index_max: string;
}

/** Datos diarios del pronóstico */
export interface DailyData {
  time: string[];
  weather_code?: number[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  sunrise?: string[];
  sunset?: string[];
  precipitation_sum?: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
  et0_fao_evapotranspiration?: number[];
  uv_index_max?: number[];
}

/** Respuesta completa de la API Open-Meteo */
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current?: CurrentWeather;
  current_units?: Record<string, string>;
  hourly_units?: Partial<HourlyUnits>;
  hourly?: HourlyData;
  daily_units?: Partial<DailyUnits>;
  daily?: DailyData;
}

/** Datos procesados del clima para uso en componentes */
export interface WeatherSummary {
  location: {
    latitude: number;
    longitude: number;
    elevation: number;
    timezone: string;
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    weatherDescription: string;
    isDay: boolean;
  };
  forecast: DailyForecast[];
  gardeningInsights: GardeningInsights;
}

/** Pronóstico diario simplificado */
export interface DailyForecast {
  date: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax: number;
  evapotranspiration: number;
}

/** Insights para cultivo basados en datos climáticos */
export interface GardeningInsights {
  /** Riesgo de helada (temp mín < 2°C) */
  frostRisk: boolean;
  /** Necesita riego (evapotranspiración alta + baja precipitación) */
  needsWatering: boolean;
  /** Buen momento para sembrar (temp y humedad adecuadas) */
  goodForPlanting: boolean;
  /** Resumen textual de las condiciones */
  summary: string;
  /** Recomendaciones específicas */
  recommendations: string[];
}

/**
 * Mapeo de códigos WMO a descripciones en español.
 * Referencia: https://open-meteo.com/en/docs
 */
export const WMO_WEATHER_CODES: Record<number, string> = {
  0: "Cielo despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada intensa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  66: "Lluvia helada ligera",
  67: "Lluvia helada intensa",
  71: "Nevada ligera",
  73: "Nevada moderada",
  75: "Nevada intensa",
  77: "Granizo",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos violentos",
  85: "Chubascos de nieve ligeros",
  86: "Chubascos de nieve intensos",
  95: "Tormenta eléctrica",
  96: "Tormenta con granizo ligero",
  99: "Tormenta con granizo intenso",
};
