import type { WizardStep } from "@/types/huerto";

// Los 5 pasos del wizard, mostrados como chips en el stepper.
const STEPS = [
  { num: 1, label: "Ubicación" },
  { num: 2, label: "Suelo y drenaje" },
  { num: 3, label: "Condiciones ambientales" },
  { num: 4, label: "Selección de plantas" },
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
      {/* Fila completa: solo desde 1024px (lg), donde ya cabe en una línea */}
      <ol className="hidden lg:flex items-center justify-center gap-1.5 flex-nowrap">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.num as WizardStep);
          const isActive = currentStep === step.num;
          const isClickable = isCompleted || isActive;
          const isReached = step.num <= currentStep;

          // Determinar las clases CSS basado en el estado (ACTIVO tiene prioridad)
          let buttonClasses = "flex h-8 items-center gap-1.5 rounded-full px-3 py-1 whitespace-nowrap text-sm font-semibold tracking-[0.3px] transition-colors";
          
          if (isActive) {
            // PRIORIDAD 1: Estado activo - siempre se muestra así
            buttonClasses += " bg-white border border-[#0f5238] text-[#0f5238] cursor-pointer";
          } else if (isCompleted) {
            // PRIORIDAD 2: Estado completado (solo si no está activo)
            buttonClasses += " bg-[#707973] text-white cursor-pointer";
          } else {
            // PRIORIDAD 3: Estado neutral (no alcanzado)
            buttonClasses += " bg-[#e2e5dc] text-[#5a6745] cursor-default";
          }

          return (
            <li key={step.num} className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.num as WizardStep)}
                disabled={!isClickable}
                aria-current={isActive ? "step" : undefined}
                className={buttonClasses}
              >
                <span>
                  {step.num}. {step.label}
                </span>
                {isCompleted && !isActive && (
                  <svg
                    className="size-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 12.5l3 3 7-7"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {index < STEPS.length - 1 && (
                <div
                  className={`h-px w-[20px] shrink-0 ${
                    isReached ? "bg-[#2D6A4F]" : "bg-[#A6B3A9]"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Indicador compacto: visible debajo de 1024px, siempre en una sola línea */}
      <div className="lg:hidden flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#404943] truncate">
          Paso {currentStep} de {STEPS.length}:{" "}
          <span className="text-[#0f5238]">
            {STEPS[currentStep - 1]?.label ?? ""}
          </span>
        </p>
        <div className="flex gap-1 shrink-0">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className={`h-1.5 w-4 rounded-full transition-colors ${
                completedSteps.includes(step.num as WizardStep)
                  ? "bg-[#0f5238]"
                  : currentStep === step.num
                    ? "bg-[#0f5238]/50"
                    : "bg-[#e2e5dc]"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </nav>
  );
}