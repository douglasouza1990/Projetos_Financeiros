import React, { useRef } from 'react';
import type { UserData } from '../../types';

interface CurrentDataFormProps {
  userData: UserData;
  onUpdate: (data: UserData) => void;
}

const CurrentDataForm: React.FC<CurrentDataFormProps> = ({ userData, onUpdate }) => {
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseCurrency = (value: string) => {
    return Number(value.replace(/\./g, '').replace(',', '.'));
  };

  const handleChange = (key: keyof UserData, value: any) => {
    onUpdate({ ...userData, [key]: value });
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = (field: string) => {
    setFocusedField(null);
  };

  const getDisplayValue = (field: keyof UserData, value: number) => {
    if (focusedField === field) {
      return formatCurrency(value);
    }
    return value.toString();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">📋 Dados Atuais</h2>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Data Inicial</label>
          <input
            type="date"
            value={userData.initialDate}
            onChange={(e) => handleChange('initialDate', e.target.value)}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Idade Atual</label>
          <input
            type="number"
            value={userData.currentAge}
            onChange={(e) => handleChange('currentAge', Number(e.target.value))}
            onFocus={handleFocus}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Idade de Aposentadoria Desejada</label>
          <input
            type="number"
            value={userData.retirementAge}
            onChange={(e) => handleChange('retirementAge', Number(e.target.value))}
            onFocus={handleFocus}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Valor Inicial</label>
          <input
            type="text"
            value={getDisplayValue('initialAccumulation', userData.initialAccumulation)}
            onChange={(e) => handleChange('initialAccumulation', parseCurrency(e.target.value))}
            onFocus={() => handleFocus('initialAccumulation')}
            onBlur={() => handleBlur('initialAccumulation')}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentDataForm;
