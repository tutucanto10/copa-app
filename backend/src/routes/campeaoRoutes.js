const { Router } = require('express')
const { store, minha, todas } = require('../controllers/campeaoController')

const router = Router()
router.post('/', store)
router.get('/todas', todas)
router.get('/:usuarioId', minha)

module.exports = router
