const { Router } = require('express');
const { store, storeVencedor, index, buscar, minhas } = require('../controllers/apostaController');

const router = Router();
router.post('/', store);
router.post('/vencedor', storeVencedor);
router.get('/usuario/:usuarioId', minhas);
router.get('/usuario/:usuarioId/:partidaId', buscar);
router.get('/:partidaId', index);

module.exports = router;
