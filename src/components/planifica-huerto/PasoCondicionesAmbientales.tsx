"use client";

import type { DatosPaso3, StepProps, ExposicionSolar, TipoRiego, Drenaje } from "@/types/huerto";

const EXPOSICIONES: { value: ExposicionSolar; label: string; horas: number; icon: string; desc: string }[] = [
  { value: "sombra_parcial", label: "Sombra parcial", horas: 2, icon: "🌥️", desc: "Menos de 3 horas de sol directo" },
  { value: "sol_medio", label: "Sol medio", horas: 4.5, icon: "⛅", desc: "Entre 3 y 6 horas de sol directo" },
  { value: "sol_pleno", label: "Sol pleno", horas: 7, icon: "☀️", desc: "Más de 6 horas de sol directo" },
];

const TIPOS_RIEGO: { value: TipoRiego; label: string; icon: string; desc: string }[] = [
  { value: "manual", label: "Manual", icon: "🚿", desc: "Regadera o manguera, riego a mano" },
  { value: "goteo", label: "Goteo", icon: "💧", desc: "Sistema automatizado o asistido" },
  { value: "secano", label: "Secano", icon: "🏜️", desc: "Sin riego adicional, solo lluvia" },
];

const DRENAJES: { value: Drenaje; label: string; icon: string; desc: string }[] = [
  { value: "alto", label: "Alto", icon: "⬇️", desc: "El agua drena rápido, no se encharca" },
  { value: "medio", label: "Medio", icon: "↕️", desc: "Retiene algo de humedad, drena normal" },
  { value: "bajo", label: "Bajo", icon: "🌊", desc: "Se encharca fácilmente, tarda en drenar" },
];

export default function PasoCondicionesAmbientales({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepProps<DatosPaso3>) {
  function handleExposicion(exp: ExposicionSolar) {
    const horas = EXPOSICIONES.find((e) => e.value === exp)?.horas || null;
    onUpdate({ exposicionSolar: exp, horasSolEstimadas: horas });
  }

  function canContinue() {
    return data.exposicionSolar !== null && data.tipoRiego !== null && data.drenaje !== null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Paso 3: Condiciones Ambientales
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Indica las condiciones de luz, riego y drenaje de tu espacio.
        </p>
      </div>

      {/* Exposición Solar */}
      <fieldset>
        <legend className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Exposición solar diaria
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {EXPOSICIONES.map((exp) => (
            <button
              key={exp.value}
              type="button"
              onClick={() => handleExposicion(exp.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 text-center transition-all ${
                data.exposicionSolar === exp.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              <span className="text-3xl" aria-hidden="true">{exp.icon}</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{exp.label}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{exp.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Tipo de Riego */}
      <fieldset>
        <legend className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Disponibilidad y tipo de riego
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TIPOS_RIEGO.map((riego) => (
            <button
              key={riego.value}
              type="button"
              onClick={() => onUpdate({ tipoRiego: riego.value })}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 text-center transition-all ${
                data.tipoRiego === riego.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              <span className="text-3xl" aria-hidden="true">{riego.icon}</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{riego.label}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{riego.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Drenaje */}
      <fieldset>
        <legend className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Drenaje del sustrato
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DRENAJES.map((dren) => (
            <button
              key={dren.value}
              type="button"
              onClick={() => onUpdate({ drenaje: dren.value })}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 text-center transition-all ${
                data.drenaje === dren.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              <span className="text-3xl" aria-hidden="true">{dren.icon}</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{dren.label}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{dren.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Resumen */}
      {canContinue() && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            ✅ Condiciones definidas
          </p>
          <p className="mt-1 text-sm text-green-700 dark:text-green-400">
            {data.horasSolEstimadas}h de sol · Riego {data.tipoRiego} · Drenaje {data.drenaje}
          </p>
        </div>
      )}

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
