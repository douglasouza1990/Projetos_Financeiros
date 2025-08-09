// Script para gerar versão automática baseada em timestamp + build number
const fs = require('fs');
const path = require('path');

const generateVersion = () => {
  // Gerar timestamp no formato YYYYMMDD-HHMM
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  const timestamp = `${year}${month}${day}-${hour}${minute}`;
  
  // Tentar obter build number do environment (útil para CI/CD)
  const buildNumber = process.env.BUILD_NUMBER || 
                     process.env.GITHUB_RUN_NUMBER || 
                     Math.floor(Date.now() / 1000).toString().slice(-4); // últimos 4 dígitos do timestamp unix
  
  return `v${timestamp}.${buildNumber}`;
};

const version = generateVersion();
console.log(version);

// Exportar para usar em outros lugares se necessário
module.exports = { generateVersion };
