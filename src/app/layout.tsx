import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const NOMBRE_PROYECTO = process.env.NEXT_PUBLIC_NOMBRE_PROYECTO || "Mi Huerto";
const DESCRIPCION_BASE =
  "Aplicación ciudadana para incentivar y gestionar proyectos de huertos sustentables.";

export const metadata: Metadata = {
  title: {
    default: `${NOMBRE_PROYECTO} — Huerto Sustentable`,
    template: `%s | ${NOMBRE_PROYECTO}`,
  },
  description: DESCRIPCION_BASE,
  openGraph: {
    title: `${NOMBRE_PROYECTO} — Huerto Sustentable`,
    description: DESCRIPCION_BASE,
    type: "website",
    locale: "es_CL",
    siteName: NOMBRE_PROYECTO,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 bg-[var(--color-fondo)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}