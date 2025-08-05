import React from 'react';
import { DailySummary } from '../types';
import { getStatusColor, getStatusIcon } from '../utils/calculations';

interface DailySummaryComponentProps {
  summary: DailySummary;
}

const DailySummaryComponent: React.FC<DailySummaryComponentProps> = ({ summary }) => {
  const { date, goals, consumption, comparison, foodItems } = summary;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do resumo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📈 Resumo Nutricional do Dia
          </h1>
          <p className="text-lg text-gray-600 capitalize">
            {formatDate(date)}
          </p>
        </div>
      </div>

      {/* Cards de resumo principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-blue-600">
            {consumption.calories.toFixed(0)}
          </div>
          <div className="text-sm text-gray-600">Calorias Consumidas</div>
          <div className={`text-xs mt-1 ${getStatusColor(comparison.calories.percentage)}`}>
            {getStatusIcon(comparison.calories.percentage)} {comparison.calories.percentage.toFixed(1)}% da meta
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl mb-2">💪</div>
          <div className="text-2xl font-bold text-green-600">
            {consumption.protein.toFixed(1)}g
          </div>
          <div className="text-sm text-gray-600">Proteína</div>
          <div className={`text-xs mt-1 ${getStatusColor(comparison.protein.percentage)}`}>
            {getStatusIcon(comparison.protein.percentage)} {comparison.protein.percentage.toFixed(1)}% da meta
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl mb-2">🥑</div>
          <div className="text-2xl font-bold text-yellow-600">
            {consumption.fat.toFixed(1)}g
          </div>
          <div className="text-sm text-gray-600">Gordura</div>
          <div className={`text-xs mt-1 ${getStatusColor(comparison.fat.percentage)}`}>
            {getStatusIcon(comparison.fat.percentage)} {comparison.fat.percentage.toFixed(1)}% da meta
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl mb-2">🍞</div>
          <div className="text-2xl font-bold text-orange-600">
            {consumption.carb.toFixed(1)}g
          </div>
          <div className="text-sm text-gray-600">Carboidrato</div>
          <div className={`text-xs mt-1 ${getStatusColor(comparison.carb.percentage)}`}>
            {getStatusIcon(comparison.carb.percentage)} {comparison.carb.percentage.toFixed(1)}% da meta
          </div>
        </div>
      </div>

      {/* Análise detalhada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metas vs Real */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Metas vs. Consumo Real
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Calorias', goal: goals.calories, real: consumption.calories, unit: 'kcal' },
              { label: 'Proteína', goal: goals.protein, real: consumption.protein, unit: 'g' },
              { label: 'Gordura', goal: goals.fat, real: consumption.fat, unit: 'g' },
              { label: 'Carboidrato', goal: goals.carb, real: consumption.carb, unit: 'g' }
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{item.label}</span>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Meta: {item.goal.toFixed(item.unit === 'kcal' ? 0 : 1)}{item.unit}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Real: {item.real.toFixed(item.unit === 'kcal' ? 0 : 1)}{item.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de alimentos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🍽️ Alimentos Consumidos ({foodItems.length})
          </h2>
          {foodItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum alimento registrado hoje.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {foodItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.foodItem.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.foodItem.preparation} • {item.quantity}g
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">
                      {((item.foodItem.energy * item.quantity) / 100).toFixed(0)} kcal
                    </div>
                    <div className="text-xs text-gray-500">
                      P: {((item.foodItem.protein * item.quantity) / 100).toFixed(1)}g
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          💡 Recomendações
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparison.calories.percentage < 90 && (
            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
              <div className="flex">
                <div className="text-red-400 text-xl mr-3">⚠️</div>
                <div>
                  <h3 className="font-medium text-red-800">Calorias Insuficientes</h3>
                  <p className="text-sm text-red-700">
                    Você consumiu {comparison.calories.percentage.toFixed(1)}% das calorias recomendadas. 
                    Considere adicionar mais alimentos para atingir sua meta.
                  </p>
                </div>
              </div>
            </div>
          )}

          {comparison.protein.percentage < 90 && (
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <div className="flex">
                <div className="text-orange-400 text-xl mr-3">💪</div>
                <div>
                  <h3 className="font-medium text-orange-800">Proteína Baixa</h3>
                  <p className="text-sm text-orange-700">
                    Considere adicionar mais fontes de proteína como frango, peixe, ovos ou leguminosas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {comparison.calories.percentage > 110 && (
            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <div className="flex">
                <div className="text-yellow-400 text-xl mr-3">📈</div>
                <div>
                  <h3 className="font-medium text-yellow-800">Calorias Excedidas</h3>
                  <p className="text-sm text-yellow-700">
                    Você consumiu {comparison.calories.percentage.toFixed(1)}% das calorias recomendadas. 
                    Considere reduzir o consumo para manter suas metas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {comparison.calories.percentage >= 90 && comparison.calories.percentage <= 110 && 
           comparison.protein.percentage >= 90 && comparison.protein.percentage <= 110 && (
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <div className="flex">
                <div className="text-green-400 text-xl mr-3">✅</div>
                <div>
                  <h3 className="font-medium text-green-800">Excelente Progresso!</h3>
                  <p className="text-sm text-green-700">
                    Você está dentro das metas recomendadas. Continue mantendo esse equilíbrio nutricional!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailySummaryComponent; 