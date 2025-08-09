import React, { useState } from 'react';
import { useSmartInput, SmartInputOptions, parseCurrency, parsePercentage, parseNumber } from '../../hooks/useSmartInput';

interface SmartInputProps extends SmartInputOptions {
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const SmartInput: React.FC<SmartInputProps> = ({
  label,
  value,
  onChange,
  type,
  placeholder,
  className = '',
  disabled = false,
  required = false,
  error,
  autoAdvance = true,
  min,
  max,
  maxLength,
}) => {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value.toString());
  const { inputRef, handleFocus, handleKeyDown, validateValue } = useSmartInput({
    type,
    autoAdvance,
    placeholder,
    min,
    max,
    maxLength,
  });

  // Atualizar displayValue quando value prop mudar
  React.useEffect(() => {
    if (!focused) {
      if (type === 'currency' && typeof value === 'number') {
        setDisplayValue(value.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }));
      } else {
        setDisplayValue(value.toString());
      }
    }
  }, [value, focused, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // Parse baseado no tipo
    let parsedValue: any = inputValue;
    
    switch (type) {
      case 'currency':
        parsedValue = parseCurrency(inputValue);
        console.log(`SmartInput Currency: "${inputValue}" -> ${parsedValue}`);
        break;
      case 'percentage':
        parsedValue = parsePercentage(inputValue);
        break;
      case 'number':
        parsedValue = parseNumber(inputValue);
        break;
      default:
        parsedValue = inputValue;
    }

    onChange(parsedValue);
  };

  const handleFocusEvent = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    handleFocus(e);
  };

  const handleBlurEvent = () => {
    setFocused(false);
  };

  const getInputType = () => {
    switch (type) {
      case 'date':
        return 'date';
      case 'currency':
      case 'number':
      case 'percentage':
        return 'text';
      default:
        return 'text';
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (type) {
      case 'currency':
        return 'Ex: 5.000,00';
      case 'percentage':
        return 'Ex: 5,5';
      case 'number':
        return 'Ex: 35';
      case 'date':
        return 'dd/mm/aaaa';
      default:
        return '';
    }
  };

  const getSuffix = () => {
    switch (type) {
      case 'currency':
        return 'R$';
      case 'percentage':
        return '%';
      default:
        return null;
    }
  };

  const suffix = getSuffix();

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type={getInputType()}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocusEvent}
          onBlur={handleBlurEvent}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={`
            w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200
            ${focused 
              ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-sm' 
              : error 
                ? 'border-red-500' 
                : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            ${suffix ? 'pr-8' : ''}
            focus:outline-none
            placeholder:text-gray-400
            ${className}
          `}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{suffix}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {/* Dica de navegação para o primeiro campo */}
      {focused && autoAdvance && (
        <p className="mt-1 text-xs text-gray-500">
          Pressione Enter para ir ao próximo campo
        </p>
      )}
    </div>
  );
};

export default SmartInput;
