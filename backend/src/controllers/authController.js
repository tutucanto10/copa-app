const { login, cadastro, definirSenha, verificarToken } = require('../services/authService');

async function loginHandler(req, res) {
  try {
    const { nome, senha } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome obrigatório' });
    const result = await login(nome, senha);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function cadastroHandler(req, res) {
  try {
    const { nome, foto_url, senha } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome obrigatório' });
    const result = await cadastro({ nome, foto_url, senha });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function definirSenhaHandler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Não autenticado' });
    const token = authHeader.replace('Bearer ', '');
    const payload = await verificarToken(token);
    const { senha } = req.body;
    if (!senha) return res.status(400).json({ error: 'Senha obrigatória' });
    await definirSenha(payload.id, senha);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { loginHandler, cadastroHandler, definirSenhaHandler };
