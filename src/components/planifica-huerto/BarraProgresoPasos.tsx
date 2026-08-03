"use client";

import type { WizardStep } from "@/types/huerto";

const STEPS = [
  { num: 1, label: "Ubicación" },
  { num: 2, label: "Espacio" },
  { num: 3, label: "Condiciones" },
  { num: 4, label: "Cultivos" },
  { num: 5, label: "Plan Final" },
] as const;

interface BarraProgresoPasosProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
  completedSteps?: WizardStep[];
}

export default function BarraProgresoPasos({
  currentStep,
  onStepClick,
  completedSteps = [],
}: BarraProgresoPasosProps) {
  return (
    <nav aria-label="Progreso del formulario" className="w-full">
      {/* Desktop */}
      <ol className="hidden sm:flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.num as WizardStep);
          const isActive = currentStep === step.num;
          const isClickable = isCompleted || isActive;

          return (
            <li key={step.num} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.num as WizardStep)}
                disabled={!isClickable}
                className={`flex flex-col items-center gap-1.5 group ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                    isCompleted
                      ? "bg-primary text-white"
                      : isActive
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.num
                  )}
                </span>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive || isCompleted
                      ? "text-primary dark:text-secondary"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 mt-[-1.25rem] transition-colors ${
                    isCompleted
                      ? "bg-primary"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: compact version */}
      <div className="sm:hidden flex items-center justify-between px-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Paso {currentStep} de 5: <span className="text-primary">{STEPS[currentStep - 1].label}</span>
        </p>
        <div className="flex gap-1">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className={`h-2 w-6 rounded-full transition-colors ${
                completedSteps.includes(step.num as WizardStep)
                  ? "bg-primary"
                  : currentStep === step.num
                    ? "bg-primary/60"
                    : "bg-zinc-200 dark:bg-zinc-700"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
