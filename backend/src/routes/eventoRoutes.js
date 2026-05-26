const { Router } = require('express');
const { index, store } = require('../controllers/eventoController');

const router = Router();
router.get('/:partidaId', index);
router.post('/', store);

module.exports = router;