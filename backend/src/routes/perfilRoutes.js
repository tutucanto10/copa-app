const { Router } = require('express');
const { show, apostas, update } = require('../controllers/perfilController');

const router = Router();
router.get('/:usuarioId', show);
router.get('/:usuarioId/apostas', apostas);
router.put('/:usuarioId', update);

module.exports = router;
