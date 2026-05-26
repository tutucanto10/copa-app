const { listarEventos, criarEvento } = require('../services/eventoService');

async function index(req, res) {
  try {
    const eventos = await listarEventos(req.params.partidaId);
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function store(req, res) {
  try {
    const { partidaId, jogadorId, tipo, minuto } = req.body;
    if (!partidaId || !jogadorId || !tipo || minuto === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios: partidaId, jogadorId, tipo, minuto' });
    }
    const evento = await criarEvento({ partidaId, jogadorId, tipo, minuto });
    res.status(201).json(evento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { index, store };