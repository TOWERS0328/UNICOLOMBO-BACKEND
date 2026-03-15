const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/app.config');

const login = (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  const token = jwt.sign({ usuario, password }, jwtSecret, { expiresIn: '8h' });

  res.json({ token });
};

module.exports = { login };