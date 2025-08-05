import React, { useState } from 'react';
import { FoodConsumption, FoodItem } from '../types';
import { searchFoods } from '../utils/foodDatabase';
import { calculateFoodContribution } from '../utils/calculations';

interface FoodIntakeFormProps {
  onAddFood: (foodConsumption: FoodConsumption) => void;
}

const FoodIntakeForm: React.FC<FoodIntakeFormProps> = ({ onAddFood }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = searchFoods(query);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setSearchQuery(`${food.name} - ${food.preparation}`);
    setShowResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFood && quantity > 0) {
      const foodConsumption: FoodConsumption = {
        id: Date.now().toString(),
        foodItem: selectedFood,
        quantity,
        consumedAt: new Date()
      };
      
      onAddFood(foodConsumption);
      
      // Reset form
      setSelectedFood(null);
      setSearchQuery('');
      setQuantity(100);
    }
  };

  const contribution = selectedFood ? calculateFoodContribution(selectedFood, quantity) : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🍽️ Adicionar Alimento
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Busca de alimentos */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Alimento
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Digite o nome do alimento..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          
          {/* Resultados da busca */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((food) => (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => handleSelectFood(food)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{food.name}</div>
                  <div className="text-sm text-gray-500">{food.preparation}</div>
                  <div className="text-xs text-gray-400">
                    {food.energy} kcal, P: {food.protein}g, G: {food.fat}g, C: {food.carb}g (por 100g)
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quantidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade (gramas)
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="1000"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="100"
            />
            <div className="absolute right-3 top-3 text-gray-400">g</div>
          </div>
        </div>

        {/* Informações nutricionais do alimento selecionado */}
        {selectedFood && contribution && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              Informações Nutricionais ({quantity}g de {selectedFood.name})
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Calorias:</span>
                <span className="ml-2">{contribution.calories.toFixed(1)} kcal</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Proteína:</span>
                <span className="ml-2">{contribution.protein.toFixed(1)}g</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Gordura:</span>
                <span className="ml-2">{contribution.fat.toFixed(1)}g</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Carboidrato:</span>
                <span className="ml-2">{contribution.carb.toFixed(1)}g</span>
              </div>
            </div>
          </div>
        )}

        {/* Botão de adicionar */}
        <button
          type="submit"
          disabled={!selectedFood || quantity <= 0}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          ➕ Adicionar ao Consumo Diário
        </button>
      </form>
    </div>
  );
};

export default FoodIntakeForm; 