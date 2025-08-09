import React, { useState } from 'react';

const VersionInfo: React.FC = () => {
  // Versão gerada automaticamente a cada build
  const version = __APP_VERSION__;
  const [showDetails, setShowDetails] = useState(false);
  
  // Extrair informações da versão
  const versionParts = version.replace('v', '').split('.');
  const timestamp = versionParts[0] || '';
  const buildNumber = versionParts[1] || '';
  
  // Formatar timestamp para exibição
  const formatTimestamp = (ts: string) => {
    if (ts.length >= 13) {
      const date = ts.substring(0, 8);
      const time = ts.substring(9, 13);
      const formattedDate = `${date.substring(6, 8)}/${date.substring(4, 6)}/${date.substring(0, 4)}`;
      const formattedTime = `${time.substring(0, 2)}:${time.substring(2, 4)}`;
      return `${formattedDate} ${formattedTime}`;
    }
    return ts;
  };
  
  return (
    <div 
      className="fixed bottom-2 right-2 text-xs text-gray-400 transition-all duration-200 z-50"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className={`
        bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-gray-200/50
        ${showDetails ? 'opacity-100 transform scale-105' : 'opacity-60 hover:opacity-100'}
        transition-all duration-200 cursor-default
      `}>
        <div className="flex items-center gap-1">
          <span className="text-green-500">●</span>
          <span className="font-mono">{version}</span>
        </div>
        
        {showDetails && (
          <div className="mt-1 pt-1 border-t border-gray-200/50 text-xs text-gray-500">
            <div>Deploy: {formatTimestamp(timestamp)}</div>
            <div>Build: #{buildNumber}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionInfo;
