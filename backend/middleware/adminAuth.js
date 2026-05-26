const jwt = require('jsonwebtoken')

// Senha do admin (MUDE AQUI PARA SUA SENHA FORTE!)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Copa@#Admin!'
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-ultra-seguro-copa-2026-jwt-token-xyz'

// Middleware para verificar se é admin
function verificarAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado - Admin apenas' })
    }
    
    req.admin = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

// Rota de login admin
function loginAdmin(req, res) {
  const { senha } = req.body

  if (senha !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' })
  }

  // Gerar token JWT válido por 24 horas
  const token = jwt.sign(
    { role: 'admin', loginAt: new Date() },
    JWT_SECRET,
    { expiresIn: '24h' }
  )

  res.json({ 
    success: true, 
    token,
    message: 'Login admin realizado com sucesso'
  })
}

module.exports = { verificarAdmin, loginAdmin }
