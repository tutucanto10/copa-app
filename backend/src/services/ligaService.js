const prisma = require('../config/prisma');

const rankingCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function limparCacheRanking() {
  rankingCache.clear();
}

async function listarLigas() {
  return prisma.liga.findMany({
    include: {
      membros: {
        include: {
          usuario: { select: { id: true, nome: true } },
        },
      },
    },
    orderBy: { id: 'asc' },
  });
}

async function criarLiga(nome, logo_url) {
  return prisma.liga.create({ data: { nome, logo_url: logo_url || null } });
}

async function adicionarMembro({ usuarioId, ligaId }) {
  return prisma.membroLiga.create({
    data: {
      usuarioId: Number(usuarioId),
      ligaId: Number(ligaId),
    },
  });
}

async function removerMembro({ usuarioId, ligaId }) {
  return prisma.membroLiga.deleteMany({
    where: {
      usuarioId: Number(usuarioId),
      ligaId: Number(ligaId),
    },
  });
}

async function rankingPorLiga(ligaId) {
  const key = String(ligaId);
  const cached = rankingCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const liga = await prisma.liga.findUnique({
    where: { id: Number(ligaId) },
    include: {
      membros: {
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              foto_url: true,
              apostas: { include: { partida: true } },
              apostasGoleador: { include: { partida: true } },
            },
          },
        },
      },
    },
  });

  if (!liga) throw new Error('Liga não encontrada');

  // Busca todos os eventos de gol em uma única query (evita N+1)
  const apostasGolFinalizadas = liga.membros.flatMap((m) =>
    m.usuario.apostasGoleador.filter((ag) => ag.partida.status === 'FINALIZADA')
  );

  const golSet = new Set();
  if (apostasGolFinalizadas.length > 0) {
    const eventosGol = await prisma.evento.findMany({
      where: {
        tipo: 'GOL',
        OR: apostasGolFinalizadas.map((ag) => ({
          partidaId: ag.partidaId,
          jogadorId: ag.jogadorId,
        })),
      },
      select: { partidaId: true, jogadorId: true },
    });
    eventosGol.forEach((e) => golSet.add(`${e.partidaId}-${e.jogadorId}`));
  }

  const ranking = liga.membros.map((membro) => {
    const usuario = membro.usuario;
    let pontos = 0;
    let placaresExatos = 0;
    let vencedoresAcertados = 0;
    let goleadoresAcertados = 0;

    for (const aposta of usuario.apostas) {
      const partida = aposta.partida;
      if (partida.status !== 'FINALIZADA') continue;

      const vencedorReal =
        partida.placarCasa > partida.placarFora ? 'casa' :
        partida.placarFora > partida.placarCasa ? 'fora' : 'empate';

      const acertouPlacar =
        aposta.placarCasa === partida.placarCasa &&
        aposta.placarFora === partida.placarFora &&
        aposta.placarCasa >= 0;

      if (acertouPlacar) { pontos += 3; placaresExatos++; }

      const vAposta = aposta.vencedor ||
        (aposta.placarCasa >= 0
          ? (aposta.placarCasa > aposta.placarFora ? 'casa'
            : aposta.placarFora > aposta.placarCasa ? 'fora' : 'empate')
          : null);
      if (vAposta && vAposta === vencedorReal) { pontos += 1; vencedoresAcertados++; }
    }

    for (const apostaGol of usuario.apostasGoleador) {
      if (apostaGol.partida.status !== 'FINALIZADA') continue;
      if (golSet.has(`${apostaGol.partidaId}-${apostaGol.jogadorId}`)) goleadoresAcertados++;
    }

    return { id: usuario.id, nome: usuario.nome, foto_url: usuario.foto_url || null, pontos, placaresExatos, vencedoresAcertados, goleadoresAcertados };
  });

  const data = {
    liga: { id: liga.id, nome: liga.nome },
    ranking: ranking.sort((a, b) => b.pontos - a.pontos),
  };
  rankingCache.set(key, { data, ts: Date.now() });
  return data;
}

async function listarUsuarios() {
  return prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      ligas: { include: { liga: true } },
    },
    orderBy: { nome: 'asc' },
  });
}

async function atualizarUsuario(id, { nome, foto_url }) {
  const data = {};
  if (nome) data.nome = nome;
  if (foto_url !== undefined) data.foto_url = foto_url;
  return prisma.usuario.update({ where: { id: Number(id) }, data });
}

module.exports = {
  listarLigas,
  criarLiga,
  adicionarMembro,
  removerMembro,
  rankingPorLiga,
  listarUsuarios,
  atualizarUsuario,
  limparCacheRanking,
};