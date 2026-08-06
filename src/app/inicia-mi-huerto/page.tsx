import type { Metadata } from "next";
import IniciaMiHuertoClient from "./IniciaMiHuertoClient";

export const metadata: Metadata = {
  title: "Inicia tu huerto",
  description:
    "Completa el formulario de 5 pasos para conocer el suelo, clima y condiciones de tu jardín, y recibe tu plan de siembra y riego.",
  openGraph: {
    title: "Inicia tu huerto",
    description:
      "Completa el formulario de 5 pasos para conocer el suelo, clima y condiciones de tu jardín, y recibe tu plan de siembra y riego.",
  },
};

export default function IniciaMiHuertoPage() {
  return <IniciaMiHuertoClient />;
}