import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  value: string | number;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  icon,
  min,
  max,
  step,
  placeholder
}) => {
  const formatCurrency = (val: string) => {
    const numericValue = val.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    if (type === 'currency') {
      inputValue = inputValue.replace(/\D/g, '');
    }
    
    onChange(inputValue);
  };

  const displayValue = type === 'currency' && typeof value === 'number' 
    ? formatCurrency(value.toString())
    : value;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type === 'currency' ? 'text' : type}
          value={displayValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
            icon ? 'pl-10' : ''
          } hover:border-gray-400`}
        />
        {type === 'currency' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <span className="text-sm">R$</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;