/**
 * Cliente para la API de Open-Meteo.
 * Documentación: https://open-meteo.com/en/docs/
 *
 * Open-Meteo es gratuita, no requiere API key y tiene buena cobertura en Chile.
 * Se usa para obtener datos climáticos relevantes al cultivo de huertos.
 */

import type {
  OpenMeteoResponse,
  WeatherSummary,
  DailyForecast,
  GardeningInsights,
  WMO_WEATHER_CODES,
} from "@/types/weather";
import { WMO_WEATHER_CODES as weatherCodes } from "@/types/weather";

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1";

/** Coordenadas por defecto: Puente Alto, Chile */
const DEFAULT_COORDS = {
  latitude: -33.6117,
  longitude: -70.5758,
};

/** Variables horarias relevantes para huertos */
const HOURLY_VARIABLES = [
  "temperature_2m",
  "relative_humidity_2m",
  "precipitation_probability",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
  "soil_temperature_6cm",
  "soil_moisture_3_to_9cm",
  "evapotranspiration",
  "et0_fao_evapotranspiration",
];

/** Variables diarias relevantes para huertos */
const DAILY_VARIABLES = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "sunrise",
  "sunset",
  "precipitation_sum",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "et0_fao_evapotranspiration",
  "uv_index_max",
];

/** Variables de clima actual */
const CURRENT_VARIABLES = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
  "wind_direction_10m",
  "is_day",
];

/**
 * Obtiene los datos meteorológicos crudos de Open-Meteo.
 */
export async function fetchWeatherData(
  latitude: number = DEFAULT_COORDS.latitude,
  longitude: number = DEFAULT_COORDS.longitude,
  forecastDays: number = 7
): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: CURRENT_VARIABLES.join(","),
    hourly: HOURLY_VARIABLES.join(","),
    daily: DAILY_VARIABLES.join(","),
    timezone: "America/Santiago",
    forecast_days: forecastDays.toString(),
  });

  const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?${params}`, {
    next: { revalidate: 1800 }, // Cache por 30 minutos
  });

  if (!response.ok) {
    throw new Error(
      `Open-Meteo API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<OpenMeteoResponse>;
}

/**
 * Obtiene la descripción textual de un código WMO.
 */
export function getWeatherDescription(code: number): string {
  return weatherCodes[code] || "Desconocido";
}

/**
 * Procesa la respuesta cruda de Open-Meteo en un formato
 * simplificado para uso en componentes.
 */
export function processWeatherData(raw: OpenMeteoResponse): WeatherSummary {
  const current = raw.current!;

  const forecast: DailyForecast[] = (raw.daily?.time || []).map(
    (date, index) => ({
      date,
      weatherCode: raw.daily?.weather_code?.[index] ?? 0,
      weatherDescription: getWeatherDescription(
        raw.daily?.weather_code?.[index] ?? 0
      ),
      tempMax: raw.daily?.temperature_2m_max?.[index] ?? 0,
      tempMin: raw.daily?.temperature_2m_min?.[index] ?? 0,
      precipitationSum: raw.daily?.precipitation_sum?.[index] ?? 0,
      precipitationProbability:
        raw.daily?.precipitation_probability_max?.[index] ?? 0,
      windSpeedMax: raw.daily?.wind_speed_10m_max?.[index] ?? 0,
      uvIndexMax: raw.daily?.uv_index_max?.[index] ?? 0,
      evapotranspiration:
        raw.daily?.et0_fao_evapotranspiration?.[index] ?? 0,
    })
  );

  const gardeningInsights = generateGardeningInsights(forecast, current);

  return {
    location: {
      latitude: raw.latitude,
      longitude: raw.longitude,
      elevation: raw.elevation,
      timezone: raw.timezone,
    },
    current: {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      weatherCode: current.weather_code,
      weatherDescription: getWeatherDescription(current.weather_code),
      isDay: current.is_day === 1,
    },
    forecast,
    gardeningInsights,
  };
}

/**
 * Genera recomendaciones de jardinería basadas en los datos climáticos.
 * Estas recomendaciones son específicas para cultivo de huertos domiciliarios.
 */
function generateGardeningInsights(
  forecast: DailyForecast[],
  current: { temperature_2m: number; relative_humidity_2m: number }
): GardeningInsights {
  const tomorrow = forecast[1];
  const next3Days = forecast.slice(0, 3);

  // Riesgo de helada: temperatura mínima menor a 2°C en los próximos 3 días
  const frostRisk = next3Days.some((day) => day.tempMin < 2);

  // Necesita riego: evapotranspiración promedio alta y poca lluvia prevista
  const avgEvapotranspiration =
    next3Days.reduce((sum, day) => sum + day.evapotranspiration, 0) /
    next3Days.length;
  const totalPrecipitation = next3Days.reduce(
    (sum, day) => sum + day.precipitationSum,
    0
  );
  const needsWatering = avgEvapotranspiration > 3 && totalPrecipitation < 5;

  // Buen momento para sembrar: temp entre 10-25°C, sin heladas, humedad > 40%
  const goodForPlanting =
    current.temperature_2m >= 10 &&
    current.temperature_2m <= 25 &&
    !frostRisk &&
    current.relative_humidity_2m > 40;

  // Generar recomendaciones
  const recommendations: string[] = [];

  if (frostRisk) {
    recommendations.push(
      "⚠️ Riesgo de helada en los próximos días. Protege tus plantas con cobertura o tráelas al interior."
    );
  }

  if (needsWatering) {
    recommendations.push(
      "💧 Se espera alta evapotranspiración y poca lluvia. Riega tus plantas temprano en la mañana o al atardecer."
    );
  }

  if (goodForPlanting) {
    recommendations.push(
      "🌱 Las condiciones actuales son favorables para sembrar. Aprovecha para trasplantar o iniciar nuevos cultivos."
    );
  }

  if (tomorrow && tomorrow.uvIndexMax > 8) {
    recommendations.push(
      "☀️ Índice UV alto mañana. Considera malla sombra para cultivos sensibles como lechugas y espinacas."
    );
  }

  if (tomorrow && tomorrow.windSpeedMax > 40) {
    recommendations.push(
      "🌬️ Vientos fuertes previstos. Asegura tutores y estructuras de soporte en tu huerto."
    );
  }

  if (tomorrow && tomorrow.precipitationProbability > 70) {
    recommendations.push(
      "🌧️ Alta probabilidad de lluvia. No es necesario regar. Verifica el drenaje de tus macetas."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "✅ Condiciones climáticas estables. Mantén tu rutina habitual de riego y cuidado."
    );
  }

  // Resumen general
  let summary: string;
  if (frostRisk) {
    summary =
      "Condiciones de riesgo: se esperan temperaturas cercanas a 0°C. Protege tus cultivos.";
  } else if (goodForPlanting) {
    summary =
      "Excelentes condiciones para el cultivo. Temperatura y humedad óptimas para tus plantas.";
  } else if (needsWatering) {
    summary =
      "Clima seco previsto. Presta atención al riego de tu huerto en los próximos días.";
  } else {
    summary =
      "Condiciones moderadas. Monitorea tu huerto y ajusta el riego según la evolución del clima.";
  }

  return {
    frostRisk,
    needsWatering,
    goodForPlanting,
    summary,
    recommendations,
  };
}

/**
 * Función principal: obtiene y procesa datos climáticos en un solo paso.
 * Ideal para usar en Server Components.
 */
export async function getWeatherSummary(
  latitude?: number,
  longitude?: number,
  forecastDays?: number
): Promise<WeatherSummary> {
  const raw = await fetchWeatherData(latitude, longitude, forecastDays);
  return processWeatherData(raw);
}
