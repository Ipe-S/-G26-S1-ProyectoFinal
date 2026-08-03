"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Algo salió mal
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        {error.message || "Ha ocurrido un error inesperado."}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-full bg-zinc-900 px-6 py-2 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
