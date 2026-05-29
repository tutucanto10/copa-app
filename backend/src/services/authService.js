const prisma = require('../config/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { uploadFoto } = require('../config/supabase');

const SECRET = process.env.JWT_SECRET;

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, isAdmin: usuario.isAdmin },
    SECRET,
    { expiresIn: '7d' }
  );
}

async function login(nome, senha) {
  const usuario = await prisma.usuario.findUnique({ where: { nome } });
  if (!usuario) throw new Error('Usuário não encontrado. Verifique o nome.');

  if (usuario.senha) {
    if (!senha) throw new Error('Digite sua senha.');
    const ok = await bcrypt.compare(senha, usuario.senha);
    if (!ok) throw new Error('Senha incorreta.');
  }

  const token = gerarToken(usuario);
  return { token, usuario, precisaCriarSenha: !usuario.senha };
}

async function cadastro({ nome, foto_url, senha }) {
  const existe = await prisma.usuario.findUnique({ where: { nome } });
  if (existe) throw new Error('Esse nome já está em uso. Escolha outro.');

  if (!senha) throw new Error('Senha obrigatória.');
  const hash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: { nome, senha: hash, foto_url: null },
  });

  if (foto_url && foto_url.startsWith('data:')) {
    const url = await uploadFoto(usuario.id, foto_url);
    await prisma.usuario.update({ where: { id: usuario.id }, data: { foto_url: url } });
    usuario.foto_url = url;
  }

  const token = gerarToken(usuario);
  return { token, usuario, precisaCriarSenha: false };
}

async function definirSenha(usuarioId, senha) {
  const hash = await bcrypt.hash(senha, 10);
  await prisma.usuario.update({
    where: { id: Number(usuarioId) },
    data: { senha: hash },
  });
}

async function esqueceuSenha(nome, email) {
  const emailNorm = email.trim().toLowerCase();
  const usuario = await prisma.usuario.findFirst({
    where: { nome: nome.trim(), email: { equals: emailNorm, mode: 'insensitive' } },
  });

  if (!usuario) throw new Error('Nome e email não coincidem. Verifique os dados.');

  // Gera senha temporária legível
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const tempSenha = 'Copa' + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  const hash = await bcrypt.hash(tempSenha, 10);
  await prisma.usuario.update({ where: { id: usuario.id }, data: { senha: hash } });

  return { usuario, tempSenha };
}

async function verificarToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    throw new Error('Token inválido ou expirado.');
  }
}

module.exports = { login, cadastro, definirSenha, esqueceuSenha, verificarToken };
