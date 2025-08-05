import React from 'react';
import { DailySummary } from '../types';
import { getStatusColor, getStatusIcon } from '../utils/calculations';

interface NutritionChartProps {
  summary: DailySummary;
}

const NutritionChart: React.FC<NutritionChartProps> = ({ summary }) => {
  const { comparison } = summary;

  const renderProgressBar = (label: string, percentage: number, color: string) => {
    const clampedPercentage = Math.min(Math.max(percentage, 0), 200); // Limitar entre 0% e 200%
    const barColor = percentage >= 90 && percentage <= 110 ? 'bg-green-500' : 
                     percentage < 90 ? 'bg-red-500' : 'bg-orange-500';
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className={`text-sm font-medium ${getStatusColor(percentage)}`}>
            {getStatusIcon(percentage)} {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${barColor} h-3 rounded-full transition-all duration-300`}
            style={{ width: `${clampedPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Progresso Nutricional
      </h2>
      
      <div className="space-y-6">
        {/* Barras de progresso */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Metas vs. Consumo Real
          </h3>
          
          {renderProgressBar('Calorias', comparison.calories.percentage, 'blue')}
          {renderProgressBar('Proteína', comparison.protein.percentage, 'green')}
          {renderProgressBar('Gordura', comparison.fat.percentage, 'yellow')}
          {renderProgressBar('Carboidrato', comparison.carb.percentage, 'orange')}
        </div>

        {/* Detalhes numéricos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Metas Diárias</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Calorias:</span>
                <span className="font-medium">{comparison.calories.goal.toFixed(0)} kcal</span>
              </div>
              <div className="flex justify-between">
                <span>Proteína:</span>
                <span className="font-medium">{comparison.protein.goal.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span>Gordura:</span>
                <span className="font-medium">{comparison.fat.goal.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span>Carboidrato:</span>
                <span className="font-medium">{comparison.carb.goal.toFixed(1)}g</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Consumo Real</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Calorias:</span>
                <span className="font-medium">{comparison.calories.consumed.toFixed(0)} kcal</span>
              </div>
              <div className="flex justify-between">
                <span>Proteína:</span>
                <span className="font-medium">{comparison.protein.consumed.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span>Gordura:</span>
                <span className="font-medium">{comparison.fat.consumed.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span>Carboidrato:</span>
                <span className="font-medium">{comparison.carb.consumed.toFixed(1)}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diferenças */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-3">Diferenças (Real - Meta)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className={`font-bold ${comparison.calories.difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {comparison.calories.difference >= 0 ? '+' : ''}{comparison.calories.difference.toFixed(0)}
              </div>
              <div className="text-gray-600">kcal</div>
            </div>
            <div className="text-center">
              <div className={`font-bold ${comparison.protein.difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {comparison.protein.difference >= 0 ? '+' : ''}{comparison.protein.difference.toFixed(1)}
              </div>
              <div className="text-gray-600">g proteína</div>
            </div>
            <div className="text-center">
              <div className={`font-bold ${comparison.fat.difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {comparison.fat.difference >= 0 ? '+' : ''}{comparison.fat.difference.toFixed(1)}
              </div>
              <div className="text-gray-600">g gordura</div>
            </div>
            <div className="text-center">
              <div className={`font-bold ${comparison.carb.difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {comparison.carb.difference >= 0 ? '+' : ''}{comparison.carb.difference.toFixed(1)}
              </div>
              <div className="text-gray-600">g carboidrato</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChart; 