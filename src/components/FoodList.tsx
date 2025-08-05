import React from 'react';
import { FoodConsumption } from '../types';
import { calculateFoodContribution } from '../utils/calculations';

interface FoodListProps {
  foods: FoodConsumption[];
  onRemoveFood: (id: string) => void;
  onResetDay: () => void;
}

const FoodList: React.FC<FoodListProps> = ({ foods, onRemoveFood, onResetDay }) => {
  const totalContribution = foods.reduce((total, consumption) => {
    const contribution = calculateFoodContribution(consumption.foodItem, consumption.quantity);
    return {
      calories: total.calories + contribution.calories,
      protein: total.protein + contribution.protein,
      fat: total.fat + contribution.fat,
      carb: total.carb + contribution.carb
    };
  }, { calories: 0, protein: 0, fat: 0, carb: 0 });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📋 Alimentos Consumidos Hoje
        </h2>
        {foods.length > 0 && (
          <button
            onClick={onResetDay}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            🗑️ Limpar Dia
          </button>
        )}
      </div>

      {foods.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🍽️</div>
          <p>Nenhum alimento adicionado ainda.</p>
          <p className="text-sm">Adicione alimentos usando o formulário ao lado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Lista de alimentos */}
          <div className="space-y-3">
            {foods.map((consumption) => {
              const contribution = calculateFoodContribution(consumption.foodItem, consumption.quantity);
              return (
                <div
                  key={consumption.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {consumption.foodItem.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {consumption.foodItem.preparation} • {consumption.quantity}g
                      </p>
                      <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-blue-600">
                            {contribution.calories.toFixed(0)}
                          </div>
                          <div className="text-gray-500">kcal</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600">
                            {contribution.protein.toFixed(1)}
                          </div>
                          <div className="text-gray-500">P (g)</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-yellow-600">
                            {contribution.fat.toFixed(1)}
                          </div>
                          <div className="text-gray-500">G (g)</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-orange-600">
                            {contribution.carb.toFixed(1)}
                          </div>
                          <div className="text-gray-500">C (g)</div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFood(consumption.id)}
                      className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                      title="Remover alimento"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumo total */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Resumo Total do Dia:</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center bg-blue-50 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-600">
                  {totalContribution.calories.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Calorias</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-3">
                <div className="text-lg font-bold text-green-600">
                  {totalContribution.protein.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Proteína (g)</div>
              </div>
              <div className="text-center bg-yellow-50 rounded-lg p-3">
                <div className="text-lg font-bold text-yellow-600">
                  {totalContribution.fat.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Gordura (g)</div>
              </div>
              <div className="text-center bg-orange-50 rounded-lg p-3">
                <div className="text-lg font-bold text-orange-600">
                  {totalContribution.carb.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Carboidrato (g)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodList; 