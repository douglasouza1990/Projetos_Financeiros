import React from 'react';

const Banner: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-teal-600 to-teal-800 overflow-hidden rounded-lg mx-4 mt-4" style={{ height: '190px' }}>
      {/* Imagem de fundo com overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><defs><linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:%2306b6d4;stop-opacity:0.3"/><stop offset="100%" style="stop-color:%230d9488;stop-opacity:0.3"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23overlay)"/><g opacity="0.4"><path d="M100 150 Q 200 100 300 150 T 500 150" stroke="%23ffffff" stroke-width="2" fill="none"/><path d="M600 200 Q 700 150 800 200 T 1000 200" stroke="%23ffffff" stroke-width="2" fill="none"/><circle cx="200" cy="250" r="40" fill="%23ffffff" opacity="0.3"/><circle cx="800" cy="180" r="30" fill="%23ffffff" opacity="0.3"/><path d="M0 350 Q 300 300 600 350 T 1200 350 L 1200 400 L 0 400 Z" fill="%23ffffff" opacity="0.2"/></g></svg>')`,
        }}
      />
      
      {/* Conteúdo sobreposto */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Planejamento de<br />
              Aposentadoria
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Projete seu futuro financeiro com precisão e segurança. 
              Ferramenta completa para calcular e otimizar sua aposentadoria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner; 