/**
 * Módulo de matching entre cultivos y datos climáticos de Open-Meteo.
 * Cruza las condiciones actuales con los parámetros de cada cultivo
 * para determinar cuáles son aptos para sembrar ahora.
 */

import type {
  Crop,
  CropMatch,
  MatchReason,
  ClimateConditions,
  CropCategory,
  Difficulty,
  SpaceType,
  Month,
} from "@/types/crops";
import type { WeatherSummary } from "@/types/weather";
import { CROPS_CATALOG } from "@/data/crops";

/** Filtros opcionales que el usuario puede aplicar */
export interface CropFilters {
  categoria?: CropCategory;
  dificultad?: Difficulty;
  espacio?: SpaceType;
  soloAptos?: boolean;
  busqueda?: string;
}

/**
 * Extrae las condiciones climáticas relevantes del WeatherSummary
 * para usar en el matching de cultivos.
 */
export function extractClimateConditions(
  weather: WeatherSummary
): ClimateConditions {
  const forecast = weather.forecast;

  // Temperaturas de los próximos 3 días
  const next3Days = forecast.slice(0, 3);
  const tempMin = Math.min(...next3Days.map((d) => d.tempMin));
  const tempMax = Math.max(...next3Days.map((d) => d.tempMax));
  const tempPromedio = weather.current.temperature;

  // Precipitación acumulada próximos 3 días
  const precipitacion = next3Days.reduce(
    (sum, d) => sum + d.precipitationSum,
    0
  );

  // Evapotranspiración promedio
  const evapotranspiracion =
    next3Days.reduce((sum, d) => sum + d.evapotranspiration, 0) /
    next3Days.length;

  // UV máximo previsto
  const uvMax = Math.max(...next3Days.map((d) => d.uvIndexMax));

  // Mes actual
  const mesActual = (new Date().getMonth() + 1) as Month;

  // Temperatura del suelo (estimación basada en temperatura ambiente)
  // Open-Meteo provee soil_temperature_6cm en datos horarios
  // Aquí usamos una aproximación: suelo ≈ promedio temp - 2°C
  const tempSuelo = tempPromedio - 2;

  return {
    tempMin,
    tempMax,
    tempPromedio,
    tempSuelo,
    evapotranspiracion,
    precipitacion,
    uvMax,
    mesActual,
  };
}

/**
 * Evalúa un cultivo contra las condiciones climáticas actuales.
 * Retorna un CropMatch con score, razones y recomendaciones.
 */
export function matchCrop(
  crop: Crop,
  conditions: ClimateConditions
): CropMatch {
  const reasons: MatchReason[] = [];
  let score = 0;

  // === 1. TEMPERATURA (peso: 35 puntos) ===
  const tempOk =
    conditions.tempMin >= crop.tempMinTolerada &&
    conditions.tempPromedio >= crop.tempOptimaMin &&
    conditions.tempPromedio <= crop.tempOptimaMax;

  if (conditions.tempMin < crop.tempMinTolerada) {
    reasons.push({
      factor: "temperatura",
      favorable: false,
      description: `Temperatura mínima prevista (${conditions.tempMin}°C) es menor que la tolerada por esta planta (${crop.tempMinTolerada}°C).`,
    });
  } else if (
    conditions.tempPromedio >= crop.tempOptimaMin &&
    conditions.tempPromedio <= crop.tempOptimaMax
  ) {
    score += 35;
    reasons.push({
      factor: "temperatura",
      favorable: true,
      description: `Temperatura actual (${Math.round(conditions.tempPromedio)}°C) está en el rango óptimo (${crop.tempOptimaMin}-${crop.tempOptimaMax}°C).`,
    });
  } else if (conditions.tempMin >= crop.tempMinTolerada) {
    score += 15;
    reasons.push({
      factor: "temperatura",
      favorable: false,
      description: `Temperatura actual (${Math.round(conditions.tempPromedio)}°C) está fuera del rango óptimo (${crop.tempOptimaMin}-${crop.tempOptimaMax}°C) pero la planta sobrevive.`,
    });
  }

  // === 2. TEMPERATURA DEL SUELO (peso: 20 puntos) ===
  if (conditions.tempSuelo >= crop.tempSueloGerminacion) {
    score += 20;
    reasons.push({
      factor: "suelo",
      favorable: true,
      description: `Temperatura del suelo (~${Math.round(conditions.tempSuelo)}°C) es suficiente para germinación (necesita >${crop.tempSueloGerminacion}°C).`,
    });
  } else {
    reasons.push({
      factor: "suelo",
      favorable: false,
      description: `Suelo demasiado frío (~${Math.round(conditions.tempSuelo)}°C) para germinación (necesita >${crop.tempSueloGerminacion}°C).`,
    });
  }

  // === 3. ÉPOCA DE SIEMBRA (peso: 25 puntos) ===
  const isInSeason = crop.mesesSiembra.includes(conditions.mesActual);
  if (isInSeason) {
    score += 25;
    reasons.push({
      factor: "epoca",
      favorable: true,
      description: `Estamos en mes de siembra recomendado para este cultivo.`,
    });
  } else {
    reasons.push({
      factor: "epoca",
      favorable: false,
      description: `No es el mes ideal de siembra. Meses recomendados: ${formatMonths(crop.mesesSiembra)}.`,
    });
  }

  // === 4. RIEGO / HUMEDAD (peso: 10 puntos) ===
  const waterBalance = conditions.precipitacion - conditions.evapotranspiracion;
  if (crop.necesidadHidrica === "baja") {
    score += 10;
    reasons.push({
      factor: "riego",
      favorable: true,
      description: "Planta de baja necesidad hídrica, se adapta a cualquier condición de lluvia.",
    });
  } else if (crop.necesidadHidrica === "media" && waterBalance > -5) {
    score += 10;
    reasons.push({
      factor: "riego",
      favorable: true,
      description: "Precipitación prevista cubre la necesidad hídrica media de esta planta.",
    });
  } else if (crop.necesidadHidrica === "alta" && waterBalance > 0) {
    score += 10;
    reasons.push({
      factor: "riego",
      favorable: true,
      description: "Lluvia suficiente para esta planta de alta necesidad hídrica.",
    });
  } else {
    score += 5;
    reasons.push({
      factor: "riego",
      favorable: false,
      description: `Necesitarás riego complementario (necesidad hídrica: ${crop.necesidadHidrica}).`,
    });
  }

  // === 5. UV (peso: 10 puntos) ===
  if (
    (crop.toleranciaUV === "alta") ||
    (crop.toleranciaUV === "media" && conditions.uvMax <= 8) ||
    (crop.toleranciaUV === "baja" && conditions.uvMax <= 5)
  ) {
    score += 10;
    reasons.push({
      factor: "uv",
      favorable: true,
      description: `Radiación UV (índice ${conditions.uvMax}) es compatible con la tolerancia de esta planta.`,
    });
  } else {
    reasons.push({
      factor: "uv",
      favorable: false,
      description: `UV alto (índice ${conditions.uvMax}) para una planta de tolerancia ${crop.toleranciaUV}. Considera malla sombra.`,
    });
  }

  // === DETERMINAR APTITUD ===
  const isApt = score >= 50 && conditions.tempMin >= crop.tempMinTolerada;

  // === RECOMENDACIONES ===
  const recommendations: string[] = [];
  if (isApt && isInSeason) {
    recommendations.push("Condiciones ideales para sembrar ahora.");
  }
  if (!isInSeason && score >= 40) {
    recommendations.push(
      "Aunque las condiciones son aceptables, no es el mes ideal. Considera esperar."
    );
  }
  if (conditions.tempMin < crop.tempMinTolerada + 3 && conditions.tempMin >= crop.tempMinTolerada) {
    recommendations.push(
      "Temperatura cercana al límite. Prepara protección por si baja más."
    );
  }
  if (crop.necesidadHidrica === "alta" && waterBalance < 0) {
    recommendations.push(
      `Necesitarás regar aproximadamente ${Math.abs(Math.round(waterBalance))}mm adicionales esta semana.`
    );
  }

  return {
    crop,
    score,
    isApt,
    isInSeason,
    reasons,
    recommendations,
  };
}

/**
 * Función principal: obtiene todos los cultivos rankeados por aptitud
 * según las condiciones climáticas actuales.
 */
export function getMatchedCrops(
  weather: WeatherSummary,
  filters?: CropFilters
): CropMatch[] {
  const conditions = extractClimateConditions(weather);

  let crops = CROPS_CATALOG;

  // Aplicar filtros
  if (filters?.categoria) {
    crops = crops.filter((c) => c.categoria === filters.categoria);
  }
  if (filters?.dificultad) {
    crops = crops.filter((c) => c.dificultad === filters.dificultad);
  }
  if (filters?.espacio) {
    crops = crops.filter(
      (c) => c.espacioMinimo === filters.espacio || c.espacioMinimo === "cualquiera"
    );
  }
  if (filters?.busqueda) {
    const term = filters.busqueda.toLowerCase();
    crops = crops.filter(
      (c) =>
        c.nombre.toLowerCase().includes(term) ||
        c.descripcion.toLowerCase().includes(term)
    );
  }

  // Hacer matching
  let results = crops.map((crop) => matchCrop(crop, conditions));

  // Filtrar solo aptos si se solicita
  if (filters?.soloAptos) {
    results = results.filter((r) => r.isApt);
  }

  // Ordenar por score descendente
  results.sort((a, b) => b.score - a.score);

  return results;
}

/** Formatea meses como texto legible */
function formatMonths(months: Month[]): string {
  const monthNames = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];
  return months.map((m) => monthNames[m - 1]).join(", ");
}
