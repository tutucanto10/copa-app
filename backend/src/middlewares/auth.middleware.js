const { verificarToken } = require('../services/authService');

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = await verificarToken(token);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function adminMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = await verificarToken(token);
    if (!decoded.isAdmin) return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = { authMiddleware, adminMiddleware };