// Tipos para o projeto de aposentadoria
export interface UserData {
  currentAge: number;
  retirementAge: number;
  initialAccumulation: number;
  annualContribution: number;
  realReturnRate: number;
  monthlyBenefit: number;
  extraMonthlyIncome: number;
  initialDate: string;
}

export interface ProjectionData {
  years: number[];
  values: number[];
}

export interface ContributionEntry {
  year: number;
  monthlyAmount: number;
  age: number;
}