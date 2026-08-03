// lib/soilRules.js
// Lógica local (sin API externa) para diagnosticar el suelo,
// recomendar riego y estimar el gasto de agua semanal.

// Matriz textura x filtración -> diagnóstico, frecuencia de riego y factor de suelo.
const MATRIZ_SUELO = {
  arenoso: {
    rapido: {
      diagnostico: "Drenaje muy rápido, el agua se pierde con facilidad.",
      frecuenciaDias: 2,
      factorSuelo: 1.5,
    },
    moderado: {
      diagnostico: "Drenaje moderado, retiene algo de humedad.",
      frecuenciaDias: 3,
      factorSuelo: 1.3,
    },
    estancamiento: {
      diagnostico: "Posible capa compactada bajo la superficie, vigilar encharcamiento.",
      frecuenciaDias: 3,
      factorSuelo: 1.1,
    },
  },
  equilibrado: {
    rapido: {
      diagnostico: "Buen drenaje con textura equilibrada.",
      frecuenciaDias: 3,
      factorSuelo: 1.0,
    },
    moderado: {
      diagnostico: "Suelo ideal para la mayoría de las plantas.",
      frecuenciaDias: 4,
      factorSuelo: 1.0,
    },
    estancamiento: {
      diagnostico: "Drenaje deficiente pese a buena textura, revisar compactación.",
      frecuenciaDias: 5,
      factorSuelo: 0.8,
    },
  },
  arcilloso: {
    rapido: {
      diagnostico: "Suelo arcilloso con grietas superficiales, drenaje irregular.",
      frecuenciaDias: 4,
      factorSuelo: 0.9,
    },
    moderado: {
      diagnostico: "Alta retención de agua, riego espaciado recomendado.",
      frecuenciaDias: 6,
      factorSuelo: 0.7,
    },
    estancamiento: {
      diagnostico: "Riesgo alto de encharcamiento, considerar mejorar drenaje.",
      frecuenciaDias: 7,
      factorSuelo: 0.5,
    },
  },
};

// Factor de temporada (hemisferio sur, ej. Chile).
function getFactorEstacion(fecha = new Date()) {
  const mes = fecha.getMonth() + 1; // 1-12

  if (mes === 12 || mes <= 2) return { nombre: "Verano", factor: 1.5 };
  if (mes >= 3 && mes <= 5) return { nombre: "Otoño", factor: 1.0 };
  if (mes >= 6 && mes <= 8) return { nombre: "Invierno", factor: 0.6 };
  return { nombre: "Primavera", factor: 1.1 };
}

// Diagnóstico principal: combina textura + filtración.
function getSoilDiagnosis(textura, filtracion) {
  const entrada = MATRIZ_SUELO[textura]?.[filtracion];

  if (!entrada) {
    throw new Error(
      `Combinación no válida: textura="${textura}", filtracion="${filtracion}"`
    );
  }

  return entrada;
}

// Cálculo de gasto de agua semanal estimado (en litros).
// litrosBasePorPlanta: consumo base semanal de una planta promedio.
function calculateWaterUsage({
  numeroPlantas,
  textura,
  filtracion,
  fecha = new Date(),
  litrosBasePorPlanta = 1.5,
}) {
  const { factorSuelo, frecuenciaDias } = getSoilDiagnosis(textura, filtracion);
  const { nombre: temporada, factor: factorEstacion } = getFactorEstacion(fecha);

  const riegosPorSemana = 7 / frecuenciaDias;

  const gastoSemanalLitros =
    numeroPlantas *
    litrosBasePorPlanta *
    factorSuelo *
    factorEstacion *
    riegosPorSemana;

  return {
    temporada,
    factorEstacion,
    factorSuelo,
    frecuenciaDias,
    gastoSemanalLitros: Math.round(gastoSemanalLitros * 10) / 10,
  };
}

// Plan de riego recomendado en texto, según si el usuario quiere riego automático.
function getIrrigationPlan({ numeroPlantas, frecuenciaDias, riegoAutomatico }) {
  const zonas = Math.max(1, Math.ceil(numeroPlantas / 4));

  if (riegoAutomatico) {
    return {
      tipo: "Riego automático por goteo",
      detalle: `Se recomienda un sistema con ${zonas} zona(s) de riego (aprox. 1 zona cada 3-4 plantas), programado cada ${frecuenciaDias} día(s).`,
    };
  }

  return {
    tipo: "Riego manual",
    detalle: `Regar manualmente cada ${frecuenciaDias} día(s). Se recomienda dividir el jardín en ${zonas} zona(s) para facilitar el riego.`,
  };
}

// Función principal que junta todo: úsala desde la página de resultado.
function getFullDiagnosis({
  textura,
  filtracion,
  numeroPlantas,
  riegoAutomatico,
  fecha = new Date(),
}) {
  const { diagnostico, frecuenciaDias } = getSoilDiagnosis(textura, filtracion);
  const agua = calculateWaterUsage({ numeroPlantas, textura, filtracion, fecha });
  const riego = getIrrigationPlan({ numeroPlantas, frecuenciaDias, riegoAutomatico });

  return {
    diagnosticoSuelo: diagnostico,
    ...agua,
    riego,
  };
}

module.exports = {
  getSoilDiagnosis,
  getFactorEstacion,
  calculateWaterUsage,
  getIrrigationPlan,
  getFullDiagnosis,
};
