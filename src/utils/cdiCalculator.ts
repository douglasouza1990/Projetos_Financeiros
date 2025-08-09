/**
 * Utilitário para calcular rentabilidade real baseada no CDI
 */

// Estimativas de CDI baseadas em cenários econômicos típicos
const CDI_ESTIMATES = {
  2025: 11.5, // Estimativa para 2025
  2024: 12.25,
  2023: 13.75,
  2022: 12.50,
  2021: 4.40,
  2020: 2.75,
};

// IPCA médio histórico (meta de inflação do BC)
const INFLATION_TARGET = 3.0; // Meta de inflação do BC

/**
 * Obtém a taxa CDI estimada para um ano específico
 */
export const getCDIRate = (year: number): number => {
  // Se o ano está na nossa base de dados, usa o valor
  if (CDI_ESTIMATES[year as keyof typeof CDI_ESTIMATES]) {
    return CDI_ESTIMATES[year as keyof typeof CDI_ESTIMATES];
  }
  
  // Para anos futuros, usa uma projeção baseada na meta de inflação + spread
  if (year >= 2025) {
    // CDI tende a ficar próximo da SELIC, que fica próxima da inflação + 2-4%
    return INFLATION_TARGET + 8.5; // Estimativa conservadora
  }
  
  // Para anos muito antigos, usa uma média histórica
  return 10.0;
};

/**
 * Calcula a rentabilidade real descontando a inflação
 * Fórmula: ((1 + nominal) / (1 + inflação)) - 1
 */
export const calculateRealReturn = (nominalRate: number, inflationRate: number = INFLATION_TARGET): number => {
  return ((1 + nominalRate / 100) / (1 + inflationRate / 100)) - 1;
};

/**
 * Obtém a rentabilidade real estimada para investimento CDI 100%
 */
export const getEstimatedRealReturn = (simulationDate?: string): number => {
  const date = simulationDate ? new Date(simulationDate) : new Date();
  const year = date.getFullYear();
  
  // Obtém CDI estimado para o ano
  const cdiRate = getCDIRate(year);
  
  // Calcula rentabilidade real (CDI 100% - inflação)
  const realReturn = calculateRealReturn(cdiRate, INFLATION_TARGET);
  
  // Converte para percentual e arredonda para 1 casa decimal
  return Math.round(realReturn * 100 * 10) / 10;
};

/**
 * Obtém informações detalhadas sobre a estimativa
 */
export const getCDIInfo = (simulationDate?: string) => {
  const date = simulationDate ? new Date(simulationDate) : new Date();
  const year = date.getFullYear();
  const cdiRate = getCDIRate(year);
  const realReturn = getEstimatedRealReturn(simulationDate);
  
  return {
    year,
    cdiRate,
    inflationTarget: INFLATION_TARGET,
    realReturn,
    description: `CDI ${year}: ${cdiRate}% a.a. | Inflação estimada: ${INFLATION_TARGET}% a.a. | Retorno real: ${realReturn}% a.a.`
  };
};
