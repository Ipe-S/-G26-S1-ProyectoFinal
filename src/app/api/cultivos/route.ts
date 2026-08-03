import { NextRequest, NextResponse } from "next/server";
import { getWeatherSummary } from "@/lib/open-meteo";
import { getMatchedCrops } from "@/lib/crop-matching";
import type { CropCategory, Difficulty, SpaceType } from "@/types/crops";

/**
 * GET /api/cultivos
 *
 * Retorna los cultivos del catálogo cruzados con las condiciones climáticas actuales.
 * Cada cultivo incluye un score de aptitud y recomendaciones.
 *
 * Query params:
 *  - lat (number): Latitud. Default: -33.6117 (Puente Alto)
 *  - lon (number): Longitud. Default: -70.5758 (Puente Alto)
 *  - categoria (string): Filtrar por categoría (hortaliza, legumbre, vegetal, hierba_aromatica, frutal_menor)
 *  - dificultad (string): Filtrar por dificultad (facil, media, dificil)
 *  - espacio (string): Filtrar por espacio mínimo (maceta, jardinera, suelo)
 *  - aptos (boolean): Si es "true", solo retorna cultivos aptos para sembrar ahora
 *  - busqueda (string): Búsqueda por nombre o descripción
 *
 * Ejemplo: /api/cultivos?categoria=hortaliza&aptos=true
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const categoria = searchParams.get("categoria") as CropCategory | null;
    const dificultad = searchParams.get("dificultad") as Difficulty | null;
    const espacio = searchParams.get("espacio") as SpaceType | null;
    const aptos = searchParams.get("aptos");
    const busqueda = searchParams.get("busqueda");

    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;

    // Validaciones
    if (lat && (isNaN(latitude!) || latitude! < -90 || latitude! > 90)) {
      return NextResponse.json(
        { error: "Latitud inválida." },
        { status: 400 }
      );
    }
    if (lon && (isNaN(longitude!) || longitude! < -180 || longitude! > 180)) {
      return NextResponse.json(
        { error: "Longitud inválida." },
        { status: 400 }
      );
    }

    // Obtener datos climáticos
    const weather = await getWeatherSummary(latitude, longitude);

    // Hacer matching con filtros
    const results = getMatchedCrops(weather, {
      categoria: categoria || undefined,
      dificultad: dificultad || undefined,
      espacio: espacio || undefined,
      soloAptos: aptos === "true",
      busqueda: busqueda || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        total: results.length,
        aptos: results.filter((r) => r.isApt).length,
        cultivos: results,
      },
      climate: {
        temperature: weather.current.temperature,
        humidity: weather.current.humidity,
        location: weather.location,
      },
      meta: {
        source: "Open-Meteo API + Catálogo de cultivos Chile",
        matchingVersion: "1.0",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in /api/cultivos:", error);

    return NextResponse.json(
      {
        success: false,
        error: "No se pudieron obtener los cultivos recomendados.",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
