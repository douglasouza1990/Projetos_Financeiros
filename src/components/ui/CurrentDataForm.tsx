import React from 'react';
import type { UserData } from '../../types';
import SmartInput from './SmartInput';

interface CurrentDataFormProps {
  userData: UserData;
  onUpdate: (data: UserData) => void;
}

const CurrentDataForm: React.FC<CurrentDataFormProps> = ({ userData, onUpdate }) => {
  const handleChange = (key: keyof UserData, value: any) => {
    onUpdate({ ...userData, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
        <span className="bg-gradient-to-r from-teal-500 to-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
          📋
        </span>
        Dados Atuais
      </h2>
      
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SmartInput
          type="date"
          label="Data Inicial"
          value={userData.initialDate}
          onChange={(value) => handleChange('initialDate', value)}
          placeholder="Selecione a data inicial"
          required
        />
        
        <SmartInput
          type="number"
          label="Idade Atual"
          value={userData.currentAge}
          onChange={(value) => handleChange('currentAge', value)}
          placeholder="Ex: 35"
          min={18}
          max={100}
          required
        />
        
        <SmartInput
          type="number"
          label="Idade de Aposentadoria"
          value={userData.retirementAge}
          onChange={(value) => handleChange('retirementAge', value)}
          placeholder="Ex: 65"
          min={50}
          max={85}
          required
        />
        
        <SmartInput
          type="currency"
          label="Valor Inicial"
          value={userData.initialAccumulation}
          onChange={(value) => handleChange('initialAccumulation', value)}
          placeholder="Ex: 50.000,00"
          min={0}
          required
        />
      </form>
    </div>
  );
};

export default CurrentDataForm;