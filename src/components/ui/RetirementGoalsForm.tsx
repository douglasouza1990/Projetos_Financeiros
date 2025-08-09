import React from 'react';
import type { UserData } from '../../types';

interface RetirementGoalsFormProps {
  userData: UserData;
  onUpdate: (data: UserData) => void;
}

const RetirementGoalsForm: React.FC<RetirementGoalsFormProps> = ({ userData, onUpdate }) => {
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
      <h2 className="text-lg font-semibold mb-4 text-gray-700">🎯 Metas de Aposentadoria</h2>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Aporte Extra Anual</label>
          <input
            type="text"
            value={getDisplayValue('annualContribution', userData.annualContribution)}
            onChange={(e) => handleChange('annualContribution', parseCurrency(e.target.value))}
            onFocus={() => handleFocus('annualContribution')}
            onBlur={() => handleBlur('annualContribution')}

            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Benefício Mensal Desejado</label>
          <input
            type="text"
            value={getDisplayValue('monthlyBenefit', userData.monthlyBenefit)}
            onChange={(e) => handleChange('monthlyBenefit', parseCurrency(e.target.value))}
            onFocus={() => handleFocus('monthlyBenefit')}
            onBlur={() => handleBlur('monthlyBenefit')}

            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Renda Mensal Extra</label>
          <input
            type="text"
            value={getDisplayValue('extraMonthlyIncome', userData.extraMonthlyIncome)}
            onChange={(e) => handleChange('extraMonthlyIncome', parseCurrency(e.target.value))}
            onFocus={() => handleFocus('extraMonthlyIncome')}
            onBlur={() => handleBlur('extraMonthlyIncome')}

            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Rentabilidade Real (% a.a.)</label>
          <input
            type="number"
            value={userData.realReturnRate}
            onChange={(e) => handleChange('realReturnRate', Number(e.target.value))}

            className="mt-1 w-full border rounded p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default RetirementGoalsForm;
