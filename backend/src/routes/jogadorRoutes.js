const { Router } = require('express')
const { index, porPartida, store, update, destroy } = require('../controllers/jogadorController')

const router = Router()
router.get('/', index)
router.get('/partida/:partidaId', porPartida)
router.post('/', store)
router.put('/:id', update)
router.delete('/:id', destroy)

module.exports = router