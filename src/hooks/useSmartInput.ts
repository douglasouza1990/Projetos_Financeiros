import { useRef, useCallback } from 'react';

export interface SmartInputOptions {
  type: 'text' | 'number' | 'currency' | 'percentage' | 'date';
  autoAdvance?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  maxLength?: number;
}

export const useSmartInput = (options: SmartInputOptions) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Seleção automática ao focar
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.select();
    }, 10);
  }, []);

  // Navegação por Enter
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && options.autoAdvance !== false) {
      e.preventDefault();
      
      // Encontrar próximo input focável
      const form = e.currentTarget.form;
      if (form) {
        const inputs = Array.from(form.querySelectorAll(
          'input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
        )) as HTMLElement[];
        
        const currentIndex = inputs.indexOf(e.currentTarget);
        const nextInput = inputs[currentIndex + 1];
        
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }, [options.autoAdvance]);

  // Formatação baseada no tipo
  const formatValue = useCallback((value: string): string => {
    switch (options.type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'number':
        return formatNumber(value);
      default:
        return value;
    }
  }, [options.type]);

  // Validação baseada no tipo
  const validateValue = useCallback((value: string): boolean => {
    switch (options.type) {
      case 'number':
      case 'currency':
      case 'percentage':
        const num = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
        if (isNaN(num)) return false;
        if (options.min !== undefined && num < options.min) return false;
        if (options.max !== undefined && num > options.max) return false;
        return true;
      case 'date':
        return !isNaN(Date.parse(value));
      default:
        return true;
    }
  }, [options.type, options.min, options.max]);

  return {
    inputRef,
    handleFocus,
    handleKeyDown,
    formatValue,
    validateValue,
  };
};

// Funções auxiliares de formatação
const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  const num = parseInt(numbers) / 100;
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatPercentage = (value: string): string => {
  const numbers = value.replace(/[^\d.,]/g, '');
  return numbers;
};

const formatNumber = (value: string): string => {
  return value.replace(/[^\d.,]/g, '');
};

// Parse functions
export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};

export const parsePercentage = (value: string): number => {
  return parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
};

export const parseNumber = (value: string): number => {
  return parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
};
