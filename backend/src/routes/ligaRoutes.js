const { Router } = require('express');
const {
  index, store, addMembro, removeMembro, ranking, usuarios, updateUsuario,
} = require('../controllers/ligaController');

const router = Router();
router.get('/', index);
router.post('/', store);
router.get('/usuarios', usuarios);
router.put('/usuarios/:id', updateUsuario);
router.get('/:ligaId/ranking', ranking);
router.post('/:ligaId/membro', addMembro);
router.delete('/:ligaId/membro', removeMembro);

module.exports = router;