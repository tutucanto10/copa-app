const { buscarPerfil, atualizarPerfil, buscarApostasUsuario } = require('../services/perfilService');
const prisma = require('../config/prisma');

async function show(req, res) {
  try {
    const perfil = await buscarPerfil(req.params.usuarioId);
    res.json(perfil);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function apostas(req, res) {
  try {
    const resultado = await buscarApostasUsuario(req.params.usuarioId);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const { nome, foto_url } = req.body;
    const usuario = await atualizarPerfil(req.params.usuarioId, { nome, foto_url });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function foto(req, res) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.params.usuarioId) },
      select: { foto_url: true },
    });
    res.json({ foto_url: usuario?.foto_url || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function buscar(req, res) {
  const q = (req.query.q || '').trim()
  if (q.length < 2) return res.json([])
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { nome: { contains: q, mode: 'insensitive' } },
      select: { id: true, nome: true },
      take: 8,
    })
    res.json(usuarios)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { show, apostas, update, foto, buscar };
