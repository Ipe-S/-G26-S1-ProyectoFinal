import Link from "next/link";
import MiHuerto from "@/components/planifica-huerto/ContenedorWizardHuerto";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center py-16 px-4">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center max-w-2xl">
        <span className="text-6xl" aria-hidden="true">🌿</span>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          {process.env.NEXT_PUBLIC_NOMBRE_PROYECTO || "Mi Huerto Sustentable"}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg">
          Planifica tu huerto domiciliario con recomendaciones basadas en el
          clima real de tu ubicación. Cultiva sustentable.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mt-4">
          <Link
            href="/clima"
            className="rounded-lg bg-green-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-800"
          >
            Ver clima actual
          </Link>
        </div>
      </section>
      <MiHuerto />
      
      {/* Features */}
      <section className="mt-20 grid gap-6 sm:grid-cols-3 max-w-4xl w-full">
        <FeatureCard
          icon=""
          title="Clima en tiempo real"
          description="Datos de Open-Meteo actualizados cada 30 minutos con temperaturas, lluvia y condiciones del suelo."
        />
        <FeatureCard
          icon=""
          title="35 cultivos chilenos"
          description="Catálogo con hortalizas, legumbres, vegetales y hierbas aromáticas adaptadas a la zona central."
        />
        <FeatureCard
          icon=""
          title="Cruce inteligente"
          description="Cruzamos el clima actual con cada cultivo para decirte exactamente qué puedes sembrar hoy."
        />
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <span className="text-3xl" aria-hidden="true">{icon}</span>
      <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

