const { Router } = require('express')
const { index } = require('../controllers/comparativoController')

const router = Router()
router.get('/:id1/:id2', index)

module.exports = router
