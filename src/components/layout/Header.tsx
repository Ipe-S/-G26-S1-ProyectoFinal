import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Sistema SDD
        </Link>
        <ul className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Inicio
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
