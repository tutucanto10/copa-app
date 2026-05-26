const { login, cadastro } = require('../services/authService');

async function loginHandler(req, res) {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome obrigatório' });
    const result = await login(nome);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function cadastroHandler(req, res) {
  try {
    const { nome, foto_url } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome obrigatório' });
    const result = await cadastro({ nome, foto_url });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { loginHandler, cadastroHandler };