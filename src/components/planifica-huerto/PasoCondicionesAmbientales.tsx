"use client";

import type { DatosPaso3, StepProps, Orientacion, TipoRiego } from "@/types/huerto";
import OptionCard from "@/components/layout/optioncard";

// Cada orientación implica una exposición solar estimada.
// Esto evita preguntarle al usuario "horas de sol" por separado (no está en el Figma),
// y mantiene compatibilidad con PasoSeleccionCultivos / PasoPlanAccion, que ya
// usan exposicionSolar y horasSolEstimadas para calcular compatibilidad de plantas.
const EXPOSICION_POR_ORIENTACION: Record<
  Orientacion,
  { exposicionSolar: DatosPaso3["exposicionSolar"]; horas: number }
> = {
  norte: { exposicionSolar: "sol_pleno", horas: 7 },
  oriente: { exposicionSolar: "sol_medio", horas: 4.5 },
  poniente: { exposicionSolar: "sol_pleno", horas: 6 },
  sur: { exposicionSolar: "sombra_parcial", horas: 2 },
};

const ORIENTACIONES: { value: Orientacion; label: string; image: string; desc: string }[] = [
  {
    value: "norte",
    label: "Norte",
    image: "/imagenes/iconos/norte.png",
    desc: "Maximo sol (ideal para hortalizas)",
  },
  {
    value: "oriente",
    label: "Oriente",
    image: "/imagenes/iconos/oriente.png",
    desc: "Sol de mañana (suave y constante)",
  },
  {
    value: "poniente",
    label: "Poniente",
    image: "/imagenes/iconos/poniente.png",
    desc: "Sol tarde (intenso en verano)",
  },
  {
    value: "sur",
    label: "Sur",
    image: "/imagenes/iconos/sur.png",
    desc: "Menos sol directo (cultivos de sombra)",
  },
];

const TIPOS_RIEGO: { value: TipoRiego; label: string; image: string; desc: string }[] = [
  {
    value: "manual",
    label: "Riego manual",
    image: "/imagenes/iconos/manual.png",
    desc: "Riego con manguera o manual",
  },
  {
    value: "goteo",
    label: "Riego automatico",
    image: "/imagenes/iconos/automatico.svg",
    desc: "Sistema automatizado de riego por goteo.",
  },
  {
    value: "secano",
    label: "Sin riego",
    image: "/imagenes/iconos/sin-riego.svg",
    desc: "Sin riego adicional, solo lluvia",
  },
];

export default function PasoCondicionesAmbientales({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepProps<DatosPaso3>) {
  function handleOrientacion(ori: Orientacion) {
    const { exposicionSolar, horas } = EXPOSICION_POR_ORIENTACION[ori];
    onUpdate({ orientacion: ori, exposicionSolar, horasSolEstimadas: horas });
  }

  function canContinue() {
    return data.orientacion !== null && data.tipoRiego !== null;
  }

  return (
    <div className="flex flex-col items-start gap-8">
        {/* Badge paso */}
        <div className="inline-flex items-center px-4 py-1 gap-2 rounded-full mb-8" style={{ background: "#D7E5BB" }}>
        <span className="w-3 h-3 rounded-full" style={{ background: "#5A6745" }} aria-hidden="true" />
        <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#5A6745" }}>
          Paso 3
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-[32px] font-semibold leading-10 tracking-[-0.96px] text-[#0F5238] font-serif ">
          Condiciones ambientales y riego
        </h2>
        <p className="text-lg leading-7 text-[#404943]">
          Cuéntanos un poco de la orientación y exposición del sol de tu
          jardín. Esto nos ayuda a comprender las condiciones de tu terreno y
          ofrecerte la recomendación adecuada a tus condiciones.
        </p>
      </div>

      {/* Orientación solar */}
      <fieldset className="flex w-full flex-col gap-4">
        <p className="text-lg text-[#404943]">
          La orientación del sol nos indicara si tu suelo evapora rápido el
          agua y su nivel de radiación solar.
        </p>
        <legend className="text-lg font-semibold text-[#0F5238] text-center">
          Seleccione orientación solar predominante de tu jardin.
        </legend>
        <div className="flex flex-wrap gap-6 justify-center">
          {ORIENTACIONES.map((ori) => (
            <OptionCard
              key={ori.value}
              image={ori.image}
              title={ori.label}
              description={ori.desc}
              selected={data.orientacion === ori.value}
              onClick={() => handleOrientacion(ori.value)}
              iconBackground
            />
          ))}
        </div>
      </fieldset>

      {/* Tipo de riego */}
      <fieldset className="flex w-full flex-col gap-4">
        <legend className="text-lg font-semibold text-[#0F5238] text-center">
          Seleccione su tipo de riego
        </legend>
        <div className="flex flex-wrap gap-6 justify-center">
          {TIPOS_RIEGO.map((riego) => (
            <OptionCard
              key={riego.value}
              image={riego.image}
              title={riego.label}
              description={riego.desc}
              selected={data.tipoRiego === riego.value}
              onClick={() => onUpdate({ tipoRiego: riego.value })}
              iconBackground
            />
          ))}
        </div>
      </fieldset>

      {/* Navegación */}
      <div className="flex w-full justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-[#BFC9C1] px-6 py-3 text-sm font-medium text-[#0F5238] transition-colors hover:bg-[#e8f5e9]"
        >
          Volver átras
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue()}
          className="flex items-center gap-2 rounded-full bg-[#0F5238] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar al Paso 4 →
        </button>
      </div>
    </div>
  );
}