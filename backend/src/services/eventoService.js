const prisma = require('../config/prisma');

async function listarEventos(partidaId) {
  return prisma.evento.findMany({
    where: { partidaId: Number(partidaId) },
    include: {
      jogador: { include: { selecao: true } },
    },
    orderBy: { minuto: 'asc' },
  });
}

async function criarEvento({ partidaId, jogadorId, tipo, minuto }) {
  const evento = await prisma.evento.create({
    data: {
      partidaId: Number(partidaId),
      jogadorId: Number(jogadorId),
      tipo,
      minuto: Number(minuto),
    },
    include: {
      jogador: { include: { selecao: true } },
    },
  });

  if (tipo === 'GOL') {
    const partida = await prisma.partida.findUnique({
      where: { id: Number(partidaId) },
      include: {
        selecaoCasa: { include: { jogadores: true } },
      },
    });

    const ehCasa = partida.selecaoCasa.jogadores.some(
      (j) => j.id === Number(jogadorId)
    );

    await prisma.partida.update({
      where: { id: Number(partidaId) },
      data: ehCasa
        ? { placarCasa: { increment: 1 } }
        : { placarFora: { increment: 1 } },
    });
  }

  return evento;
}

module.exports = { listarEventos, criarEvento };
