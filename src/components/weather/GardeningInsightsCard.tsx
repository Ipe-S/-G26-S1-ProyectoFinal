import type { GardeningInsights } from "@/types/weather";

interface GardeningInsightsCardProps {
  insights: GardeningInsights;
}

/**
 * Muestra recomendaciones de jardinería basadas en el clima actual y pronóstico.
 * Este componente es clave para el proyecto de huertos domiciliarios.
 */
export default function GardeningInsightsCard({
  insights,
}: GardeningInsightsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">🌱</span>
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Recomendaciones para tu huerto
        </h3>
      </div>

      {/* Indicadores de estado */}
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge
          active={insights.goodForPlanting}
          label="Apto para sembrar"
          activeColor="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          inactiveColor="bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
        />
        <StatusBadge
          active={insights.frostRisk}
          label="Riesgo de helada"
          activeColor="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          inactiveColor="bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
        />
        <StatusBadge
          active={insights.needsWatering}
          label="Necesita riego"
          activeColor="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          inactiveColor="bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
        />
      </div>

      {/* Resumen */}
      <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
        {insights.summary}
      </p>

      {/* Lista de recomendaciones */}
      <ul className="mt-4 space-y-2">
        {insights.recommendations.map((rec, index) => (
          <li
            key={index}
            className="rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {rec}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusBadge({
  active,
  label,
  activeColor,
  inactiveColor,
}: {
  active: boolean;
  label: string;
  activeColor: string;
  inactiveColor: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        active ? activeColor : inactiveColor
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          active ? "bg-current" : "bg-zinc-400 dark:bg-zinc-600"
        }`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
