export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-4 text-center text-sm text-zinc-500 dark:text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Sistema SDD. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
