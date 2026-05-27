const { salvarSubscription, notificarTodos } = require('../services/pushService');

async function subscribe(req, res) {
  try {
    const { usuarioId, subscription } = req.body;
    if (!usuarioId || !subscription) return res.status(400).json({ error: 'Dados inválidos' });
    await salvarSubscription(usuarioId, subscription);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function publicKey(req, res) {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
}

async function notificar(req, res) {
  try {
    const { titulo, corpo, url } = req.body;
    const resultado = await notificarTodos(titulo, corpo, url);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { subscribe, publicKey, notificar };
