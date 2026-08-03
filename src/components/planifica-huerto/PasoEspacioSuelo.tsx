"use client";

import type { DatosPaso2, StepProps, TipoSuelo, Orientacion } from "@/types/huerto";

const TIPOS_SUELO: { value: TipoSuelo; label: string; icon: string; desc: string }[] = [
  { value: "arcilloso", label: "Arcilloso", icon: "🧱", desc: "Pesado, retiene agua, se compacta" },
  { value: "arenoso", label: "Arenoso", icon: "🏖️", desc: "Ligero, drena rápido, bajo en nutrientes" },
  { value: "franco", label: "Franco", icon: "🌱", desc: "Equilibrado, ideal para la mayoría de cultivos" },
  { value: "maceta_sustrato", label: "Maceta / Sustrato", icon: "🪴", desc: "Sustrato preparado en contenedor" },
];

const ORIENTACIONES: { value: Orientacion; label: string; icon: string; desc: string }[] = [
  { value: "norte", label: "Norte", icon: "☀️", desc: "Máximo sol (ideal para hortalizas)" },
  { value: "oriente", label: "Oriente", icon: "🌅", desc: "Sol de mañana (suave y constante)" },
  { value: "poniente", label: "Poniente", icon: "🌇", desc: "Sol de tarde (intenso en verano)" },
  { value: "sur", label: "Sur", icon: "🌥️", desc: "Menos sol directo (cultivos de sombra)" },
];

export default function PasoEspacioSuelo({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepProps<DatosPaso2>) {
  function canContinue() {
    return data.tipoSuelo !== null && data.superficie !== null && data.orientacion !== null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Paso 2: Espacio Disponible y Suelo
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Define las características del terreno donde irá tu huerto.
        </p>
      </div>

      {/* Tipo de Suelo */}
      <fieldset>
        <legend className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Tipo de suelo
        </legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TIPOS_SUELO.map((tipo) => (
            <button
              key={tipo.value}
              type="button"
              onClick={() => onUpdate({ tipoSuelo: tipo.value })}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                data.tipoSuelo === tipo.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">{tipo.icon}</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{tipo.label}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{tipo.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Superficie */}
      <div>
        <label htmlFor="superficie" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Superficie disponible (m²)
        </label>
        <div className="flex items-center gap-4">
          <input
            id="superficie"
            type="range"
            min={1}
            max={50}
            step={1}
            value={data.superficie || 5}
            onChange={(e) => onUpdate({ superficie: Number(e.target.value) })}
            className="flex-1 h-2 rounded-lg appearance-none bg-zinc-200 dark:bg-zinc-700 accent-primary"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={200}
              value={data.superficie || ""}
              onChange={(e) => onUpdate({ superficie: Number(e.target.value) || null })}
              className="w-16 rounded-lg border border-zinc-300 px-2 py-2 text-center text-sm text-zinc-900 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
            <span className="text-sm text-zinc-500">m²</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          {getSuperficieHint(data.superficie)}
        </p>
      </div>

      {/* Orientación Solar */}
      <fieldset>
        <legend className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Orientación solar predominante
        </legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ORIENTACIONES.map((ori) => (
            <button
              key={ori.value}
              type="button"
              onClick={() => onUpdate({ orientacion: ori.value })}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                data.orientacion === ori.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">{ori.icon}</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{ori.label}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{ori.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Navegación */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          ← Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue()}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

function getSuperficieHint(m2: number | null): string {
  if (!m2) return "Mueve el slider o escribe un valor";
  if (m2 <= 2) return "Espacio para macetas y jardineras (balcón)";
  if (m2 <= 5) return "Huerto pequeño: hierbas y hortalizas de hoja";
  if (m2 <= 15) return "Huerto familiar: variedad de cultivos";
  if (m2 <= 30) return "Huerto amplio: incluye legumbres y frutales";
  return "Huerto extenso: producción diversificada";
}
