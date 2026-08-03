import type { WeatherSummary } from "@/types/weather";

interface CurrentWeatherCardProps {
  data: WeatherSummary["current"];
}

/**
 * Muestra el clima actual con temperatura, humedad, viento y condición.
 */
export default function CurrentWeatherCard({ data }: CurrentWeatherCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Clima actual
          </p>
          <p className="mt-1 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            {Math.round(data.temperature)}°C
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Sensación térmica: {Math.round(data.feelsLike)}°C
          </p>
        </div>
        <div className="text-right">
          <span className="text-4xl" aria-hidden="true">
            {getWeatherEmoji(data.weatherCode, data.isDay)}
          </span>
          <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {data.weatherDescription}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <WeatherStat
          label="Humedad"
          value={`${data.humidity}%`}
          icon="💧"
        />
        <WeatherStat
          label="Viento"
          value={`${Math.round(data.windSpeed)} km/h`}
          icon="🌬️"
        />
        <WeatherStat
          label="Precipitación"
          value={`${data.precipitation} mm`}
          icon="🌧️"
        />
        <WeatherStat
          label="Dirección"
          value={getWindDirection(data.windDirection)}
          icon="🧭"
        />
      </div>
    </div>
  );
}

function WeatherStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        <span aria-hidden="true">{icon}</span> {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}

function getWeatherEmoji(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code <= 2) return isDay ? "⛅" : "☁️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "🌨️";
  return "⛈️";
}

function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
