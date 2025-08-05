import React from 'react';
import { FileText, Info } from 'lucide-react';

interface TaxInformationProps {
  pensionType: string;
}

const TaxInformation: React.FC<TaxInformationProps> = ({ pensionType }) => {

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FileText className="h-5 w-5 text-teal-500 mr-2" />
        Informações Tributárias
      </h3>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Tipo Atual: {pensionType}</p>
            <p className="text-xs text-blue-600 mt-1">
              {pensionType === 'VGBL' 
                ? 'Tributação apenas sobre rendimentos' 
                : 'Possibilidade de dedução no IR até 12% da renda bruta'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxInformation;