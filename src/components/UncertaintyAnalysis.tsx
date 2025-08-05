import React from 'react';
import { AlertTriangle } from 'lucide-react';
import SelectField from './ui/SelectField';

interface UncertaintyAnalysisProps {
  uncertainties: {
    annualContribution: number;
    monthlyBenefit: number;
    extraIncome: number;
    returnRate: number;
  };
  onUpdate: (field: string, value: number) => void;
}

const UncertaintyAnalysis: React.FC<UncertaintyAnalysisProps> = ({ uncertainties, onUpdate }) => {
  const uncertaintyOptions = [
    { value: 0, label: '0% - Sem incerteza' },
    { value: 5, label: '5% - Baixa incerteza' },
    { value: 10, label: '10% - Média incerteza' },
    { value: 15, label: '15% - Alta incerteza' },
    { value: 20, label: '20% - Muito alta incerteza' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
        Análise de Incertezas
      </h3>
      
      <div className="grid grid-cols-4 gap-4">
        <SelectField
          label="Incerteza do Aporte Anual"
          value={uncertainties.annualContribution}
          onChange={(value) => onUpdate('annualContribution', Number(value))}
          options={uncertaintyOptions}
        />
        
        <SelectField
          label="Incerteza do Benefício Mensal"
          value={uncertainties.monthlyBenefit}
          onChange={(value) => onUpdate('monthlyBenefit', Number(value))}
          options={uncertaintyOptions}
        />
        
        <SelectField
          label="Incerteza da Renda Extra"
          value={uncertainties.extraIncome}
          onChange={(value) => onUpdate('extraIncome', Number(value))}
          options={uncertaintyOptions}
        />
        
        <SelectField
          label="Incerteza da Rentabilidade"
          value={uncertainties.returnRate}
          onChange={(value) => onUpdate('returnRate', Number(value))}
          options={uncertaintyOptions}
        />
      </div>
    </div>
  );
};

export default UncertaintyAnalysis;