const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/app.config');

const login = (req, res) => {
  console.log('[LOGIN] Body recibido:', req.body);
  console.log('[LOGIN] jwtSecret:', jwtSecret ? 'OK' : 'UNDEFINED');
  
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  try {
    const token = jwt.sign({ usuario, password }, jwtSecret, { expiresIn: '8h' });
    console.log('[LOGIN] Token generado OK');
    res.json({ token });
  } catch (err) {
    console.error('[LOGIN] Error al generar token:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login };