"use client";

import { useState, useEffect, useCallback } from "react";
import type { DatosPaso4, StepProps, CategoriaFiltro, CultivoSeleccionado } from "@/types/huerto";
import type { DatosPaso1, DatosPaso2, DatosPaso3 } from "@/types/huerto";
import type { Crop } from "@/types/crops";
import { CROPS_CATALOG } from "@/data/crops";
import TarjetaCultivoRecomendado from "./TarjetaCultivoRecomendado";

const MAX_SELECCION = 5;

const CATEGORIAS: { value: CategoriaFiltro; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "huerta", label: "Huerta" },
  { value: "vegetales", label: "Vegetales" },
  { value: "legumbres", label: "Legumbres" },
];

interface PasoSeleccionCultivosProps extends StepProps<DatosPaso4> {
  datosPaso1: DatosPaso1;
  datosPaso2: DatosPaso2;
  datosPaso3: DatosPaso3;
}

interface CultivoConScore {
  crop: Crop;
  score: number;
}

export default function PasoSeleccionCultivos({
  data,
  onUpdate,
  onNext,
  onBack,
  datosPaso1,
  datosPaso2,
  datosPaso3,
}: PasoSeleccionCultivosProps) {
  const [cultivosScored, setCultivosScored] = useState<CultivoConScore[]>([]);
  const [categoria, setCategoria] = useState<CategoriaFiltro>(data.categoriaFiltrada);
  const [loading, setLoading] = useState(true);

  const calcularCompatibilidad = useCallback(() => {
    setLoading(true);

    const scored = CROPS_CATALOG.map((crop) => {
      let score = 0;

      // 1. Temperatura/Clima (25%) — basado en zona climática
      score += calcularScoreTemperatura(crop, datosPaso1);

      // 2. Tipo de suelo (20%)
      score += calcularScoreSuelo(crop, datosPaso2);

      // 3. Exposición solar (20%)
      score += calcularScoreSol(crop, datosPaso3);

      // 4. Drenaje (15%)
      score += calcularScoreDrenaje(crop, datosPaso3);

      // 5. Riego (10%)
      score += calcularScoreRiego(crop, datosPaso3);

      // 6. Época de siembra (10%)
      score += calcularScoreEpoca(crop);

      return { crop, score: Math.min(100, Math.round(score)) };
    });

    scored.sort((a, b) => b.score - a.score);
    setCultivosScored(scored);
    setLoading(false);
  }, [datosPaso1, datosPaso2, datosPaso3]);

  useEffect(() => {
    calcularCompatibilidad();
  }, [calcularCompatibilidad]);

  function handleToggleCultivo(id: string) {
    const current = data.cultivosSeleccionados;
    const exists = current.find((c) => c.id === id);

    if (exists) {
      onUpdate({
        cultivosSeleccionados: current.filter((c) => c.id !== id),
      });
    } else if (current.length < MAX_SELECCION) {
      const item = cultivosScored.find((c) => c.crop.id === id);
      if (item) {
        onUpdate({
          cultivosSeleccionados: [
            ...current,
            { id, nombre: item.crop.nombre, compatibilidad: item.score },
          ],
        });
      }
    }
  }

  function handleCategoriaChange(cat: CategoriaFiltro) {
    setCategoria(cat);
    onUpdate({ categoriaFiltrada: cat });
  }

  // Filtrar por categoría
  const cultivosFiltrados = cultivosScored.filter((item) => {
    if (categoria === "todas") return true;
    if (categoria === "huerta") return item.crop.categoria === "hierba_aromatica" || item.crop.categoria === "frutal_menor";
    if (categoria === "vegetales") return item.crop.categoria === "hortaliza" || item.crop.categoria === "vegetal";
    if (categoria === "legumbres") return item.crop.categoria === "legumbre";
    return true;
  });

  const canContinue = data.cultivosSeleccionados.length >= 1;
  const seleccionados = data.cultivosSeleccionados;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Paso 4: Selección de Cultivos
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Según tus condiciones, estos cultivos son los más compatibles. Selecciona de 1 a 5.
        </p>
      </div>

      {/* Filtro de categorías */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => handleCategoriaChange(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoria === cat.value
                ? "bg-primary text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Contador de selección */}
      <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2 dark:bg-zinc-800">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Seleccionados: <strong className="text-primary">{seleccionados.length}</strong> / {MAX_SELECCION}
        </span>
        {seleccionados.length > 0 && (
          <div className="flex gap-1">
            {seleccionados.map((c) => (
              <span key={c.id} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {c.nombre}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Grid de cultivos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-primary" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {cultivosFiltrados.map((item) => (
            <TarjetaCultivoRecomendado
              key={item.crop.id}
              crop={item.crop}
              compatibilidad={item.score}
              selected={seleccionados.some((s) => s.id === item.crop.id)}
              onToggle={handleToggleCultivo}
              disabled={seleccionados.length >= MAX_SELECCION}
            />
          ))}
        </div>
      )}

      {cultivosFiltrados.length === 0 && !loading && (
        <p className="text-center text-sm text-zinc-500 py-8">
          No hay cultivos en esta categoría. Prueba con "Todas".
        </p>
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
          disabled={!canContinue}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ver mi plan →
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// FUNCIONES DE SCORING
// ══════════════════════════════════════════

function calcularScoreTemperatura(crop: Crop, paso1: DatosPaso1): number {
  // Si no tenemos datos de clima, dar puntaje neutro
  if (!paso1.zonaClimatica) return 15;

  // Estimar temp media según zona
  const tempMedia: Record<string, number> = {
    arida: 22, semiarida: 18, mediterranea: 15, templada: 12, fria: 8,
  };
  const temp = tempMedia[paso1.zonaClimatica] || 15;

  if (temp >= crop.tempOptimaMin && temp <= crop.tempOptimaMax) return 25;
  if (temp >= crop.tempMinTolerada) return 12;
  return 5;
}

function calcularScoreSuelo(crop: Crop, paso2: DatosPaso2): number {
  if (!paso2.tipoSuelo) return 10;

  // Maceta/sustrato es compatible con todo lo que no sea "suelo"
  if (paso2.tipoSuelo === "maceta_sustrato") {
    return crop.espacioMinimo === "maceta" || crop.espacioMinimo === "jardinera" ? 20 : 8;
  }
  // Franco es ideal para casi todo
  if (paso2.tipoSuelo === "franco") return 20;
  // Arenoso: bueno para raíces (zanahoria, rabanito)
  if (paso2.tipoSuelo === "arenoso") return 14;
  // Arcilloso: algunas plantas toleran
  return 10;
}

function calcularScoreSol(crop: Crop, paso3: DatosPaso3): number {
  if (!paso3.horasSolEstimadas) return 10;

  if (paso3.horasSolEstimadas >= crop.horasSolMinimas) return 20;
  if (paso3.horasSolEstimadas >= crop.horasSolMinimas - 2) return 12;
  return 5;
}

function calcularScoreDrenaje(crop: Crop, paso3: DatosPaso3): number {
  if (!paso3.drenaje) return 8;

  // Plantas de alta necesidad hídrica toleran drenaje bajo
  if (crop.necesidadHidrica === "alta" && paso3.drenaje === "bajo") return 12;
  if (crop.necesidadHidrica === "alta" && paso3.drenaje === "medio") return 15;
  if (crop.necesidadHidrica === "baja" && paso3.drenaje === "alto") return 15;
  if (paso3.drenaje === "medio") return 12;
  return 8;
}

function calcularScoreRiego(crop: Crop, paso3: DatosPaso3): number {
  if (!paso3.tipoRiego) return 5;

  if (paso3.tipoRiego === "goteo") return 10; // Goteo cubre todo
  if (paso3.tipoRiego === "manual" && crop.necesidadHidrica !== "alta") return 8;
  if (paso3.tipoRiego === "secano" && crop.necesidadHidrica === "baja") return 10;
  if (paso3.tipoRiego === "secano" && crop.necesidadHidrica === "alta") return 2;
  return 5;
}

function calcularScoreEpoca(crop: Crop): number {
  const mesActual = new Date().getMonth() + 1;
  return crop.mesesSiembra.includes(mesActual as 1|2|3|4|5|6|7|8|9|10|11|12) ? 10 : 3;
}
