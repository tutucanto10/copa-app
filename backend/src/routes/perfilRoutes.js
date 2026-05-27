const { Router } = require('express');
const { show, apostas, update, foto } = require('../controllers/perfilController');

const router = Router();
router.get('/:usuarioId', show);
router.get('/:usuarioId/foto', foto);
router.get('/:usuarioId/apostas', apostas);
router.put('/:usuarioId', update);

module.exports = router;
