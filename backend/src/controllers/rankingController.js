const { calcularRanking } = require('../services/rankingService');

async function index(req, res) {
  try {
    const ranking = await calcularRanking();
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { index };