const express = require('express');
const router = express.Router();
const { obtenerNotas } = require('../controllers/notas.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/', verificarToken, obtenerNotas);

module.exports = router;