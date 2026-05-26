const { criarAposta, salvarVencedor, buscarApostaUsuario, listarApostas, listarApostasUsuario } = require('../services/apostaService');

async function store(req, res) {
  try {
    const { usuarioId, partidaId, placarCasa, placarFora } = req.body;
    if (!usuarioId || !partidaId || placarCasa === undefined || placarFora === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    const aposta = await criarAposta({ usuarioId, partidaId, placarCasa, placarFora });
    res.status(201).json(aposta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function storeVencedor(req, res) {
  try {
    const { usuarioId, partidaId, vencedor } = req.body;
    if (!usuarioId || !partidaId || !vencedor) {
      return res.status(400).json({ error: 'Campos obrigatórios: usuarioId, partidaId, vencedor' });
    }
    const aposta = await salvarVencedor({ usuarioId, partidaId, vencedor });
    res.status(201).json(aposta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function index(req, res) {
  try {
    const apostas = await listarApostas(req.params.partidaId);
    res.json(apostas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function buscar(req, res) {
  try {
    const { usuarioId, partidaId } = req.params;
    const aposta = await buscarApostaUsuario({ usuarioId, partidaId });
    res.json(aposta || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function minhas(req, res) {
  try {
    const apostas = await listarApostasUsuario(req.params.usuarioId);
    res.json(apostas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { store, storeVencedor, index, buscar, minhas };