import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Trash2 } from 'lucide-react';
import type { UserData, ProjectionData, ContributionEntry } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProjectionChartProps {
  userData: UserData;
  data: ProjectionData | null;
  uncertaintyData: any;
  contributionSchedule?: ContributionEntry[];
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ userData, data, uncertaintyData, contributionSchedule = [] }) => {
  // Gerar dados de projeção baseados nos dados do usuário
  const generateProjectionData = () => {
    const years = [];
    const values = [];
    const pessimisticValues = [];
    const optimisticValues = [];
    
    const currentValue = userData.initialAccumulation;
    const returnRate = userData.realReturnRate / 100;
    
    let accumulatedValue = currentValue;
    let pessimisticValue = currentValue;
    let optimisticValue = currentValue;
    
    for (let year = 0; year <= (90 - userData.currentAge); year++) {
      const age = userData.currentAge + year;
      years.push(age);
      
      // ===== ADICIONAR VALORES ATUAIS AOS ARRAYS PRIMEIRO =====
      values.push(accumulatedValue);
      pessimisticValues.push(pessimisticValue);
      optimisticValues.push(optimisticValue);
      
      // Encontrar contribuição específica para este ano, se existir
      const specificContribution = contributionSchedule.find(entry => entry.year === year + 1);
      const baseAnnualContribution = specificContribution ? specificContribution.monthlyAmount : userData.annualContribution;
      
      // Verificar se a pessoa já se aposentou
      const isRetired = age >= userData.retirementAge;
      
      // ===== CÁLCULOS MATEMATICAMENTE CORRETOS =====
      
      // 1. CENÁRIO BASE
      let baseCashFlow = baseAnnualContribution;
      if (isRetired) {
        baseCashFlow = baseCashFlow + (userData.extraMonthlyIncome * 12) - (userData.monthlyBenefit * 12);
      }
      accumulatedValue = accumulatedValue + baseCashFlow + (accumulatedValue * returnRate);
      
      // 2. CENÁRIO PESSIMISTA (tudo pior para o investidor)
      const pessimisticContribution = baseAnnualContribution * (1 - uncertaintyData.annualContribution / 100);
      const pessimisticReturn = returnRate * (1 - uncertaintyData.returnRate / 100);
      const pessimisticExtraIncome = userData.extraMonthlyIncome * (1 - uncertaintyData.extraIncome / 100);
      // IMPORTANTE: Mais incerteza no benefício = MAIS gastos (pior cenário)
      const pessimisticBenefit = userData.monthlyBenefit * (1 + uncertaintyData.monthlyBenefit / 100);
      
      let pessimisticCashFlow = pessimisticContribution;
      if (isRetired) {
        pessimisticCashFlow = pessimisticCashFlow + (pessimisticExtraIncome * 12) - (pessimisticBenefit * 12);
      }
      pessimisticValue = pessimisticValue + pessimisticCashFlow + (pessimisticValue * pessimisticReturn);
      
      // 3. CENÁRIO OTIMISTA (tudo melhor para o investidor)
      const optimisticContribution = baseAnnualContribution * (1 + uncertaintyData.annualContribution / 100);
      const optimisticReturn = returnRate * (1 + uncertaintyData.returnRate / 100);
      const optimisticExtraIncome = userData.extraMonthlyIncome * (1 + uncertaintyData.extraIncome / 100);
      // IMPORTANTE: Menos incerteza no benefício = MENOS gastos (melhor cenário)
      const optimisticBenefit = userData.monthlyBenefit * (1 - uncertaintyData.monthlyBenefit / 100);
      
      let optimisticCashFlow = optimisticContribution;
      if (isRetired) {
        optimisticCashFlow = optimisticCashFlow + (optimisticExtraIncome * 12) - (optimisticBenefit * 12);
      }
      optimisticValue = optimisticValue + optimisticCashFlow + (optimisticValue * optimisticReturn);
      
      // ===== GARANTIR CONSISTÊNCIA QUANDO NÃO HÁ INCERTEZAS =====
      if (uncertaintyData.annualContribution === 0 && 
          uncertaintyData.returnRate === 0 && 
          uncertaintyData.extraIncome === 0 &&
          uncertaintyData.monthlyBenefit === 0) {
        pessimisticValue = accumulatedValue;
        optimisticValue = accumulatedValue;
      }
    }
    
    return { years, values, pessimisticValues, optimisticValues };
  };

  const projectionData = generateProjectionData();
  
  // Função para validar os cálculos de limite inferior e superior
  const validateLimits = () => {
    try {
      if (!hasUncertainties) return;
      
      const lastIndex = projectionData.values.length - 1;
      if (lastIndex < 0) return;
      
      const baseValue = projectionData.values[lastIndex];
      const pessimisticValue = projectionData.pessimisticValues[lastIndex];
      const optimisticValue = projectionData.optimisticValues[lastIndex];
      
      console.log('🔍 Validação Matemática dos Limites:', {
        valorBase: baseValue?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        limiteInferior: pessimisticValue?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        limiteSuperior: optimisticValue?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        diferencaInferior: baseValue ? ((pessimisticValue - baseValue) / baseValue * 100).toFixed(2) + '%' : 'N/A',
        diferencaSuperior: baseValue ? ((optimisticValue - baseValue) / baseValue * 100).toFixed(2) + '%' : 'N/A',
        incertezas: uncertaintyData
      });
      
      // Verificações de consistência matemática
      const isValid = {
        pessimisticLower: pessimisticValue <= baseValue,
        optimisticHigher: optimisticValue >= baseValue,
        orderCorrect: pessimisticValue <= baseValue && baseValue <= optimisticValue
      };
      
      if (!isValid.pessimisticLower) {
        console.error('❌ ERRO: Limite inferior maior que valor base!');
      }
      if (!isValid.optimisticHigher) {
        console.error('❌ ERRO: Limite superior menor que valor base!');
      }
      if (isValid.orderCorrect) {
        console.log('✅ Ordem dos cenários matematicamente correta');
      } else {
        console.error('❌ ERRO: Ordem dos cenários incorreta');
      }
      
      return isValid;
    } catch (error) {
      console.error('Erro na validação dos limites:', error);
      return false;
    }
  };
  
  // Executar validação
  const validationResult = validateLimits();
  
  // Função para gerar cores com transição suave baseada na idade de aposentadoria
  const generateColorsWithTransition = (values: number[], retirementAge: number, currentAge: number) => {
    return values.map((value: number, index: number) => {
      const age = currentAge + index;
      const isNegative = value < 0;
      
      // Cores base
      const preRetirementColor = 'rgb(20, 184, 166)'; // teal
      const postRetirementColor = 'rgb(59, 130, 246)'; // blue
      const negativeColor = 'rgb(239, 68, 68)'; // red
      
      // Se o valor é negativo, sempre vermelho
      if (isNegative) {
        return negativeColor;
      }
      
      // Se ainda não chegou na idade de aposentadoria
      if (age < retirementAge) {
        return preRetirementColor;
      }
      
      // Se já passou da idade de aposentadoria, usar cor pós-aposentadoria
      return postRetirementColor;
    });
  };
  
  // Calcular valores para os cards de resumo
  const finalWealth = projectionData.values[projectionData.values.length - 1];
  const monthlyIncome = finalWealth * 0.005; // 0.5% ao mês
  const yearsToRetirement = userData.retirementAge - userData.currentAge;

  // Verificar se há incertezas configuradas
  const hasUncertainties = (uncertaintyData && (
    uncertaintyData.annualContribution > 0 || 
    uncertaintyData.returnRate > 0 || 
    uncertaintyData.extraIncome > 0 ||
    uncertaintyData.monthlyBenefit > 0
  ));

  // Criar datasets segmentados para cores contínuas
  const createSegmentedDatasets = () => {
    const datasets = [];
    
    // Área sombreada primeiro (se há incertezas)
    if (hasUncertainties) {
      datasets.push({
        label: 'Limite Inferior',
        data: projectionData.pessimisticValues,
        borderColor: 'rgba(239, 68, 68, 0.5)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [5, 5],
      }, {
        label: 'Limite Superior',
        data: projectionData.optimisticValues,
        borderColor: 'rgba(34, 197, 94, 0.5)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: '-1',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [5, 5],
      });
    }
    
    // Dividir dados em segmentos contínuos por cor
    let currentSegment: { values: number[], ages: number[], color: string } | null = null;
    const segments: { values: number[], ages: number[], color: string }[] = [];
    
    projectionData.values.forEach((value, index) => {
      const age = userData.currentAge + index;
      const isNegative = value < 0;
      
      // Determinar cor baseada na mesma lógica da tabela
      let color: string;
      if (isNegative) {
        color = 'rgb(220, 38, 38)'; // red-600
      } else if (age >= userData.retirementAge) {
        color = 'rgb(37, 99, 235)'; // blue-600
      } else {
        color = 'rgb(13, 148, 136)'; // teal-600
      }
      
      // Se é o primeiro ponto ou a cor mudou, criar novo segmento
      if (!currentSegment || currentSegment.color !== color) {
        if (currentSegment) {
          segments.push(currentSegment);
        }
        currentSegment = { values: [value], ages: [age], color };
      } else {
        // Adicionar ao segmento atual
        currentSegment.values.push(value);
        currentSegment.ages.push(age);
      }
    });
    
    // Adicionar o último segmento
    if (currentSegment) {
      segments.push(currentSegment);
    }
    
    // Criar datasets para cada segmento
    segments.forEach((segment, index) => {
      // Criar array de dados com nulls para conectar segmentos
      const dataWithNulls = new Array(projectionData.values.length).fill(null);
      
      // Preencher apenas os valores do segmento atual
      segment.ages.forEach((age, ageIndex) => {
        const dataIndex = age - userData.currentAge;
        if (dataIndex >= 0 && dataIndex < dataWithNulls.length) {
          dataWithNulls[dataIndex] = segment.values[ageIndex];
        }
      });
      
      datasets.push({
        label: index === 0 ? 'Saldo Acumulado' : '',
        data: dataWithNulls,
        borderColor: segment.color,
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 3,
        pointBackgroundColor: segment.color,
        pointBorderColor: segment.color,
      });
    });
    
    return datasets;
  };

  const chartData = {
    labels: projectionData.years.map(age => `${age} anos`),
    datasets: createSegmentedDatasets(),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: hasUncertainties, // Mostrar legenda apenas quando há incertezas
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            let formattedValue;
            if (value >= 1000000) {
              formattedValue = `R$ ${(value / 1000000).toFixed(2)}M`;
            } else if (value >= 1000) {
              formattedValue = `R$ ${(value / 1000).toFixed(1)}K`;
            } else {
              formattedValue = `R$ ${value.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`;
            }
            return `${context.dataset.label}: ${formattedValue}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Patrimônio (R$)',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        },
        ticks: {
          callback: function(value: any) {
            if (value >= 1000000) {
              return `R$ ${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `R$ ${(value / 1000).toFixed(0)}K`;
            } else {
              return `R$ ${value.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`;
            }
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Idade',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Projeção de Aposentadoria</h2>
        

        
        <button
          onClick={() => {
            // Resetar todos os valores para os padrões
            if (window.confirm('Tem certeza que deseja limpar todos os dados?')) {
              // Resetar dados do usuário
              const resetUserData = {
                currentAge: 0,
                retirementAge: 0,
                initialAccumulation: 0,
                annualContribution: 0,
                realReturnRate: 0,
                monthlyBenefit: 0,
                extraMonthlyIncome: 0,
                initialDate: new Date().toISOString().split('T')[0]
              };
              
              // Resetar incertezas
              const resetUncertainties = {
                returnRate: 0,
                annualContribution: 0,
                extraIncome: 0,
                monthlyBenefit: 0
              };
              
              // Resetar tabela de contribuições
              const resetContributionSchedule: ContributionEntry[] = [];
              
              // Disparar eventos para atualizar os componentes
              window.dispatchEvent(new CustomEvent('resetAllData', {
                detail: {
                  userData: resetUserData,
                  uncertainties: resetUncertainties,
                  contributionSchedule: resetContributionSchedule
                }
              }));
            }
          }}
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          title="Limpar todos os dados"
        >
          <Trash2 className="h-4 w-4" />
          <span>Limpar Dados</span>
        </button>
      </div>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-teal-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-teal-700 mb-1">Patrimônio na Aposentadoria</h3>
          <div className="text-2xl font-bold text-teal-800">
            {finalWealth >= 1000000 
              ? `R$ ${(finalWealth / 1000000).toFixed(1)}M`
              : finalWealth >= 1000 
                ? `R$ ${(finalWealth / 1000).toFixed(0)}K`
                : `R$ ${finalWealth.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
            }
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-blue-700 mb-1">Renda Mensal Projetada</h3>
          <div className="text-2xl font-bold text-blue-800">
            {monthlyIncome >= 1000000 
              ? `R$ ${(monthlyIncome / 1000000).toFixed(2)}M`
              : monthlyIncome >= 1000 
                ? `R$ ${(monthlyIncome / 1000).toFixed(1)}K`
                : `R$ ${monthlyIncome.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
            }
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-green-700 mb-1">Anos até Aposentadoria</h3>
          <div className="text-2xl font-bold text-green-800">
            {yearsToRetirement}
          </div>
        </div>
      </div>
      
      {/* Gráfico e Tabela lado a lado */}
      <div className="flex gap-6">
        {/* Gráfico */}
        <div className="flex-1 h-[500px]">
          <Line data={chartData} options={options} />
        </div>
        
        {/* Tabela de Dados */}
        <div className="w-80 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados da Projeção</h3>
          <div className="overflow-y-auto max-h-[450px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-medium text-gray-700">Idade</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-700">Patrimônio</th>
                  {hasUncertainties && (
                    <>
                      <th className="text-right py-2 px-2 font-medium text-red-600">Limite Inf.</th>
                      <th className="text-right py-2 px-2 font-medium text-green-600">Limite Sup.</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {projectionData.years.map((age, index) => {
                  const value = projectionData.values[index];
                  const pessimisticValue = projectionData.pessimisticValues[index];
                  const optimisticValue = projectionData.optimisticValues[index];
                  
                  const formatValue = (val: number) => {
                    if (val >= 1000000) {
                      return `R$ ${(val / 1000000).toFixed(2)}M`;
                    } else if (val >= 1000) {
                      return `R$ ${(val / 1000).toFixed(1)}K`;
                    } else {
                      return `R$ ${val.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`;
                    }
                  };
                  
                  const formattedValue = formatValue(value);
                  const formattedPessimistic = hasUncertainties ? formatValue(pessimisticValue) : '';
                  const formattedOptimistic = hasUncertainties ? formatValue(optimisticValue) : '';
                  
                  // Determinar a cor baseada na idade e valor
                  let textColor = 'text-gray-800';
                  if (value < 0) {
                    textColor = 'text-red-600';
                  } else if (age >= userData.retirementAge) {
                    textColor = 'text-blue-600';
                  } else {
                    textColor = 'text-teal-600';
                  }
                  
                  return (
                    <tr key={age} className="border-b border-gray-100 hover:bg-gray-100">
                      <td className="py-2 px-2 text-gray-600">{age} anos</td>
                      <td className={`py-2 px-2 text-right font-medium ${textColor}`}>{formattedValue}</td>
                      {hasUncertainties && (
                        <>
                          <td className="py-2 px-2 text-right text-red-600 text-sm">{formattedPessimistic}</td>
                          <td className="py-2 px-2 text-right text-green-600 text-sm">{formattedOptimistic}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionChart;
