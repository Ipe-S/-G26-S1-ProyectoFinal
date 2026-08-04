"use client";

import { useState, useCallback } from "react";
import type {
  WizardStep,
  HuertoWizardData,
  DatosPaso1,
  DatosPaso2,
  DatosPaso3,
  DatosPaso4,
} from "@/types/huerto";
import { INITIAL_WIZARD_DATA } from "@/types/huerto";
import BarraProgresoPasos from "./BarraProgresoPasos";
import PasoUbicacionClima from "./PasoUbicacionClima";
import PasoEspacioSuelo from "./PasoEspacioSuelo";
import PasoCondicionesAmbientales from "./PasoCondicionesAmbientales";
import PasoSeleccionCultivos from "./PasoSeleccionCultivos";
import PasoPlanAccion from "./PasoPlanAccion";

export default function ContenedorWizardHuerto() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [data, setData] = useState<HuertoWizardData>(INITIAL_WIZARD_DATA);

  // Calcular pasos completados
  const completedSteps: WizardStep[] = [];
  if (isStep1Complete(data.paso1)) completedSteps.push(1);
  if (isStep2Complete(data.paso2)) completedSteps.push(2);
  if (isStep3Complete(data.paso3)) completedSteps.push(3);
  if (isStep4Complete(data.paso4)) completedSteps.push(4);
  if (data.paso5.planGenerado) completedSteps.push(5);

  // Handlers de actualización por paso
  const updatePaso1 = useCallback((partial: Partial<DatosPaso1>) => {
    setData((prev) => ({ ...prev, paso1: { ...prev.paso1, ...partial } }));
  }, []);

  const updatePaso2 = useCallback((partial: Partial<DatosPaso2>) => {
    setData((prev) => ({ ...prev, paso2: { ...prev.paso2, ...partial } }));
  }, []);

  const updatePaso3 = useCallback((partial: Partial<DatosPaso3>) => {
    setData((prev) => ({ ...prev, paso3: { ...prev.paso3, ...partial } }));
  }, []);

  const updatePaso4 = useCallback((partial: Partial<DatosPaso4>) => {
    setData((prev) => ({ ...prev, paso4: { ...prev.paso4, ...partial } }));
  }, []);

  // Navegación
  function goNext() {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  }

  function goBack() {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  }

  function goToStep(step: WizardStep) {
    // Solo permite navegar a pasos completados o al actual
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step);
    }
  }

  function handleReset() {
    setData(INITIAL_WIZARD_DATA);
    setCurrentStep(1);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Barra de progreso */}
      <div className="mb-10 px-4 sm:px-12">
        <BarraProgresoPasos
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
      </div>

      {/* Contenido del paso actual */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        {currentStep === 1 && (
          <PasoUbicacionClima
            data={data.paso1}
            onUpdate={updatePaso1}
            onNext={goNext}
          />
        )}

        {currentStep === 2 && (
          <PasoEspacioSuelo
            data={data.paso2}
            onUpdate={updatePaso2}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {currentStep === 3 && (
          <PasoCondicionesAmbientales
            data={data.paso3}
            onUpdate={updatePaso3}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {currentStep === 4 && (
          <PasoSeleccionCultivos
            data={data.paso4}
            onUpdate={updatePaso4}
            onNext={() => {
              setData((prev) => ({
                ...prev,
                paso5: { ...prev.paso5, planGenerado: true },
              }));
              goNext();
            }}
            onBack={goBack}
            datosPaso1={data.paso1}
            datosPaso2={data.paso2}
            datosPaso3={data.paso3}
          />
        )}

        {currentStep === 5 && (
          <PasoPlanAccion
            data={data}
            onBack={goBack}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// VALIDACIONES
// ══════════════════════════════════════════

function isStep1Complete(paso1: DatosPaso1): boolean {
  if (paso1.modoIngreso === "manual") {
    return paso1.comuna.trim().length > 0;
  }
  return paso1.latitud !== null && paso1.longitud !== null;
}

function isStep2Complete(paso2: DatosPaso2): boolean {
  return paso2.tipoSuelo !== null && paso2.superficie !== null && paso2.orientacion !== null;
}

function isStep3Complete(paso3: DatosPaso3): boolean {
  return paso3.exposicionSolar !== null && paso3.tipoRiego !== null && paso3.drenaje !== null;
}

function isStep4Complete(paso4: DatosPaso4): boolean {
  return paso4.cultivosSeleccionados.length >= 1;
}
