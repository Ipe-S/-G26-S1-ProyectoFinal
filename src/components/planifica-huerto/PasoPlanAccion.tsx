"use client";

import { useState } from "react";
import type { HuertoWizardData } from "@/types/huerto";
import { CROPS_CATALOG } from "@/data/crops";
import { createClient } from "@/lib/supabase/client";

interface PasoPlanAccionProps {
  data: HuertoWizardData;
  onBack: () => void;
  onReset: () => void;
}

export default function PasoPlanAccion({ data, onBack, onReset }: PasoPlanAccionProps) {
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");

  const cultivosDetalle = data.paso4.cultivosSeleccionados.map((sel) => {
    const crop = CROPS_CATALOG.find((c) => c.id === sel.id);
    return { ...sel, crop };
  });

  const mesActual = new Date().getMonth(); // 0-11
  const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  async function handleGuardar() {
    setGuardando(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setError("Debes iniciar sesión para guardar tu plan.");
        setGuardando(false);
        return;
      }

      const { error: dbError } = await supabase.from("huertos").insert({
        user_id: userData.user.id,
        ubicacion: {
          direccion: data.paso1.direccion,
          comuna: data.paso1.comuna,
          latitud: data.paso1.latitud,
          longitud: data.paso1.longitud,
          zonaClimatica: data.paso1.zonaClimatica,
        },
        espacio: {
          tipoSuelo: data.paso2.tipoSuelo,
          superficie: data.paso2.superficie,
          orientacion: data.paso2.orientacion,
        },
        condiciones: {
          exposicionSolar: data.paso3.exposicionSolar,
          tipoRiego: data.paso3.tipoRiego,
          drenaje: data.paso3.drenaje,
        },
        cultivos: data.paso4.cultivosSeleccionados,
        created_at: new Date().toISOString(),
      });

      if (dbError) throw dbError;
      setGuardado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el plan.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Paso 5: Tu Plan de Acción
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Aquí tienes el resumen completo de tu huerto planificado.
        </p>
      </div>

      {/* Resumen de ubicación y espacio */}
      <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">📍 Resumen de tu espacio</h3>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <InfoItem label="Ubicación" value={data.paso1.comuna || data.paso1.direccion} />
          <InfoItem label="Superficie" value={`${data.paso2.superficie} m²`} />
          <InfoItem label="Suelo" value={data.paso2.tipoSuelo || "—"} />
          <InfoItem label="Orientación" value={data.paso2.orientacion || "—"} />
          <InfoItem label="Sol" value={data.paso3.exposicionSolar?.replace("_", " ") || "—"} />
          <InfoItem label="Riego" value={data.paso3.tipoRiego || "—"} />
          <InfoItem label="Drenaje" value={data.paso3.drenaje || "—"} />
          <InfoItem label="Zona" value={data.paso1.zonaClimatica || "—"} />
        </div>
      </section>

      {/* Calendario de Siembra */}
      <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">🗓️ Calendario de Siembra y Cosecha</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left py-2 pr-3 font-medium text-zinc-600 dark:text-zinc-400">Cultivo</th>
                {MESES.map((mes, i) => (
                  <th
                    key={mes}
                    className={`px-1 py-2 text-center font-medium ${
                      i === mesActual ? "text-primary font-bold" : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {mes}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cultivosDetalle.map(({ id, crop }) => {
                if (!crop) return null;
                return (
                  <tr key={id} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="py-2 pr-3 font-medium text-zinc-900 dark:text-zinc-50 whitespace-nowrap">
                      {crop.nombre}
                    </td>
                    {MESES.map((_, i) => {
                      const mes = i + 1;
                      const esSiembra = crop.mesesSiembra.includes(mes as 1|2|3|4|5|6|7|8|9|10|11|12);
                      const esCosecha = calcularMesCosecha(crop.mesesSiembra, crop.diasCosecha, mes);
                      return (
                        <td key={i} className="px-1 py-2 text-center">
                          {esSiembra && (
                            <span className="inline-block w-5 h-5 rounded bg-green-200 text-green-800 text-[10px] leading-5 dark:bg-green-900/40 dark:text-green-400" title="Siembra">
                              S
                            </span>
                          )}
                          {esCosecha && !esSiembra && (
                            <span className="inline-block w-5 h-5 rounded bg-amber-200 text-amber-800 text-[10px] leading-5 dark:bg-amber-900/40 dark:text-amber-400" title="Cosecha">
                              C
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-green-200 dark:bg-green-900/40" /> Siembra
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-amber-200 dark:bg-amber-900/40" /> Cosecha estimada
          </span>
        </div>
      </section>

      {/* Lista de Materiales */}
      <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">🧰 Lista de Materiales Sugeridos</h3>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Sustrato/tierra: ~{Math.ceil((data.paso2.superficie || 1) * 0.3 * 100)} litros (capa de 30cm)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Compost o humus: ~{Math.ceil((data.paso2.superficie || 1) * 2)} kg
          </li>
          {data.paso3.tipoRiego === "goteo" && (
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Kit de riego por goteo ({Math.ceil((data.paso2.superficie || 1) * 2)} goteros aprox.)
            </li>
          )}
          {cultivosDetalle.some((c) => c.crop && c.crop.horasSolMinimas <= 4) && (
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Malla sombra (para cultivos sensibles al sol intenso)
            </li>
          )}
          {cultivosDetalle.some((c) => c.crop && c.crop.distanciaEntrePlantas > 40) && (
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Tutores y amarras (para tomates, porotos, arvejas)
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Herramientas básicas: pala de mano, rastrillo, regadera
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Semillas o plantines de: {cultivosDetalle.map((c) => c.nombre).join(", ")}
          </li>
        </ul>
      </section>

      {/* Recomendaciones Agronómicas */}
      <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">💡 Recomendaciones</h3>
        <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
          {generarRecomendaciones(data, cultivosDetalle).map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <span aria-hidden="true">{rec.icon}</span>
              <span>{rec.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Fichas de cultivos seleccionados */}
      <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">🌱 Fichas de tus cultivos</h3>
        <div className="space-y-4">
          {cultivosDetalle.map(({ id, crop, compatibilidad }) => {
            if (!crop) return null;
            return (
              <div key={id} className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{crop.nombre}</p>
                  <span className="text-xs font-bold text-primary">{compatibilidad}% compatible</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{crop.descripcion}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span>📏 Distancia: {crop.distanciaEntrePlantas}cm</span>
                  <span>🕳️ Profundidad: {crop.profundidadSiembra}cm</span>
                  <span>🗓️ Cosecha: {crop.diasCosecha} días</span>
                </div>
                {crop.tips.length > 0 && (
                  <p className="mt-2 text-xs text-zinc-500 italic">💬 {crop.tips[0]}</p>
                )}
                {crop.companeras.length > 0 && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    🤝 Compañeras: {crop.companeras.slice(0, 3).join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Acciones */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {guardado && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center dark:bg-green-900/20 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            ✅ ¡Plan guardado exitosamente en tu cuenta!
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          ← Editar cultivos
        </button>

        <div className="flex gap-3">
          {!guardado && (
            <button
              type="button"
              onClick={handleGuardar}
              disabled={guardando}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "💾 Guardar mi huerto"}
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            🔄 Nuevo plan
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="font-medium text-zinc-900 dark:text-zinc-50 capitalize">{value}</p>
    </div>
  );
}

function calcularMesCosecha(mesesSiembra: number[], diasCosecha: number, mes: number): boolean {
  const mesesHastaCosecha = Math.ceil(diasCosecha / 30);
  return mesesSiembra.some((mesSiembra) => {
    const mesCosecha = ((mesSiembra - 1 + mesesHastaCosecha) % 12) + 1;
    return mesCosecha === mes;
  });
}

function generarRecomendaciones(
  data: HuertoWizardData,
  cultivos: { id: string; nombre: string; crop?: (typeof CROPS_CATALOG)[number] }[]
): { icon: string; text: string }[] {
  const recs: { icon: string; text: string }[] = [];

  // Asociaciones beneficiosas
  const nombres = cultivos.map((c) => c.crop?.id).filter(Boolean);
  cultivos.forEach(({ crop }) => {
    if (!crop) return;
    const companeras = crop.companeras.filter((c) => nombres.includes(c));
    if (companeras.length > 0) {
      recs.push({
        icon: "🤝",
        text: `${crop.nombre} se beneficia de estar junto a: ${companeras.join(", ")}. Siémbralas cerca.`,
      });
    }
  });

  // Riego
  if (data.paso3.tipoRiego === "manual") {
    recs.push({ icon: "💧", text: "Riega temprano en la mañana o al atardecer para minimizar evaporación." });
  }
  if (data.paso3.tipoRiego === "secano") {
    recs.push({ icon: "🏜️", text: "En secano, aplica mulch (paja/hojas) para retener humedad en el suelo." });
  }

  // Heladas
  if (data.paso1.riesgoHeladas) {
    recs.push({ icon: "❄️", text: "Tu zona tiene riesgo de heladas. Protege cultivos sensibles con plástico o TNT en noches frías." });
  }

  // Drenaje bajo
  if (data.paso3.drenaje === "bajo") {
    recs.push({ icon: "🌊", text: "Con drenaje bajo, eleva tus camas de cultivo 15-20cm para evitar encharcamiento en las raíces." });
  }

  // Suelo arcilloso
  if (data.paso2.tipoSuelo === "arcilloso") {
    recs.push({ icon: "🧱", text: "Mejora el suelo arcilloso mezclando arena y compost para airearlo." });
  }

  // General
  recs.push({ icon: "🔄", text: "Rota tus cultivos cada temporada para mantener el suelo saludable." });

  return recs.slice(0, 6); // Máximo 6 recomendaciones
}
