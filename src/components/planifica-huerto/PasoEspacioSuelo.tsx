"use client";

import type { DatosPaso2, StepProps, TipoSuelo, Drenaje } from "@/types/huerto";
import OptionCard from "@/components/layout/optioncard";

interface PasoEspacioSueloProps extends StepProps<DatosPaso2> {
  drenaje: Drenaje | null;
  onUpdateDrenaje: (drenaje: Drenaje) => void;
}

const TIPOS_SUELO: { value: TipoSuelo; label: string; image: string; desc: string }[] = [
  {
    value: "arenoso",
    label: "Arenoso",
    image: "/imagenes/iconos/arenoso.svg",
    desc: "Se deshace inmediatamente, no mantiene forma.",
  },
  {
    value: "franco",
    label: "Equilibrado",
    image: "/imagenes/iconos/franco.svg",
    desc: "Mantiene la forma pero se rompe si se presiona.",
  },
  {
    value: "arcilloso",
    label: "Arcilloso",
    image: "/imagenes/iconos/arcilloso.svg",
    desc: "Se siente pegajoso y mantiene una forma sólida.",
  },
  {
    value: "maceta_sustrato",
    label: "Sustrato preparado",
    image: "/imagenes/iconos/sustrato.svg",
    desc: "Tierra preparada para germinar. Ej: Tierra de hoja.",
  },
];

const DRENAJES: { value: Drenaje; label: string; image: string; desc: string }[] = [
  {
    value: "alto",
    label: "Drenaje rapido",
    image: "/imagenes/iconos/rapido.svg",
    desc: "El agua desaparece casi instantáneamente. El suelo se siente seco poco después.",
  },
  {
    value: "medio",
    label: "Equilibrado",
    image: "/imagenes/iconos/equilibrado.svg",
    desc: "El agua drena de forma constante y mantiene la humedad sin formar charcos persistentes.",
  },
  {
    value: "bajo",
    label: "Estancamiento",
    image: "/imagenes/iconos/estancado.svg",
    desc: "Se forman charcos que duran horas. El suelo se siente lodoso o pesado.",
  },
];

export default function PasoEspacioSuelo({
  data,
  onUpdate,
  drenaje,
  onUpdateDrenaje,
  onNext,
  onBack,
}: PasoEspacioSueloProps) {
  function canContinue() {
    return data.tipoSuelo !== null && drenaje !== null;
  }

  return (
    <div className="flex flex-col items-start gap-8">
      {/* Badge paso */}
      <div className="inline-flex items-center px-4 py-1 gap-2 rounded-full mb-8" style={{ background: "#D7E5BB" }}>
        <span className="w-3 h-3 rounded-full" style={{ background: "#5A6745" }} aria-hidden="true" />
        <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#5A6745" }}>
          Paso 2
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-[32px] font-semibold leading-10 tracking-[-0.96px] text-[#0F5238] font-serif">
          Tipo de suelo y drenaje
        </h2>
        <p className="text-lg leading-7 text-[#404943]">
          Toma un poco de tierra húmeda y apriétala en la mano para hacer una
          bola. Al abrir la mano observa como se comporta la tierra,
          selecciona la opción que mas se parezca a lo observado.
        </p>
      </div>

      {/* Tipo de Suelo */}
      <fieldset className="flex w-full flex-col gap-4">
        <div className="gap-4"> 
          <legend className="text-lg font-semibold text-[#0F5238]">
          Seleccione su tipo de suelo
        </legend>
        </div>
       
        <div className="flex flex-wrap gap-6">
          {TIPOS_SUELO.map((tipo) => (
            <OptionCard
              key={tipo.value}
              image={tipo.image}
              title={tipo.label}
              description={tipo.desc}
              selected={data.tipoSuelo === tipo.value}
              onClick={() => onUpdate({ tipoSuelo: tipo.value })}
            />
          ))}
        </div>
      </fieldset>

      {/* Drenaje (se guarda en data.paso3.drenaje, por eso usa onUpdateDrenaje) */}
      <fieldset className="flex w-full flex-col gap-4">
        <p className="text-lg text-[#404943]">
          ¿Cómo se comporta el agua después de regar o llover en tu zona de
          cultivo? Selecciona la opción que se adecue más.
        </p>
        <legend className="text-lg font-semibold text-[#0F5238]">
          Seleccione su drenaje
        </legend>
        <div className="flex flex-wrap gap-6">
          {DRENAJES.map((dren) => (
            <OptionCard
              key={dren.value}
              image={dren.image}
              title={dren.label}
              description={dren.desc}
              selected={drenaje === dren.value}
              onClick={() => onUpdateDrenaje(dren.value)}
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
          Continuar al Paso 3 →
        </button>
      </div>
    </div>
  );
}