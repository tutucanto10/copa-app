const prisma = require('../config/prisma')

async function salvarAposta(usuarioId, selecaoId) {
  return prisma.apostaCampeao.upsert({
    where: { usuarioId: Number(usuarioId) },
    update: { selecaoId: Number(selecaoId) },
    create: { usuarioId: Number(usuarioId), selecaoId: Number(selecaoId) },
    include: { selecao: true },
  })
}

async function buscarMinha(usuarioId) {
  return prisma.apostaCampeao.findUnique({
    where: { usuarioId: Number(usuarioId) },
    include: { selecao: true },
  })
}

async function listarTodas() {
  return prisma.apostaCampeao.findMany({
    include: {
      usuario: { select: { id: true, nome: true, foto_url: true } },
      selecao: { select: { id: true, nome: true, escudo_url: true } },
    },
    orderBy: { id: 'asc' },
  })
}

module.exports = { salvarAposta, buscarMinha, listarTodas }
