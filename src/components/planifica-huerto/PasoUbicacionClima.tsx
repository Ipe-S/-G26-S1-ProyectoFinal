"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { DatosPaso1, StepProps, GeocodingResult, GeocodingResponse } from "@/types/huerto";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export default function PasoUbicacionClima({
  data,
  onUpdate,
  onNext,
}: StepProps<DatosPaso1>) {
  const [query, setQuery] = useState(data.direccion || "");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [modoManual, setModoManual] = useState(data.modoIngreso === "manual");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
      setError("No se pudo consultar la ubicación. Puedes usar el modo manual.");
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

  function handleManualSubmit() {
    if (!data.comuna.trim()) {
      setError("Ingresa al menos la comuna.");
      return;
    }
    onUpdate({ modoIngreso: "manual" });
    onNext();
  }

  function canContinue() {
    return data.latitud !== null && data.longitud !== null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Paso 1: Ubicación y Clima
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Busca tu comuna o ciudad para obtener datos climáticos de tu zona.
        </p>
      </div>

      {/* Toggle modo */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setModoManual(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !modoManual
              ? "bg-primary text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          🔍 Buscar ubicación
        </button>
        <button
          type="button"
          onClick={() => setModoManual(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            modoManual
              ? "bg-primary text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          ✏️ Modo manual
        </button>
      </div>

      {/* Modo API */}
      {!modoManual && (
        <div className="relative" ref={dropdownRef}>
          <label htmlFor="search-location" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Buscar comuna o ciudad
          </label>
          <div className="relative">
            <input
              id="search-location"
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Ej: Puente Alto, Santiago, Rancagua..."
              className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
            {loading && (
              <div className="absolute right-3 top-3.5">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-primary" />
              </div>
            )}
          </div>

          {/* Dropdown de resultados */}
          {showDropdown && results.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {result.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {[result.admin2, result.admin1, result.country].filter(Boolean).join(", ")}
                      {" · "}Lat: {result.latitude.toFixed(2)}, Lon: {result.longitude.toFixed(2)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showDropdown && results.length === 0 && !loading && query.length >= 3 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-zinc-200 bg-white p-4 text-center text-sm text-zinc-500 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              No se encontraron resultados. Prueba con otro término o usa el modo manual.
            </div>
          )}
        </div>
      )}

      {/* Modo Manual */}
      {modoManual && (
        <div className="space-y-4">
          <div>
            <label htmlFor="manual-comuna" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Comuna
            </label>
            <input
              id="manual-comuna"
              type="text"
              value={data.comuna}
              onChange={(e) => onUpdate({ comuna: e.target.value })}
              placeholder="Ej: Puente Alto"
              className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label htmlFor="manual-ciudad" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Ciudad / Región
            </label>
            <input
              id="manual-ciudad"
              type="text"
              value={data.direccion}
              onChange={(e) => onUpdate({ direccion: e.target.value })}
              placeholder="Ej: Santiago, Región Metropolitana"
              className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label htmlFor="manual-zona" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Zona Climática
            </label>
            <select
              id="manual-zona"
              value={data.zonaClimatica}
              onChange={(e) => onUpdate({ zonaClimatica: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="">Selecciona una zona</option>
              <option value="arida">Árida (Norte Grande)</option>
              <option value="semiarida">Semiárida (Norte Chico)</option>
              <option value="mediterranea">Mediterránea (Zona Central)</option>
              <option value="templada">Templada (Zona Sur)</option>
              <option value="fria">Fría (Zona Austral)</option>
            </select>
          </div>
        </div>
      )}

      {/* Resumen de selección */}
      {data.latitud && data.longitud && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            ✅ Ubicación seleccionada
          </p>
          <p className="mt-1 text-sm text-green-700 dark:text-green-400">
            <strong>{data.comuna}</strong> — Lat: {data.latitud?.toFixed(4)}, Lon: {data.longitud?.toFixed(4)}
          </p>
          {data.zonaClimatica && (
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
              Zona climática: {data.zonaClimatica} · Riesgo de heladas: {data.riesgoHeladas ? "Sí" : "Bajo"}
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Botón siguiente */}
      <div className="flex justify-end pt-4">
        {modoManual ? (
          <button
            type="button"
            onClick={handleManualSubmit}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            Siguiente →
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canContinue()}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        )}
      </div>
    </div>
  );
}

/** Estima zona climática de Chile basada en latitud */
function estimarZonaClimatica(lat: number): string {
  if (lat > -27) return "arida";
  if (lat > -32) return "semiarida";
  if (lat > -37) return "mediterranea";
  if (lat > -43) return "templada";
  return "fria";
}
