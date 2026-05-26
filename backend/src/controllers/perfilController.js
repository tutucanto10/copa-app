const { buscarPerfil, atualizarPerfil } = require('../services/perfilService');

async function show(req, res) {
  try {
    const perfil = await buscarPerfil(req.params.usuarioId);
    res.json(perfil);
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

module.exports = { show, update };