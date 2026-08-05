"use client";

import Image from "next/image";
import type { Crop } from "@/types/crops";

interface TarjetaCultivoRecomendadoProps {
  crop: Crop;
  compatibilidad: number;
  selected: boolean;
  onToggle: (id: string) => void;
  disabled: boolean;
}

export default function TarjetaCultivoRecomendado({
  crop,
  compatibilidad,
  selected,
  onToggle,
  disabled,
}: TarjetaCultivoRecomendadoProps) {
  const handleClick = () => {
    if (!disabled || selected) {
      onToggle(crop.id);
    }
  };

  // Determinar el texto de espacio - CORREGIDO
  const espacioMap: Record<string, string> = {
    maceta: "Apta para macetas",
    jardinera: "Apta para jardinera",
    suelo: "Apta para suelo",
  };
  const espacioTexto = espacioMap[crop.espacioMinimo] || "Apta para suelo";

  // Determinar dificultad - CORREGIDO
  const dificultadMap: Record<string, string> = {
    facil: "Fácil",
    media: "Dificultad: media",
    dificil: "Difícil",
  };
  const dificultadTexto = dificultadMap[crop.dificultad] || "Fácil";

  return (
    <div
      onClick={handleClick}
      className={`
        flex flex-col justify-start items-start p-4 gap-4
        w-full min-h-[176px]
        transition-all duration-200
        rounded-[32px]
        ${selected
          ? "bg-[#F4F6F5] border-2 border-[#0F5238] shadow-[0px_20px_20px_rgba(15,82,56,0.06)]"
          : "bg-white shadow-[0px_20px_20px_rgba(15,82,56,0.06)] hover:shadow-[0px_20px_25px_rgba(15,82,56,0.12)]"
        }
        ${disabled && !selected ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-row items-start justify-between w-full gap-1">
          <div className="flex flex-row items-center gap-4">
            <span className="text-base font-semibold leading-5 tracking-[0.7px] uppercase text-[#0F5238]">
              {crop.nombre}
            </span>
            
          </div>

          <div className="flex flex-row items-start gap-0.5">
            <span className="text-sm font-semibold leading-5 tracking-[0.7px] text-[#0F5238]">
              Compatibilidad:
            </span>
            <span className="text-sm font-semibold leading-5 tracking-[0.7px] capitalize text-[#0F5238]">
              {compatibilidad}%
            </span>
          </div>
        </div>

        <div className="flex flex-row items-center gap-4">
          <p className="text-sm font-normal leading-4 text-[#404943]">
            {crop.descripcion || `${crop.nombre} es una excelente opción para tu jardín.`}
          </p>
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-start gap-2 w-full">
        <div className="flex flex-row items-center px-4 py-1 bg-[#DAE8BE] rounded h-7">
          <span className="text-sm font-semibold leading-5 tracking-[0.7px] text-[#404943] whitespace-nowrap">
            {dificultadTexto}
          </span>
        </div>

        <div className="flex flex-row items-center px-4 py-1 bg-[#DAE8BE] rounded h-7">
          <span className="text-sm font-semibold leading-5 tracking-[0.7px] text-[#404943] whitespace-nowrap">
            Cosecha: {crop.diasCosecha || 90} días
          </span>
        </div>

        <div className="flex flex-row items-center px-4 py-1 bg-[#DAE8BE] rounded h-7">
          <span className="text-sm font-semibold leading-5 tracking-[0.7px] text-[#404943] whitespace-nowrap">
            {espacioTexto}
          </span>
        </div>
      </div>
    </div>
  );
}