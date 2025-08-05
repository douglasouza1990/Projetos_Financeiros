import { 
  UserProfile, 
  DailyGoals, 
  DailyConsumption, 
  NutritionComparison, 
  FoodConsumption,
  FoodItem 
} from '../types';

// Calcular metas diárias baseadas no peso e metas por kg
export const calculateDailyGoals = (profile: UserProfile): DailyGoals => {
  return {
    calories: profile.weight * (profile.proteinGoal * 4 + profile.fatGoal * 9 + profile.carbGoal * 4),
    protein: profile.weight * profile.proteinGoal,
    fat: profile.weight * profile.fatGoal,
    carb: profile.weight * profile.carbGoal
  };
};

// Calcular consumo real baseado nos alimentos consumidos
export const calculateDailyConsumption = (foodItems: FoodConsumption[]): DailyConsumption => {
  return foodItems.reduce((total, consumption) => {
    const ratio = consumption.quantity / 100; // Converter para 100g base
    return {
      calories: total.calories + (consumption.foodItem.energy * ratio),
      protein: total.protein + (consumption.foodItem.protein * ratio),
      fat: total.fat + (consumption.foodItem.fat * ratio),
      carb: total.carb + (consumption.foodItem.carb * ratio)
    };
  }, { calories: 0, protein: 0, fat: 0, carb: 0 });
};

// Calcular comparação entre metas e consumo real
export const calculateNutritionComparison = (
  goals: DailyGoals, 
  consumption: DailyConsumption
): NutritionComparison => {
  return {
    calories: {
      goal: goals.calories,
      consumed: consumption.calories,
      difference: consumption.calories - goals.calories,
      percentage: (consumption.calories / goals.calories) * 100
    },
    protein: {
      goal: goals.protein,
      consumed: consumption.protein,
      difference: consumption.protein - goals.protein,
      percentage: (consumption.protein / goals.protein) * 100
    },
    fat: {
      goal: goals.fat,
      consumed: consumption.fat,
      difference: consumption.fat - goals.fat,
      percentage: (consumption.fat / goals.fat) * 100
    },
    carb: {
      goal: goals.carb,
      consumed: consumption.carb,
      difference: consumption.carb - goals.carb,
      percentage: (consumption.carb / goals.carb) * 100
    }
  };
};

// Calcular contribuição nutricional de um alimento específico
export const calculateFoodContribution = (food: FoodItem, quantity: number) => {
  const ratio = quantity / 100;
  return {
    calories: food.energy * ratio,
    protein: food.protein * ratio,
    fat: food.fat * ratio,
    carb: food.carb * ratio
  };
};

// Obter cor baseada na diferença (verde para meta atingida, vermelho para desvio)
export const getStatusColor = (percentage: number): string => {
  if (percentage >= 90 && percentage <= 110) return 'text-green-600';
  if (percentage < 90) return 'text-red-600';
  return 'text-orange-600';
};

// Obter ícone baseado na diferença
export const getStatusIcon = (percentage: number): string => {
  if (percentage >= 90 && percentage <= 110) return '✅';
  if (percentage < 90) return '⚠️';
  return '📈';
};