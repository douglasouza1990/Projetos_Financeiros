import React from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Incerteza do Aporte Anual
          </label>
          <div className="relative">
            <select
              value={uncertainties.annualContribution}
              onChange={(e) => onUpdate('annualContribution', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none bg-white hover:border-gray-400"
            >
              {uncertaintyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Incerteza do Benefício Mensal
          </label>
          <div className="relative">
            <select
              value={uncertainties.monthlyBenefit}
              onChange={(e) => onUpdate('monthlyBenefit', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none bg-white hover:border-gray-400"
            >
              {uncertaintyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Incerteza da Renda Extra
          </label>
          <div className="relative">
            <select
              value={uncertainties.extraIncome}
              onChange={(e) => onUpdate('extraIncome', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none bg-white hover:border-gray-400"
            >
              {uncertaintyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Incerteza da Rentabilidade
          </label>
          <div className="relative">
            <select
              value={uncertainties.returnRate}
              onChange={(e) => onUpdate('returnRate', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none bg-white hover:border-gray-400"
            >
              {uncertaintyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UncertaintyAnalysis;