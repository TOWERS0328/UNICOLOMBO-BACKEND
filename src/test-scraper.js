require('dotenv').config();
const { obtenerNotasDesdePortal } = require('./src/services/scraper.service');

const USUARIO = 'juan.torres2';
const PASSWORD = 'JUAN.torres@302';

(async () => {
  console.log('Iniciando prueba del scraper...');
  try {
    const resultado = await obtenerNotasDesdePortal(USUARIO, PASSWORD);
    console.log('Resultado:', resultado);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();