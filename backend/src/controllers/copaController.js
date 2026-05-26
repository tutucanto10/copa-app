const {
  buscarClassificacao,
  buscarArtilheiros,
  buscarAssistencias,
  buscarPartidasDoDia,
} = require('../services/copaService')

async function classificacao(req, res) {
  try {
    const dados = await buscarClassificacao()
    res.json(dados)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function artilheiros(req, res) {
  try {
    const { limit = 5 } = req.query
    const dados = await buscarArtilheiros(parseInt(limit))
    res.json(dados)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function assistencias(req, res) {
  try {
    const { limit = 5 } = req.query
    const dados = await buscarAssistencias(parseInt(limit))
    res.json(dados)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function partidasDoDia(req, res) {
  try {
    const partidas = await buscarPartidasDoDia()
    res.json(partidas)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { classificacao, artilheiros, assistencias, partidasDoDia }
