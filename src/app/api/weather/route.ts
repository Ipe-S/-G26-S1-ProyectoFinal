import { NextRequest, NextResponse } from "next/server";
import { getWeatherSummary } from "@/lib/open-meteo";

/**
 * GET /api/weather
 *
 * Endpoint para obtener datos climáticos procesados con recomendaciones de cultivo.
 *
 * Query params:
 *  - lat (number): Latitud. Default: -33.6117 (Puente Alto)
 *  - lon (number): Longitud. Default: -70.5758 (Puente Alto)
 *  - days (number): Días de pronóstico (1-16). Default: 7
 *
 * Ejemplo: /api/weather?lat=-33.6117&lon=-70.5758&days=7
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const days = searchParams.get("days");

    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;
    const forecastDays = days ? parseInt(days, 10) : undefined;

    // Validaciones básicas
    if (lat && (isNaN(latitude!) || latitude! < -90 || latitude! > 90)) {
      return NextResponse.json(
        { error: "Latitud inválida. Debe estar entre -90 y 90." },
        { status: 400 }
      );
    }

    if (lon && (isNaN(longitude!) || longitude! < -180 || longitude! > 180)) {
      return NextResponse.json(
        { error: "Longitud inválida. Debe estar entre -180 y 180." },
        { status: 400 }
      );
    }

    if (days && (isNaN(forecastDays!) || forecastDays! < 1 || forecastDays! > 16)) {
      return NextResponse.json(
        { error: "Días de pronóstico inválidos. Debe estar entre 1 y 16." },
        { status: 400 }
      );
    }

    const weatherData = await getWeatherSummary(
      latitude,
      longitude,
      forecastDays
    );

    return NextResponse.json({
      success: true,
      data: weatherData,
      meta: {
        source: "Open-Meteo API",
        documentation: "https://open-meteo.com/en/docs/",
        cached: true,
        cacheMaxAge: 1800,
      },
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);

    return NextResponse.json(
      {
        success: false,
        error: "No se pudieron obtener los datos climáticos.",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
