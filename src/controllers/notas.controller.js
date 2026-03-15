const { obtenerNotasDesdePortal } = require('../services/scraper.service');

const obtenerNotas = async (req, res, next) => {
  try {
    const { usuario, password } = req.user;
    const notas = await obtenerNotasDesdePortal(usuario, password);
    console.log('[NOTAS]', JSON.stringify(notas, null, 2));
    res.json({ notas });
  } catch (error) {
    next(error);
  }
};

module.exports = { obtenerNotas };