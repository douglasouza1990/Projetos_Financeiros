import React from 'react';
import { Plus, Trash2, Table } from 'lucide-react';
import type { ContributionEntry } from '../types';

interface ContributionTableProps {
  schedule: ContributionEntry[];
  onUpdate: (schedule: ContributionEntry[]) => void;
  currentAge: number;
}

const ContributionTable: React.FC<ContributionTableProps> = ({ schedule, onUpdate, currentAge }) => {
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

  const addRow = () => {
    const newEntry: ContributionEntry = {
      year: schedule.length + 1,
      monthlyAmount: 12000, // Valor anual padrão
      age: currentAge + schedule.length + 1
    };
    onUpdate([...schedule, newEntry]);
  };

  const removeRow = (index: number) => {
    const newSchedule = schedule.filter((_, i) => i !== index);
    onUpdate(newSchedule);
  };

  const updateRow = (index: number, field: keyof ContributionEntry, value: number) => {
    const newSchedule = schedule.map((entry, i) => {
      if (i === index) {
        const updated = { ...entry, [field]: value };
        if (field === 'year') {
          updated.age = currentAge + value;
        }
        return updated;
      }
      return entry;
    });
    onUpdate(newSchedule);
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = (field: string) => {
    setFocusedField(null);
  };



  const getDisplayValue = (value: number) => {
    if (focusedField) {
      return formatCurrency(value);
    }
    return value.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Table className="h-5 w-5 text-teal-500 mr-2" />
          Escala de Aportes Mensais
        </h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={addRow}
            className="flex items-center space-x-2 bg-teal-500 text-white px-3 py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Linha</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tempo (anos)</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Aporte (ano)</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Idade</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((entry, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <input
                    type="number"
                    value={entry.year}
                    onChange={(e) => updateRow(index, 'year', Number(e.target.value))}

                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    min={1}
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={getDisplayValue(entry.monthlyAmount)}
                    onChange={(e) => updateRow(index, 'monthlyAmount', parseCurrency(e.target.value))}
                    onFocus={() => handleFocus(`monthlyAmount-${index}`)}
                    onBlur={() => handleBlur(`monthlyAmount-${index}`)}

                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    value={entry.age}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600"
                  />
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => removeRow(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContributionTable;