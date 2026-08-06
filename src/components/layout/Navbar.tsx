"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import styles from "./Nav.module.css";

const navLinks = [
  { label: "Mi Huerto", href: "/" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className={styles.headerContainer}>
      {/* Logo */}
      <Link href="/" onClick={() => setIsOpen(false)}>
        <Image
          src="/imagenes/logo.svg"
          alt="Logo"
          width={120}
          height={40}
          priority
        />
      </Link>

      {/* Desktop nav */}
      <div className={styles.desktopNav}>

        {/* Auth */}
        {user ? (
          <>
            <span className={styles.navLink} style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              {user.email}
            </span>
            <button onClick={handleLogout} className={styles.btnAuth}>
              Salir
            </button>
          </>
        ) : (
          <Link href="/login" className={styles.btnAuth}>
            Ingresar
          </Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className={styles.hamburgerButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <nav className={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
              style={pathname === link.href ? { color: "#0f5238", fontWeight: 600 } : undefined}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <span className={styles.navLink} style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                {user.email}
              </span>
              <button onClick={handleLogout} className={styles.btnAuth}>
                Salir
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.btnAuth} onClick={() => setIsOpen(false)}>
              Ingresar
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
