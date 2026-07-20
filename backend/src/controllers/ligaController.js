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

async function resumoFinal(req, res) {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const prisma = require('../config/prisma');
    const ligas = await prisma.liga.findMany({
      where: { membros: { some: { usuarioId } } },
      orderBy: { id: 'asc' },
    });
    const resultado = [];
    for (const liga of ligas) {
      const { ranking } = await rankingPorLiga(liga.id);
      const minhaPos = ranking.findIndex(u => u.id === usuarioId);
      const eu = ranking[minhaPos];
      const venc = ranking[0];
      resultado.push({
        ligaNome: liga.nome,
        vencedor: { nome: venc.nome, pontos: venc.pontos },
        minha: { posicao: minhaPos + 1, pontos: eu?.pontos ?? 0 },
        total: ranking.length,
      });
    }
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { index, store, addMembro, removeMembro, ranking, vencedor, resumoFinal, usuarios, updateUsuario };