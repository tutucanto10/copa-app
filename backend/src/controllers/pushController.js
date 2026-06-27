const { salvarSubscription, notificarTodos, notificarUsuario } = require('../services/pushService');

async function subscribe(req, res) {
  try {
    const { usuarioId, subscription } = req.body;
    if (!usuarioId || !subscription) return res.status(400).json({ error: 'Dados inválidos' });
    await salvarSubscription(usuarioId, subscription);
    await notificarUsuario(usuarioId, '🔔 Notificações ativas!', 'Você receberá aviso 2h antes do jogo e alerta quando faltar 30min para fechar.', '/');
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
