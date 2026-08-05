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
          superficie: data.paso1.superficie,
        },
        espacio: {
          tipoSuelo: data.paso2.tipoSuelo,
        },
        condiciones: {
          orientacion: data.paso3.orientacion,
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
    <div className="flex flex-col items-start gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-[32px] font-semibold leading-10 tracking-[-0.96px] text-[#0F5238] font-serif">
          Plan de Acción
        </h2>
        <p className="text-lg leading-7 text-[#404943]">
          Aquí tienes un plan detallado de la planificación de tu huerto,
          segun tus condiciones ambientales y del suelo.
        </p>
      </div>

      {/* Resumen de tu espacio + Materiales sugeridos */}
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-[32px] bg-white p-6 shadow-[0px_20px_20px_rgba(15,82,56,0.06)]">
          <div className="flex items-center gap-2 border-b border-[#C6C6C8] pb-4">
            <img src="/imagenes/iconos/Location_marker.svg" alt="" className="h-4 w-4" />
            <h3 className="text-lg font-semibold text-[#0F5238]">Resumen de tu espacio</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-6 text-sm">
            <InfoItem label="Ubicación" value={data.paso1.comuna || data.paso1.direccion} />
            <InfoItem label="Superficie" value={data.paso1.superficie ? `${data.paso1.superficie} m²` : "—"} />
            <InfoItem label="Tipo de suelo" value={data.paso2.tipoSuelo || "—"} />
            <InfoItem label="Orientación del sol" value={data.paso3.orientacion || "—"} />
            <InfoItem label="Tipo de riego" value={data.paso3.tipoRiego || "—"} />
            <InfoItem label="Drenaje" value={data.paso3.drenaje || "—"} />
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-6 shadow-[0px_20px_20px_rgba(15,82,56,0.06)]">
          <div className="flex items-center gap-2 border-b border-[#C6C6C8] pb-4">
            <img src="/imagenes/iconos/Clipboard_list.svg" alt="" className="h-4 w-4" />
            <h3 className="text-lg font-semibold text-[#0F5238]">Materiales sugeridos para tu huerta</h3>
          </div>
          <ul className="flex flex-col gap-2 pt-4 text-sm text-[#404943]">
            <MaterialItem>
              Sustrato/tierra: ~{Math.ceil((data.paso1.superficie || 1) * 0.3 * 100)} litros (capa de 30cm)
            </MaterialItem>
            <MaterialItem>
              Compost o humus: ~{Math.ceil((data.paso1.superficie || 1) * 2)} kg
            </MaterialItem>
            {data.paso3.tipoRiego === "goteo" && (
              <MaterialItem>
                Kit de riego por goteo ({Math.ceil((data.paso1.superficie || 1) * 2)} goteros aprox.)
              </MaterialItem>
            )}
            {cultivosDetalle.some((c) => c.crop && c.crop.horasSolMinimas <= 4) && (
              <MaterialItem>Malla sombra (para cultivos sensibles al sol intenso)</MaterialItem>
            )}
            {cultivosDetalle.some((c) => c.crop && c.crop.distanciaEntrePlantas > 40) && (
              <MaterialItem>Tutores y amarras (para tomates, porotos, arvejas)</MaterialItem>
            )}
            <MaterialItem>Herramientas básicas: pala de mano, rastrillo, regadera</MaterialItem>
            <MaterialItem>
              Semillas ó plantines de: {cultivosDetalle.map((c) => c.nombre).join(", ")}
            </MaterialItem>
          </ul>
        </section>
      </div>

      {/* Calendario de Siembra y Cosecha */}
      <section className="w-full rounded-[32px] bg-white p-6 shadow-[0px_20px_20px_rgba(15,82,56,0.06)]">
        <div className="flex items-center gap-2 border-b border-[#C6C6C8] pb-4">
          <img src="/imagenes/iconos/Calendar.svg" alt="" className="h-4 w-4" />
          <h3 className="text-lg font-semibold text-[#0F5238]">Calendario de siembra y cosecha</h3>
        </div>
        <div className="overflow-x-auto pt-4">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="py-2 pr-3 text-left font-semibold uppercase tracking-[0.7px] text-[#0F5238]">
                  Cultivo
                </th>
                {MESES.map((mes, i) => (
                  <th
                    key={mes}
                    className={`px-1 py-2 text-center font-semibold uppercase tracking-[0.7px] ${
                      i === mesActual ? "text-[#0F5238]" : "text-[#0F5238]/70"
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
                  <tr key={id} className="border-t border-[#C6C6C8]">
                    <td className="whitespace-nowrap py-2 pr-3 text-sm text-[#404943]">{crop.nombre}</td>
                    {MESES.map((_, i) => {
                      const mes = i + 1;
                      const esSiembra = crop.mesesSiembra.includes(mes as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12);
                      const esCosecha = calcularMesCosecha(crop.mesesSiembra, crop.diasCosecha, mes);
                      return (
                        <td key={i} className="px-1 py-2 text-center">
                          {esSiembra && (
                            <span
                              className="inline-flex items-center gap-1 rounded bg-[#D7E5BB] px-2 py-1 text-[10px] font-semibold text-[#404943]"
                              title="Siembra"
                            >
                              <img src="/imagenes/iconos/siembra.svg" alt="" className="h-8 w-8" />
                              S
                            </span>
                          )}
                          {esCosecha && !esSiembra && (
                            <span
                              className="inline-flex items-center gap-1 rounded bg-[#FFF4D2] px-2 py-1 text-[10px] font-semibold text-[#404943]"
                              title="Cosecha"
                            >
                              <img src="/imagenes/iconos/cosecha.svg" alt="" className="h-8 w-8" />
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
        <div className="mt-3 flex gap-4 text-xs text-[#404943]">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded bg-[#D7E5BB]" /> Temporada de siembra
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded bg-[#FFF4D2]" /> Temporada de cosechar
          </span>
        </div>
      </section>

      {/* Fichas de cultivos */}
      <section className="w-full rounded-[32px] bg-white p-6 shadow-[0px_20px_20px_rgba(15,82,56,0.06)]">
        <div className="flex items-center gap-2 border-b border-[#C6C6C8] pb-4">
          <img src="/imagenes/iconos/icon-plant.svg" alt="" className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-[#0F5238]">Fichas de cultivos</h3>
        </div>
        <div className="flex flex-col divide-y divide-[#C6C6C8] pt-2">
          {cultivosDetalle.map(({ id, crop, compatibilidad }) => {
            if (!crop) return null;
            return (
              <div key={id} className="flex flex-col gap-3 py-5">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-base font-semibold uppercase tracking-[0.7px] text-[#0F5238]">
                    {crop.nombre}
                  </span>
                  <span className="text-sm font-semibold text-[#0F5238]">
                    Compatibilidad: {compatibilidad}%
                  </span>
                </div>
                <p className="text-sm text-[#404943]">{crop.descripcion}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>Crecimiento maximo: {crop.distanciaEntrePlantas}cm</Badge>
                  <Badge>Sembrar a nivel del suelo: {crop.profundidadSiembra}cm</Badge>
                  <Badge>Cosecha: {crop.diasCosecha} días</Badge>
                </div>
                {crop.tips.length > 0 && <p className="text-sm text-[#404943]">{crop.tips[0]}</p>}
                {crop.companeras.length > 0 && (
                  <p className="text-sm text-[#404943]">
                    Compañeras: {crop.companeras.slice(0, 3).join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recomendaciones */}
      <section className="w-full rounded-[32px] bg-white p-6 shadow-[0px_20px_20px_rgba(15,82,56,0.06)]">
        <div className="flex items-center gap-2 border-b border-[#C6C6C8] pb-4">
          <img src="/imagenes/iconos/Light_bulb.svg" alt="" className="h-4 w-4" />
          <h3 className="text-lg font-semibold text-[#0F5238]">Recomendaciones</h3>
        </div>
        <ul className="flex flex-col gap-3 pt-4 text-sm text-[#404943]">
          {generarRecomendaciones(data, cultivosDetalle).map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F5238]" />
              <span>{rec.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Acciones */}
      {error && (
        <div className="w-full rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {guardado && (
        <div className="w-full rounded-xl border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-sm font-medium text-green-800">
            ✅ ¡Plan guardado exitosamente en tu cuenta!
          </p>
        </div>
      )}

      <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border-2 border-[#BFC9C1] px-6 py-3 text-sm font-medium text-[#0F5238] transition-colors hover:bg-[#e8f5e9]"
        >
          Volver átras
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border-2 border-[#BFC9C1] px-6 py-3 text-sm font-medium text-[#0F5238] transition-colors hover:bg-[#e8f5e9]"
        >
          Nuevo Plan
        </button>
        {!guardado && (
          <button
            type="button"
            onClick={handleGuardar}
            disabled={guardando}
            className="rounded-full bg-[#0F5238] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Descargar mi plan"}
          </button>
        )}
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
      <p className="text-xs font-semibold uppercase tracking-[0.7px] text-[#0F5238]">{label}</p>
      <p className="text-sm capitalize text-[#404943]">{value}</p>
    </div>
  );
}

function MaterialItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F5238]" />
      <span>{children}</span>
    </li>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-[#F5F3EE] px-4 py-1 text-sm font-semibold tracking-[0.7px] text-[#404943]">
      {children}
    </span>
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
): { text: string }[] {
  const recs: { text: string }[] = [];

  const nombres = cultivos.map((c) => c.crop?.id).filter(Boolean);
  cultivos.forEach(({ crop }) => {
    if (!crop) return;
    const companeras = crop.companeras.filter((c) => nombres.includes(c));
    if (companeras.length > 0) {
      recs.push({
        text: `${crop.nombre} se beneficia de estar junto a: ${companeras.join(", ")}. Siémbralas cerca.`,
      });
    }
  });

  if (data.paso3.tipoRiego === "manual") {
    recs.push({ text: "Riega temprano en la mañana o al atardecer para minimizar evaporación." });
  }
  if (data.paso3.tipoRiego === "secano") {
    recs.push({ text: "En secano, o con riego natural aplica mulch (paja/hojas) para retener humedad en el suelo." });
  }

  if (data.paso1.riesgoHeladas) {
    recs.push({ text: "Tu zona tiene riesgo de heladas. Protege cultivos sensibles con plástico o TNT en noches frías." });
  }

  if (data.paso3.drenaje === "bajo") {
    recs.push({ text: "Con drenaje bajo, eleva tus camas de cultivo 15-20cm para evitar encharcamiento en las raíces." });
  }

  if (data.paso2.tipoSuelo === "arcilloso") {
    recs.push({ text: "Mejora el suelo arcilloso mezclando arena y compost para airearlo." });
  }

  recs.push({ text: "Rota tus cultivos cada temporada para mantener el suelo saludable." });

  return recs.slice(0, 6);
}