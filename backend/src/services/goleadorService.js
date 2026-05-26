const prisma = require('../config/prisma');

async function salvarApostasGoleador({ usuarioId, partidaId, jogadorIds }) {
  // Remove apostas anteriores do mesmo usuário nessa partida
  await prisma.apostaGoleador.deleteMany({
    where: {
      usuarioId: Number(usuarioId),
      partidaId: Number(partidaId),
    },
  });

  const dados = jogadorIds.map((jogadorId) => ({
    usuarioId: Number(usuarioId),
    partidaId: Number(partidaId),
    jogadorId: Number(jogadorId),
  }));

  await prisma.apostaGoleador.createMany({ data: dados });
  return { ok: true, total: dados.length };
}

async function buscarApostasGoleador({ usuarioId, partidaId }) {
  return prisma.apostaGoleador.findMany({
    where: {
      usuarioId: Number(usuarioId),
      partidaId: Number(partidaId),
    },
    include: { jogador: true },
  });
}

module.exports = { salvarApostasGoleador, buscarApostasGoleador };