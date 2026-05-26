const prisma = require('../config/prisma');

async function listarPartidas() {
  return prisma.partida.findMany({
    include: {
      selecaoCasa: true,
      selecaoFora: true,
    },
    orderBy: { data: 'asc' },
  });
}

async function buscarPartida(id) {
  return prisma.partida.findUnique({
    where: { id: Number(id) },
    include: {
      selecaoCasa: true,
      selecaoFora: true,
    },
  });
}

async function listarJogadoresPorPartida(partidaId) {
  const partida = await prisma.partida.findUnique({
    where: { id: Number(partidaId) },
    include: {
      selecaoCasa: { include: { jogadores: true } },
      selecaoFora: { include: { jogadores: true } },
    },
  });
  if (!partida) return [];
  return [
    ...partida.selecaoCasa.jogadores.map((j) => ({ ...j, selecao: partida.selecaoCasa })),
    ...partida.selecaoFora.jogadores.map((j) => ({ ...j, selecao: partida.selecaoFora })),
  ];
}

async function atualizarPartida(id, { status, placarCasa, placarFora }) {
  const data = {};
  if (status !== undefined) data.status = status;
  if (placarCasa !== undefined) data.placarCasa = Number(placarCasa);
  if (placarFora !== undefined) data.placarFora = Number(placarFora);

  return prisma.partida.update({
    where: { id: Number(id) },
    data,
    include: { selecaoCasa: true, selecaoFora: true },
  });
}

async function criarPartida({ selecaoCasaId, selecaoForaId, data, rodada }) {
  const partida = await prisma.partida.create({
    data: {
      selecaoCasaId: Number(selecaoCasaId),
      selecaoForaId: Number(selecaoForaId),
      data: new Date(data),
      rodada: Number(rodada) || 1,
    },
    include: { selecaoCasa: true, selecaoFora: true },
  });

  return partida;
}

async function listarSelecoes() {
  return prisma.selecao.findMany({ orderBy: { nome: 'asc' } });
}

async function atualizarSelecao(id, { nome, escudo_url }) {
  const data = {};
  if (nome) data.nome = nome;
  if (escudo_url !== undefined) data.escudo_url = escudo_url;
  return prisma.selecao.update({ where: { id: Number(id) }, data });
}

module.exports = {
  listarPartidas,
  buscarPartida,
  listarJogadoresPorPartida,
  atualizarPartida,
  criarPartida,
  listarSelecoes,
  atualizarSelecao,
};