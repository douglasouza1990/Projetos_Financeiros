import React, { useState } from 'react';
import CurrentDataForm from './ui/CurrentDataForm';
import RetirementGoalsForm from './ui/RetirementGoalsForm';
import UncertaintyAnalysis from './UncertaintyAnalysis';
import ProjectionChart from './ProjectionChart';
import ContributionTable from './ContributionTable';
import type { UserData, ProjectionData, ContributionEntry } from '../types';

interface RetirementPlannerProps {
  userData: UserData;
  projectionData: ProjectionData | null;
  uncertaintyData: any;
  onUpdate: (field: keyof UserData, value: any) => void;
  onUncertaintyUpdate?: (field: string, value: number) => void;
}

const RetirementPlanner: React.FC<RetirementPlannerProps> = ({
  userData,
  projectionData,
  uncertaintyData,
  onUpdate,
  onUncertaintyUpdate
}) => {
  const [contributionSchedule, setContributionSchedule] = useState<ContributionEntry[]>([]);

  // Escutar evento de reset para limpar a tabela de contribuições
  React.useEffect(() => {
    const handleReset = (event: CustomEvent) => {
      setContributionSchedule([]);
    };

    window.addEventListener('resetAllData', handleReset as EventListener);
    
    return () => {
      window.removeEventListener('resetAllData', handleReset as EventListener);
    };
  }, []);
  return (
    <div className="space-y-8">
      {/* Gráfico em largura total no topo */}
      <div className="w-full">
        <ProjectionChart
          data={projectionData}
          uncertaintyData={uncertaintyData}
          userData={userData}
          contributionSchedule={contributionSchedule}
        />
      </div>

      {/* Formulários em coluna única */}
      <div className="space-y-6">
        <CurrentDataForm userData={userData} onUpdate={(data: UserData) => {
          // Update user data
          Object.keys(data).forEach(key => {
            onUpdate(key as keyof UserData, data[key as keyof UserData]);
          });
        }} />
        <RetirementGoalsForm userData={userData} onUpdate={(data: UserData) => {
          // Update user data
          Object.keys(data).forEach(key => {
            onUpdate(key as keyof UserData, data[key as keyof UserData]);
          });
        }} />
        <UncertaintyAnalysis 
          uncertainties={uncertaintyData}
          onUpdate={onUncertaintyUpdate || ((field: string, value: number) => {})} 
        />
      </div>

      {/* Tabela de contribuições */}
      <ContributionTable 
        schedule={contributionSchedule} 
        onUpdate={setContributionSchedule} 
        currentAge={userData.currentAge} 
      />
    </div>
  );
};

export default RetirementPlanner;

