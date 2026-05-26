const prisma = require('../config/prisma');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'bolao_secret_2024';

async function login(nome) {
  let usuario = await prisma.usuario.findUnique({ where: { nome } });

  if (!usuario) {
    throw new Error('Usuário não encontrado. Faça o cadastro primeiro.');
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, isAdmin: usuario.isAdmin },
    SECRET,
    { expiresIn: '7d' }
  );

  return { token, usuario };
}

async function cadastro({ nome, foto_url }) {
  const existe = await prisma.usuario.findUnique({ where: { nome } });
  if (existe) throw new Error('Esse nome já está em uso. Escolha outro.');

  const usuario = await prisma.usuario.create({
    data: { nome, foto_url: foto_url || null },
  });

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, isAdmin: usuario.isAdmin },
    SECRET,
    { expiresIn: '7d' }
  );

  return { token, usuario };
}

async function verificarToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    throw new Error('Token inválido ou expirado.');
  }
}

module.exports = { login, cadastro, verificarToken };