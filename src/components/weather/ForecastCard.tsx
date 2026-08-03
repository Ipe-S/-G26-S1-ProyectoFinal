import type { DailyForecast } from "@/types/weather";

interface ForecastCardProps {
  forecast: DailyForecast[];
}

/**
 * Muestra el pronóstico diario en formato de tarjetas horizontales.
 */
export default function ForecastCard({ forecast }: ForecastCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Pronóstico semanal
      </h3>

      <div className="mt-4 space-y-3">
        {forecast.map((day) => (
          <div
            key={day.date}
            className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-800"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                {getDayEmoji(day.weatherCode)}
              </span>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {formatDate(day.date)}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {day.weatherDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="text-right">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {Math.round(day.tempMax)}°
                </span>
                <span className="mx-1 text-zinc-400">/</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {Math.round(day.tempMin)}°
                </span>
              </div>

              {day.precipitationProbability > 0 && (
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <span aria-hidden="true">💧</span>
                  {day.precipitationProbability}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getDayEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "🌨️";
  return "⛈️";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const diffDays = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";

  return date.toLocaleDateString("es-CL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
