import React, { useState } from 'react';
import Banner from './components/Banner';
import RetirementPlanner from './components/RetirementPlanner';
import VersionInfo from './components/VersionInfo';
import type { UserData, ProjectionData } from './types';

function App() {
  const [userData, setUserData] = useState<UserData>({
    currentAge: 0,
    retirementAge: 0,
    initialAccumulation: 0,
    annualContribution: 0,
    realReturnRate: 0,
    monthlyBenefit: 0,
    extraMonthlyIncome: 0,
    initialDate: new Date().toISOString().split('T')[0]
  });

  const [uncertaintyData, setUncertaintyData] = useState({
    returnRate: 0,
    annualContribution: 0,
    extraIncome: 0,
    monthlyBenefit: 0
  });

  const [projectionData, setProjectionData] = useState<ProjectionData | null>(null);

  // Escutar evento de reset para limpar todos os dados
  React.useEffect(() => {
    const handleReset = (event: CustomEvent) => {
      const { userData: resetUserData, uncertainties: resetUncertainties } = event.detail;
      setUserData(resetUserData);
      setUncertaintyData(resetUncertainties);
    };

    window.addEventListener('resetAllData', handleReset as EventListener);
    
    return () => {
      window.removeEventListener('resetAllData', handleReset as EventListener);
    };
  }, []);

  // Calcular projeção sempre que houver mudanças
  React.useEffect(() => {
    const calculateProjection = () => {
      const years = [];
      const values = [];
      const currentValue = userData.initialAccumulation;
      const returnRate = userData.realReturnRate / 100;
      
      let accumulatedValue = currentValue;
      
      for (let year = 0; year <= (90 - userData.currentAge); year++) {
        const age = userData.currentAge + year;
        years.push(age);
        
        // Verificar se a pessoa já se aposentou
        const isRetired = age >= userData.retirementAge;
        
        // Calcular renda total anual
        let totalAnnualIncome = userData.annualContribution;
        
        // A partir da aposentadoria, adicionar renda mensal extra e subtrair benefício mensal
        if (isRetired) {
          totalAnnualIncome = totalAnnualIncome + (userData.extraMonthlyIncome * 12) - (userData.monthlyBenefit * 12);
        }
        
        // Aplicar juros compostos
        const newValue = accumulatedValue + totalAnnualIncome + (accumulatedValue * returnRate);
        
        values.push(accumulatedValue);
        accumulatedValue = newValue;
      }
      
      return { years, values };
    };

    setProjectionData(calculateProjection());
  }, [userData]);

  const handleUpdate = (field: keyof UserData, value: any) => {
    setUserData((prev: UserData) => ({ ...prev, [field]: value }));
  };

  const handleUncertaintyUpdate = (field: string, value: number) => {
    setUncertaintyData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />
      <div className="max-w-7xl mx-auto p-6">
        <RetirementPlanner
          userData={userData}
          projectionData={projectionData}
          uncertaintyData={uncertaintyData}
          onUpdate={handleUpdate}
          onUncertaintyUpdate={handleUncertaintyUpdate}
        />
      </div>
      <VersionInfo />
    </div>
  );
}

export default App;