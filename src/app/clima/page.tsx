import { getWeatherSummary } from "@/lib/open-meteo";
import CurrentWeatherCard from "@/components/weather/CurrentWeatherCard";
import ForecastCard from "@/components/weather/ForecastCard";
import GardeningInsightsCard from "@/components/weather/GardeningInsightsCard";

export const metadata = {
  title: "Clima - Sistema SDD",
  description:
    "Información climática y recomendaciones para tu huerto en Puente Alto.",
};

/**
 * Página /clima
 *
 * Server Component que obtiene datos de Open-Meteo y los renderiza
 * usando los componentes de clima. Los datos se cachean por 30 minutos.
 */
export default async function ClimaPage() {
  const weather = await getWeatherSummary();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Clima y Cultivo
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Datos meteorológicos en tiempo real para Puente Alto. Recomendaciones
          personalizadas para el cuidado de tu huerto.
        </p>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Coordenadas: {weather.location.latitude}°,{" "}
          {weather.location.longitude}° · Elevación:{" "}
          {weather.location.elevation}m · Zona horaria:{" "}
          {weather.location.timezone}
        </p>
      </div>

      {/* Grid principal */}
      <div className="grid gap-6">
        {/* Clima actual */}
        <CurrentWeatherCard data={weather.current} />

        {/* Recomendaciones para el huerto */}
        <GardeningInsightsCard insights={weather.gardeningInsights} />

        {/* Pronóstico semanal */}
        <ForecastCard forecast={weather.forecast} />
      </div>

      {/* Footer con créditos de la API */}
      <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
        Datos proporcionados por{" "}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-zinc-700 underline decoration-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-600 dark:hover:text-zinc-200"
        >
          Open-Meteo API
        </a>{" "}
        · Actualización cada 30 minutos
      </div>
    </div>
  );
}
