export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Sistema SDD
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
          Proyecto base con Next.js App Router. Cliente y API por definir.
        </p>
        <div className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-500">
          <span>Next.js 16</span>
          <span>·</span>
          <span>TypeScript</span>
          <span>·</span>
          <span>Tailwind CSS</span>
        </div>
      </main>
    </div>
  );
}
