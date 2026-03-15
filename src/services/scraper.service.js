const puppeteer = require('puppeteer');
const { unicolomboUrl } = require('../config/app.config');

const NOTAS_URL = 'https://tronos.unicolombo.edu.co/unicolombo/tronos/core/student-management/note/364';

const obtenerNotasDesdePortal = async (usuario, password) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();

  try {
    console.log('[SCRAPER] Navegando al portal...');
    await page.goto(unicolomboUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    await page.waitForSelector('#username', { timeout: 15000 });
    await page.type('#username', usuario, { delay: 50 });
    await page.type('#password', password, { delay: 50 });
    await page.click('#kc-login');

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    console.log('[SCRAPER] Navegando a notas...');
    await page.goto(NOTAS_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    await new Promise(r => setTimeout(r, 6000));

    const datos = await page.evaluate(() => {
      const resultado = {
        estudiante: '',
        codigo: '',
        programa: '',
        promedioGeneral: '',
        periodos: []
      };

      const spans = document.querySelectorAll('app-student-note-list span');
      resultado.estudiante = spans[0]?.innerText?.trim() || '';
      resultado.codigo = spans[1]?.innerText?.trim() || '';
      resultado.programa = spans[2]?.innerText?.trim() || '';
      resultado.promedioGeneral = spans[3]?.innerText?.trim() || '';

      const items = document.querySelectorAll('.accordion__item');

      items.forEach(item => {
        const tituloPeriodo = item.querySelector('.accordion-st__title p')?.innerText?.trim() || '';

        const filas = item.querySelectorAll('tbody tr');
        const materias = [];

        filas.forEach(fila => {
          const celdas = fila.querySelectorAll('td');
          if (celdas.length > 0) {
            const materia = {};
            const headers = item.querySelectorAll('thead th');

            materia.codigo = celdas[0]?.innerText?.trim();
            materia.asignatura = celdas[1]?.innerText?.trim();
            materia.nivel = celdas[2]?.innerText?.trim();
            materia.grupo = celdas[3]?.innerText?.trim();
            materia.faltas = celdas[4]?.innerText?.trim();

            for (let i = 5; i < celdas.length; i++) {
              const header = headers[i]?.innerText?.trim();
              if (header) {
                materia[header] = celdas[i]?.innerText?.trim();
              }
            }

            materias.push(materia);
          }
        });

        resultado.periodos.push({
          titulo: tituloPeriodo,
          materias
        });
      });

      return resultado;
    });

    console.log('[SCRAPER] Datos extraídos');
    await browser.close();
    return datos;

  } catch (error) {
    await browser.close();
    throw new Error('Error en scraper: ' + error.message);
  }
};

module.exports = { obtenerNotasDesdePortal };