const { Router } = require('express');
const { show, update } = require('../controllers/perfilController');

const router = Router();
router.get('/:usuarioId', show);
router.put('/:usuarioId', update);

module.exports = router;