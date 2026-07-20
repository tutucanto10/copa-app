const {
  listarLigas,
  criarLiga,
  adicionarMembro,
  removerMembro,
  rankingPorLiga,
  vencedorGeral,
  listarUsuarios,
  atualizarUsuario,
} = require('../services/ligaService');

async function index(req, res) {
  try {
    const ligas = await listarLigas();
    res.json(ligas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function store(req, res) {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome obrigatório' });
    const liga = await criarLiga(nome);
    res.status(201).json(liga);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addMembro(req, res) {
  try {
    const { usuarioId } = req.body;
    const { ligaId } = req.params;
    const membro = await adicionarMembro({ usuarioId, ligaId });
    res.status(201).json(membro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removeMembro(req, res) {
  try {
    const { usuarioId } = req.body;
    const { ligaId } = req.params;
    await removerMembro({ usuarioId, ligaId });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function ranking(req, res) {
  try {
    const { ligaId } = req.params;
    const result = await rankingPorLiga(ligaId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function usuarios(req, res) {
  try {
    const lista = await listarUsuarios();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUsuario(req, res) {
  try {
    const { nome, foto_url } = req.body;
    const usuario = await atualizarUsuario(req.params.id, { nome, foto_url });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function vencedor(req, res) {
  try {
    const result = await vencedorGeral();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { index, store, addMembro, removeMembro, ranking, vencedor, usuarios, updateUsuario };