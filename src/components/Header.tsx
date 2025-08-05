import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            🥗 Plano Alimentar Personalizado
          </h1>
          <p className="text-green-100 text-lg">
            Acompanhe suas metas nutricionais e mantenha uma alimentação equilibrada
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;