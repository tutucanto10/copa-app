const { mvpPorUsuario } = require('../services/mvpService');

async function index(req, res) {
  try {
    const { usuarioId } = req.query;
    if (!usuarioId) return res.json([]);
    const data = await mvpPorUsuario(Number(usuarioId));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { index };
