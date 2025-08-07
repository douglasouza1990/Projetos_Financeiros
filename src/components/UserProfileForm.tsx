import React from 'react';
import { UserProfile } from '../types';

interface UserProfileFormProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ profile, onUpdate }) => {
  const handleChange = (field: keyof UserProfile, value: number) => {
    onUpdate({ ...profile, [field]: value });
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Configurar Perfil Nutricional
      </h2>
      
      <div className="space-y-6">
        {/* Peso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              min="30"
              max="200"
              step="0.1"
              value={profile.weight}
              onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
              onClick={handleClick}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="70"
            />
            <div className="absolute right-3 top-3 text-gray-400">kg</div>
          </div>
        </div>

        {/* Metas de Macronutrientes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Metas de Macronutrientes (g/kg de peso corporal)
          </h3>
          
          {/* Proteína */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proteína
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.5"
                max="4"
                step="0.1"
                value={profile.proteinGoal}
                onChange={(e) => handleChange('proteinGoal', parseFloat(e.target.value) || 0)}
                onClick={handleClick}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="2.0"
              />
              <div className="absolute right-3 top-3 text-gray-400">g/kg</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: 1.6-2.2 g/kg para atletas, 0.8-1.2 g/kg para sedentários
            </p>
          </div>

          {/* Gordura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gordura
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.5"
                max="3"
                step="0.1"
                value={profile.fatGoal}
                onChange={(e) => handleChange('fatGoal', parseFloat(e.target.value) || 0)}
                onClick={handleClick}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1.0"
              />
              <div className="absolute right-3 top-3 text-gray-400">g/kg</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: 0.8-1.5 g/kg (20-35% das calorias)
            </p>
          </div>

          {/* Carboidrato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carboidrato
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="8"
                step="0.1"
                value={profile.carbGoal}
                onChange={(e) => handleChange('carbGoal', parseFloat(e.target.value) || 0)}
                onClick={handleClick}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="3.0"
              />
              <div className="absolute right-3 top-3 text-gray-400">g/kg</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: 3-7 g/kg (45-65% das calorias)
            </p>
          </div>
        </div>

        {/* Resumo das metas diárias */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Metas Diárias Calculadas:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-600 font-medium">Proteína:</span>
              <span className="ml-2">{(profile.weight * profile.proteinGoal).toFixed(1)}g</span>
            </div>
            <div>
              <span className="text-green-600 font-medium">Gordura:</span>
              <span className="ml-2">{(profile.weight * profile.fatGoal).toFixed(1)}g</span>
            </div>
            <div>
              <span className="text-green-600 font-medium">Carboidrato:</span>
              <span className="ml-2">{(profile.weight * profile.carbGoal).toFixed(1)}g</span>
            </div>
            <div>
              <span className="text-green-600 font-medium">Calorias:</span>
              <span className="ml-2">
                {Math.round(profile.weight * (profile.proteinGoal * 4 + profile.fatGoal * 9 + profile.carbGoal * 4))} kcal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm; 