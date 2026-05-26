const { salvarApostasGoleador, buscarApostasGoleador } = require('../services/goleadorService');

async function store(req, res) {
  try {
    const { usuarioId, partidaId, jogadorIds } = req.body;
    if (!usuarioId || !partidaId || !jogadorIds?.length) {
      return res.status(400).json({ error: 'Campos obrigatórios: usuarioId, partidaId, jogadorIds[]' });
    }
    const result = await salvarApostasGoleador({ usuarioId, partidaId, jogadorIds });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function index(req, res) {
  try {
    const { usuarioId, partidaId } = req.params;
    const apostas = await buscarApostasGoleador({ usuarioId, partidaId });
    res.json(apostas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { store, index };