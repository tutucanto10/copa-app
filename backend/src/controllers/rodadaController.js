const { listarRodadas, criarRodada } = require('../services/rodadaService');

async function index(req, res) {
  try {
    const rodadas = await listarRodadas();
    res.json(rodadas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function store(req, res) {
  try {
    const { numero, dataJogo } = req.body;
    if (!numero || !dataJogo) {
      return res.status(400).json({ error: 'Campos obrigatórios: numero, dataJogo (YYYY-MM-DD)' });
    }
    const rodada = await criarRodada({ numero: Number(numero), dataJogo });
    res.status(201).json(rodada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { index, store };
