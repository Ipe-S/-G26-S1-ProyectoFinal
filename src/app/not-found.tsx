import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-50">404</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Página no encontrada
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-zinc-900 px-6 py-2 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
