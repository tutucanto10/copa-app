const express = require('express')
const router = express.Router()
const { classificacao, artilheiros, assistencias, partidasDoDia } = require('../controllers/copaController')

router.get('/classificacao', classificacao)
router.get('/artilheiros', artilheiros)
router.get('/assistencias', assistencias)
router.get('/partidas-do-dia', partidasDoDia)

module.exports = router
