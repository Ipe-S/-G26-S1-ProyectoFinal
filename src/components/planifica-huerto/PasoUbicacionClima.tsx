"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { DatosPaso1, StepProps, GeocodingResult, GeocodingResponse } from "@/types/huerto";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export default function PasoUbicacionClima({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepProps<DatosPaso1>) {
  const [query, setQuery] = useState(data.direccion || "");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [superficie, setSuperficie] = useState<string>(data.comuna ? "" : "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocation = useCallback(async (term: string) => {
    if (term.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${GEOCODING_URL}?name=${encodeURIComponent(term)}&count=5&language=es&format=json&country_code=CL`
      );
      if (!res.ok) throw new Error("Error al consultar la API");

      const json: GeocodingResponse = await res.json();
      setResults(json.results || []);
      setShowDropdown(true);
    } catch {
      setError("No se pudo consultar la ubicación. Intenta nuevamente.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    onUpdate({ direccion: value, latitud: null, longitud: null });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchLocation(value), 400);
  }

  function handleSelectResult(result: GeocodingResult) {
    const comuna = result.admin2 || result.admin1 || result.name;
    const zonaClimatica = estimarZonaClimatica(result.latitude);

    onUpdate({
      direccion: result.name,
      comuna,
      latitud: result.latitude,
      longitud: result.longitude,
      zonaClimatica,
      riesgoHeladas: result.latitude < -35,
      modoIngreso: "api",
    });

    setQuery(result.name);
    setShowDropdown(false);
    setResults([]);
  }

  function canContinue() {
    return data.latitud !== null && data.longitud !== null;
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 py-8">

      {/* Badge paso */}
      <div className="inline-flex items-center px-4 py-1 gap-2 rounded-full mb-8" style={{ background: "#D7E5BB" }}>
        <span className="w-3 h-3 rounded-full" style={{ background: "#5A6745" }} aria-hidden="true" />
        <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#5A6745" }}>
          Paso 1 de 5
        </span>
      </div>

      {/* Layout 2 columnas */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

        {/* Columna izquierda: Texto */}
        <div className="flex flex-col gap-4 w-full lg:max-w-[400px]">
          <h1 className="font-serif font-semibold text-[32px] leading-tight italic" style={{ color: "#0F5238", letterSpacing: "-0.96px" }}>
            Diagnostico del suelo
          </h1>
          <h2 className="font-semibold text-lg" style={{ color: "#0F5238" }}>
            Ubicación y superficie
          </h2>
          <p className="text-base leading-7" style={{ color: "#404943" }}>
            Comencemos con lo básico. Para ofrecerte un plan de siembra, riego y
            recomendaciones de plantas debemos conocer las condiciones de tu suelo.
          </p>

          {/* Tip card */}
          <div
            className="flex items-start gap-3 rounded-xl p-4 mt-4"
            style={{ background: "#F5F3EE", border: "1px solid rgba(191,201,193,0.3)" }}
          >
            <span className="text-lg mt-0.5" aria-hidden="true"></span>
            <p className="text-sm leading-snug" style={{ color: "#404943" }}>
              Tip: Toma la foto durante la &quot;hora dorada&quot; para identificar mejor las zonas de sombra.
            </p>
          </div>
        </div>

        {/* Columna derecha: Formulario card */}
        <div
          className="w-full lg:flex-1 rounded-2xl p-6 flex flex-col gap-6"
          style={{ background: "#FAFAF7", border: "1px solid rgba(191,201,193,0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          {/* Ubicación */}
          <div className="flex flex-col gap-2" ref={dropdownRef}>
            <label className="font-semibold text-xs uppercase tracking-wider" style={{ color: "#0F5238" }}>
              Ingresa o confirma la ubicación
            </label>
            <div className="flex gap-2 relative">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Ingresa dirección"
                  className="w-full rounded-lg border pl-9 pr-4 py-3 text-sm outline-none"
                  style={{ borderColor: "#BFC9C1", background: "#FFFFFF", color: "#191c1a" }}
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-[#0F5238]" />
                  </div>
                )}
              </div>
              {/* Botón geolocalización */}
              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-lg border"
                style={{ borderColor: "#BFC9C1", background: "#FFFFFF" }}
                title="Usar mi ubicación actual"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const zona = estimarZonaClimatica(pos.coords.latitude);
                      onUpdate({
                        latitud: pos.coords.latitude,
                        longitud: pos.coords.longitude,
                        zonaClimatica: zona,
                        riesgoHeladas: pos.coords.latitude < -35,
                        modoIngreso: "api",
                        direccion: "Mi ubicación actual",
                        comuna: "Detectada",
                      });
                      setQuery("Mi ubicación actual");
                    });
                  }
                }}
              >
                <span className="text-lg">◎</span>
              </button>
            </div>

            {/* Dropdown resultados */}
            {showDropdown && results.length > 0 && (
              <ul className="absolute z-20 mt-[72px] w-[calc(100%-48px-0.5rem)] rounded-lg border bg-white shadow-lg" style={{ borderColor: "#BFC9C1" }}>
                {results.map((result) => (
                  <li key={result.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectResult(result)}
                      className="w-full px-4 py-3 text-left hover:bg-[#F5F3EE] first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      <p className="text-sm font-medium" style={{ color: "#191c1a" }}>
                        {result.name}
                      </p>
                      <p className="text-xs" style={{ color: "#404943" }}>
                        {[result.admin2, result.admin1, result.country].filter(Boolean).join(", ")}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Superficie estimada */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-xs uppercase tracking-wider" style={{ color: "#0F5238" }}>
              Superficie estimada
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={500}
                value={superficie}
                onChange={(e) => setSuperficie(e.target.value)}
                placeholder="Ej. 45"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none pr-12"
                style={{ borderColor: "#BFC9C1", background: "#FFFFFF", color: "#191c1a" }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded" style={{ background: "#E8E5DF", color: "#404943" }}>
                m²
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-full border text-sm font-medium transition-colors hover:bg-zinc-50"
              style={{ borderColor: "#BFC9C1", color: "#191c1a" }}
            >
              Salir
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canContinue()}
              className="px-6 py-3 rounded-full text-sm font-medium text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#0F5238" }}
            >
              Continuar al Paso 2 →
            </button>
          </div>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 w-full rounded-xl p-4 text-sm" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}>
          {error}
        </div>
      )}
    </div>
  );
}

function estimarZonaClimatica(lat: number): string {
  if (lat > -27) return "arida";
  if (lat > -32) return "semiarida";
  if (lat > -37) return "mediterranea";
  if (lat > -43) return "templada";
  return "fria";
}
