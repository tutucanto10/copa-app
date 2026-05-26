const { Router } = require('express');
const { index, show, jogadores, update, store, selecoes, updateSelecao } = require('../controllers/partidaController');

const router = Router();

router.get('/selecoes', selecoes);
router.put('/selecoes/:id', updateSelecao);
router.get('/', index);
router.post('/', store);
router.get('/:id', show);
router.put('/:id', update);
router.get('/:partidaId/jogadores', jogadores);

module.exports = router;