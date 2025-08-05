export interface UserProfile {
  weight: number;
  proteinGoal: number; // g/kg
  fatGoal: number; // g/kg
  carbGoal: number; // g/kg
}

export interface FoodItem {
  id: string;
  name: string;
  preparation: string;
  energy: number; // kcal per 100g
  protein: number; // g per 100g
  fat: number; // g per 100g
  carb: number; // g per 100g
}

export interface FoodConsumption {
  id: string;
  foodItem: FoodItem;
  quantity: number; // grams
  consumedAt: Date;
}

export interface DailyGoals {
  calories: number;
  protein: number; // grams
  fat: number; // grams
  carb: number; // grams
}

export interface DailyConsumption {
  calories: number;
  protein: number; // grams
  fat: number; // grams
  carb: number; // grams
}

export interface NutritionComparison {
  calories: {
    goal: number;
    consumed: number;
    difference: number;
    percentage: number;
  };
  protein: {
    goal: number;
    consumed: number;
    difference: number;
    percentage: number;
  };
  fat: {
    goal: number;
    consumed: number;
    difference: number;
    percentage: number;
  };
  carb: {
    goal: number;
    consumed: number;
    difference: number;
    percentage: number;
  };
}

export interface DailySummary {
  date: Date;
  goals: DailyGoals;
  consumption: DailyConsumption;
  comparison: NutritionComparison;
  foodItems: FoodConsumption[];
}

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