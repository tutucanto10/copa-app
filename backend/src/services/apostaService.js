const prisma = require('../config/prisma');
const { rodadaAbertaParaApostas } = require('./rodadaService');

async function criarAposta({ usuarioId, partidaId, placarCasa, placarFora }) {
  const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } });
  if (!usuario) throw new Error(`Usuário ${usuarioId} não encontrado`);

  const partida = await prisma.partida.findUnique({ where: { id: Number(partidaId) } });
  if (!partida) throw new Error('Partida não encontrada');
  if (partida.status !== 'AGENDADA') throw new Error('Apostas encerradas para esta partida');

  const apostaExistente = await prisma.aposta.findFirst({
    where: { usuarioId: Number(usuarioId), partidaId: Number(partidaId) },
  });

  if (apostaExistente) {
    return prisma.aposta.update({
      where: { id: apostaExistente.id },
      data: {
        placarCasa: Number(placarCasa),
        placarFora: Number(placarFora),
      },
    });
  }

  return prisma.aposta.create({
    data: {
      usuarioId: Number(usuarioId),
      partidaId: Number(partidaId),
      placarCasa: Number(placarCasa),
      placarFora: Number(placarFora),
    },
  });
}

async function salvarVencedor({ usuarioId, partidaId, vencedor }) {
  const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } });
  if (!usuario) throw new Error(`Usuário ${usuarioId} não encontrado`);

  const partida = await prisma.partida.findUnique({ where: { id: Number(partidaId) } });
  if (!partida) throw new Error('Partida não encontrada');
  if (partida.status !== 'AGENDADA') throw new Error('Apostas encerradas para esta partida');

  const apostaExistente = await prisma.aposta.findFirst({
    where: { usuarioId: Number(usuarioId), partidaId: Number(partidaId) },
  });

  if (apostaExistente) {
    return prisma.aposta.update({
      where: { id: apostaExistente.id },
      data: { vencedor },
    });
  }

  return prisma.aposta.create({
    data: {
      usuarioId: Number(usuarioId),
      partidaId: Number(partidaId),
      placarCasa: -1,
      placarFora: -1,
      vencedor,
    },
  });
}

async function buscarApostaUsuario({ usuarioId, partidaId }) {
  return prisma.aposta.findFirst({
    where: {
      usuarioId: Number(usuarioId),
      partidaId: Number(partidaId),
    },
  });
}

async function listarApostas(partidaId) {
  return prisma.aposta.findMany({
    where: { partidaId: Number(partidaId) },
    include: {
      usuario: { select: { id: true, nome: true, foto_url: true } },
    },
    orderBy: { id: 'asc' },
  });
}

async function listarApostasUsuario(usuarioId) {
  return prisma.aposta.findMany({
    where: { usuarioId: Number(usuarioId) },
  });
}

module.exports = { criarAposta, salvarVencedor, buscarApostaUsuario, listarApostas, listarApostasUsuario };