"use client";

import type { Crop } from "@/types/crops";

interface TarjetaCultivoRecomendadoProps {
  crop: Crop;
  compatibilidad: number;
  selected: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
}

export default function TarjetaCultivoRecomendado({
  crop,
  compatibilidad,
  selected,
  onToggle,
  disabled = false,
}: TarjetaCultivoRecomendadoProps) {
  const badgeColor = getBadgeColor(compatibilidad);

  return (
    <button
      type="button"
      onClick={() => !disabled && onToggle(crop.id)}
      disabled={disabled && !selected}
      className={`relative flex flex-col rounded-xl border-2 p-4 text-left transition-all ${
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : disabled
            ? "border-zinc-200 opacity-50 cursor-not-allowed dark:border-zinc-700"
            : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600"
      }`}
    >
      {/* Badge de compatibilidad */}
      <span
        className={`absolute top-3 right-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeColor}`}
      >
        {compatibilidad}%
      </span>

      {/* Checkbox visual */}
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
            selected
              ? "border-primary bg-primary text-white"
              : "border-zinc-300 dark:border-zinc-600"
          }`}
          aria-hidden="true"
        >
          {selected && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate pr-12">
            {crop.nombre}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {crop.descripcion}
          </p>
        </div>
      </div>

      {/* Info adicional */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          🗓️ {crop.diasCosecha} días
        </span>
        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {getDificultadEmoji(crop.dificultad)} {crop.dificultad}
        </span>
        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          📏 {crop.espacioMinimo}
        </span>
      </div>
    </button>
  );
}

function getBadgeColor(score: number): string {
  if (score >= 70) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  if (score >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
}

function getDificultadEmoji(dif: string): string {
  if (dif === "facil") return "🟢";
  if (dif === "media") return "🟡";
  return "🔴";
}
