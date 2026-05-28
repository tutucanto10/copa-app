const { salvarAposta, buscarMinha, listarTodas } = require('../services/campeaoService')

async function store(req, res) {
  try {
    const { usuarioId, selecaoId } = req.body
    if (!usuarioId || !selecaoId) return res.status(400).json({ error: 'usuarioId e selecaoId são obrigatórios' })
    const aposta = await salvarAposta(usuarioId, selecaoId)
    res.json(aposta)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function minha(req, res) {
  try {
    const aposta = await buscarMinha(req.params.usuarioId)
    res.json(aposta || null)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function todas(req, res) {
  try {
    const apostas = await listarTodas()
    res.json(apostas)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { store, minha, todas }
