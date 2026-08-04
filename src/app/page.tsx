import Link from "next/link";
import Image from "next/image";
import MiHuerto from "@/components/planifica-huerto/ContenedorWizardHuerto";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white">

      {/* ---------- HERO SECTION ---------- */}
      <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden flex items-center justify-center">
        {/* Imagen de fondo optimizada con Next.js Image */}
        <Image
          src="/imagenes/HeroCarouselSection.png"
          alt="Jardín de lujo con topiarios y columnas"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay oscuro degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#191c1a]/40 to-[#191c1a]/80" />
        {/* Contenido del Hero */}
        <div className="relative z-10 max-w-[900px] px-6 text-center">
          <p className="color-[#b1f0ce] text-[#b1f0ce] font-bold text-base tracking-[1.6px] uppercase mb-4">
            El jardinero experto en la máquina
          </p>
          <h1 className="text-white text-3xl sm:text-4xl md:text-[56px] leading-tight font-normal">
            Plan inteligente de siembra según tu suelo y clima
          </h1>
        </div>
      </section>

      {/* ---------- INFO SECTION ---------- */}
      <section className="bg-white py-12 px-6 flex justify-center">
        <div className="flex flex-col lg:flex-row gap-10 max-w-[1177px] w-full items-center">

          {/* Card de Imagen con Badge */}
          <div className="relative w-full lg:flex-1 rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative w-full h-[350px] sm:h-[500px]">
              <Image
                src="/imagenes/control-humedad.png"
                alt="Sensor de suelo inteligente en maceta"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Contenido de texto y características */}
          <div className="w-full lg:flex-1 flex flex-col gap-6">
            <h2 className="text-2xl text-[#0f5238] font-normal">
              Diseña tu jardín según tu suelo y clima
            </h2>
            <p className="text-base text-[#404943] font-semibold leading-relaxed">
              Ingresa los datos de tu terreno y plantas deseadas. Nuestro
              sistema analizará la tierra y el clima local para entregarte
              recomendaciones de siembra exactas y un plano de paisajismo
              optimizado para riego automático.
            </p>

            {/* Fila de Tarjetas de Características */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tarjeta 1 */}
              <div className="flex gap-4 bg-[#f2f4f0] border border-[#e3e7e2] rounded-2xl p-[17px]">
                <div className="relative w-[34px] h-[34px] flex-shrink-0">
                  <Image
                    src="/imagenes/icon-temp.png"
                    alt="Icono temperatura"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base text-[#191c1a] font-medium mb-1">
                    Sincronización Climática
                  </h3>
                  <p className="text-sm text-[#404943] leading-snug">
                    Nos sincronizamos con el clima local y te ofrecemos el
                    mejor plan de siembra
                  </p>
                </div>
              </div>

              {/* Tarjeta 2 */}
              <div className="flex gap-4 bg-[#f2f4f0] border border-[#e3e7e2] rounded-2xl p-[17px]">
                <div className="relative w-[34px] h-[34px] flex-shrink-0">
                  <Image
                    src="/imagenes/icon-analisis.png"
                    alt="Icono análisis"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base text-[#191c1a] font-medium mb-1">
                    Análisis del Suelo
                  </h3>
                  <p className="text-sm text-[#404943] leading-snug">
                    Analizamos tu suelo y te decimos qué debes hacer para
                    mejorarlo
                  </p>
                </div>
              </div>
            </div>
            {/* Botón CTA con Next Link */}
            <Link
              href="/inicia-mi-huerto"
              className="flex items-center justify-center bg-[#0f5238] hover:bg-[#0f5238]/90 text-white text-lg font-medium py-[17px] px-8 rounded-full text-center transition-opacity cursor-pointer mt-2"
            >
              Prueba nuestro sistema
            </Link>
          </div>
        </div>
      </section>

    </main>
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
