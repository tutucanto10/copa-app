const { buscarComparativo } = require('../services/comparativoService')

async function index(req, res) {
  try {
    const { id1, id2 } = req.params
    const data = await buscarComparativo(id1, id2)
    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = { index }
