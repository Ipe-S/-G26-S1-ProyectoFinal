"use client";
import { useState } from "react";
import Image from "src/app/imagenes";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative w-full flex items-center justify-between px-6 py-4 shadow-sm">
   <Image src="/app/imagenes/logo.svg" alt="Logo de la empresa" width={120} height={40} />
      
   <button
  onClick={() => {
    console.log("click, menuOpen antes:", menuOpen);
    setMenuOpen(!menuOpen);
  }}
  className="md:hidden text-2xl"
  aria-label="Abrir menú"
>
  ☰
</button>

      {/* Menú desktop, siempre visible en pantallas medianas+ */}
      <nav className="hidden md:flex gap-6">
        <a href="#">Nuestros servicios</a>
        <a href="#">Blog</a>
        <a href="#">Tienda</a>
        <a href="#">Aplicación</a>
      </nav>
   {/* Menú mobile, solo aparece si menuOpen es true */}
   {menuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white z-50 flex flex-col gap-4 px-6 py-4 shadow-md md:hidden">
          <a href="#" onClick={() => setMenuOpen(false)}>Nuestros servicios</a>
          <a href="#" onClick={() => setMenuOpen(false)}>Blog</a>
          <a href="#" onClick={() => setMenuOpen(false)}>Tienda</a>
          <a href="#" onClick={() => setMenuOpen(false)}>Aplicación</a>
        </nav>
      )}
    </header>
  );
}