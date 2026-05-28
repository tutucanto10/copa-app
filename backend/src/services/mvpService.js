const prisma = require('../config/prisma');

function calcularPontosApostas(apostas, placarMap) {
  const pontosMap = {};
  for (const a of apostas) {
    const p = placarMap[a.partidaId];
    if (!p) continue;
    if (!pontosMap[a.usuarioId]) {
      pontosMap[a.usuarioId] = { usuario: a.usuario, pontos: 0, exatos: 0 };
    }
    const vR = p.placarCasa > p.placarFora ? 'casa' : p.placarFora > p.placarCasa ? 'fora' : 'empate';
    if (a.placarCasa === p.placarCasa && a.placarFora === p.placarFora) {
      pontosMap[a.usuarioId].pontos += 3;
      pontosMap[a.usuarioId].exatos++;
    } else if (a.vencedor && a.vencedor === vR) {
      pontosMap[a.usuarioId].pontos += 1;
    }
  }
  return Object.values(pontosMap).sort((a, b) => b.pontos - a.pontos || b.exatos - a.exatos);
}

async function mvpRodadaSingle(rodada) {
  const [totalPartidas, partidas] = await Promise.all([
    prisma.partida.count({ where: { rodada } }),
    prisma.partida.findMany({
      where: { rodada, status: 'FINALIZADA' },
      select: { id: true, placarCasa: true, placarFora: true },
    }),
  ]);

  if (partidas.length === 0) return { rodada, mvp: null, completa: false, finalizadas: 0, total: totalPartidas };

  const apostas = await prisma.aposta.findMany({
    where: { partidaId: { in: partidas.map((p) => p.id) } },
    include: { usuario: { select: { id: true, nome: true, foto_url: true } } },
  });

  const placarMap = Object.fromEntries(partidas.map((p) => [p.id, p]));
  const ranking = calcularPontosApostas(apostas, placarMap);

  return {
    rodada,
    mvp: ranking[0] || null,
    ranking: ranking.slice(0, 3),
    completa: partidas.length === totalPartidas,
    finalizadas: partidas.length,
    total: totalPartidas,
  };
}

async function mvpPorLiga(ligaId) {
  const membros = await prisma.membroLiga.findMany({
    where: { ligaId },
    select: { usuarioId: true },
  });
  const userIds = membros.map((m) => m.usuarioId);

  const results = await Promise.all(
    [1, 2, 3].map(async (rodada) => {
      const [totalPartidas, partidas] = await Promise.all([
        prisma.partida.count({ where: { rodada } }),
        prisma.partida.findMany({
          where: { rodada, status: 'FINALIZADA' },
          select: { id: true, placarCasa: true, placarFora: true },
        }),
      ]);

      if (partidas.length === 0) return null;

      const apostas = await prisma.aposta.findMany({
        where: {
          partidaId: { in: partidas.map((p) => p.id) },
          usuarioId: { in: userIds },
        },
        include: { usuario: { select: { id: true, nome: true, foto_url: true } } },
      });

      const placarMap = Object.fromEntries(partidas.map((p) => [p.id, p]));
      const ranking = calcularPontosApostas(apostas, placarMap);

      return {
        rodada,
        mvp: ranking[0] || null,
        completa: partidas.length === totalPartidas,
        finalizadas: partidas.length,
        total: totalPartidas,
      };
    })
  );

  return results.filter((r) => r !== null && r.finalizadas > 0);
}

async function mvpPorUsuario(usuarioId) {
  const ligas = await prisma.membroLiga.findMany({
    where: { usuarioId },
    include: { liga: true },
  });

  if (ligas.length === 0) return [];

  const results = await Promise.all(
    ligas.map(async ({ liga }) => {
      const rodadas = await mvpPorLiga(liga.id);
      return { liga: { id: liga.id, nome: liga.nome }, rodadas };
    })
  );

  return results.filter((r) => r.rodadas.length > 0);
}

module.exports = { mvpRodadaSingle, mvpPorUsuario };
