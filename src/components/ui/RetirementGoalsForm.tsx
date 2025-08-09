import React from 'react';
import type { UserData } from '../../types';
import SmartInput from './SmartInput';

interface RetirementGoalsFormProps {
  userData: UserData;
  onUpdate: (data: UserData) => void;
}

const RetirementGoalsForm: React.FC<RetirementGoalsFormProps> = ({ userData, onUpdate }) => {
  const handleChange = (key: keyof UserData, value: any) => {
    onUpdate({ ...userData, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
        <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
          🎯
        </span>
        Metas de Aposentadoria
      </h2>
      
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SmartInput
          type="currency"
          label="Aporte Extra Anual"
          value={userData.annualContribution}
          onChange={(value) => handleChange('annualContribution', value)}
          placeholder="Ex: 12.000,00"
          min={0}
        />
        
        <SmartInput
          type="currency"
          label="Benefício Mensal Desejado"
          value={userData.monthlyBenefit}
          onChange={(value) => handleChange('monthlyBenefit', value)}
          placeholder="Ex: 5.000,00"
          min={0}
          required
        />
        
        <SmartInput
          type="currency"
          label="Renda Mensal Extra"
          value={userData.extraMonthlyIncome}
          onChange={(value) => handleChange('extraMonthlyIncome', value)}
          placeholder="Ex: 2.000,00"
          min={0}
        />
        
        <SmartInput
          type="percentage"
          label="Rentabilidade Real (% a.a.)"
          value={userData.realReturnRate}
          onChange={(value) => handleChange('realReturnRate', value)}
          placeholder="Ex: 6,5"
          min={0}
          max={30}
          required
        />
      </form>
    </div>
  );
};

export default RetirementGoalsForm;