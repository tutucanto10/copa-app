const { Router } = require('express');
const { store, index } = require('../controllers/goleadorController');

const router = Router();
router.post('/', store);
router.get('/:usuarioId/:partidaId', index);

module.exports = router;