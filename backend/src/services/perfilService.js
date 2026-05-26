const prisma = require('../config/prisma');

async function buscarPerfil(usuarioId) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(usuarioId) },
    include: {
      apostas: { include: { partida: true } },
      apostasGoleador: { include: { jogador: true, partida: true } },
      ligas: { include: { liga: true } },
    },
  });

  if (!usuario) throw new Error('Usuário não encontrado');

  let pontos = 0;
  let placaresExatos = 0;
  let vencedoresAcertados = 0;
  let goleadoresAcertados = 0;

  for (const aposta of usuario.apostas) {
    const partida = aposta.partida;
    if (partida.status !== 'FINALIZADA') continue;

    if (
      aposta.placarCasa === partida.placarCasa &&
      aposta.placarFora === partida.placarFora
    ) {
      pontos += 3;
      placaresExatos++;
      continue;
    }

    const vencedorReal =
      partida.placarCasa > partida.placarFora ? 'casa' :
      partida.placarFora > partida.placarCasa ? 'fora' : 'empate';

    const vencedorAposta =
      aposta.placarCasa > aposta.placarFora ? 'casa' :
      aposta.placarFora > aposta.placarCasa ? 'fora' : 'empate';

    if (vencedorReal !== 'empate' && vencedorReal === vencedorAposta) {
      pontos += 1;
      vencedoresAcertados++;
    }
  }

  for (const apostaGol of usuario.apostasGoleador) {
    if (apostaGol.partida.status !== 'FINALIZADA') continue;
    const golReal = await prisma.evento.findFirst({
      where: {
        partidaId: apostaGol.partidaId,
        jogadorId: apostaGol.jogadorId,
        tipo: 'GOL',
      },
    });
    if (golReal) goleadoresAcertados++;
  }

  const ligasComPosicao = await Promise.all(
    usuario.ligas.map(async (ml) => {
      const rankingLiga = await prisma.membroLiga.findMany({
        where: { ligaId: ml.ligaId },
        include: {
          usuario: {
            include: { apostas: { include: { partida: true } } },
          },
        },
      });

      const pontosPorUsuario = await Promise.all(
        rankingLiga.map(async (m) => {
          let pts = 0;
          for (const ap of m.usuario.apostas) {
            if (ap.partida.status !== 'FINALIZADA') continue;
            if (
              ap.placarCasa === ap.partida.placarCasa &&
              ap.placarFora === ap.partida.placarFora
            ) { pts += 3; continue; }
            const vR = ap.partida.placarCasa > ap.partida.placarFora ? 'casa' : ap.partida.placarFora > ap.partida.placarCasa ? 'fora' : 'empate';
            const vA = ap.placarCasa > ap.placarFora ? 'casa' : ap.placarFora > ap.placarCasa ? 'fora' : 'empate';
            if (vR !== 'empate' && vR === vA) pts += 1;
          }
          return { usuarioId: m.usuarioId, pontos: pts };
        })
      );

      pontosPorUsuario.sort((a, b) => b.pontos - a.pontos);
      const posicao = pontosPorUsuario.findIndex((p) => p.usuarioId === usuario.id) + 1;

      return { liga: ml.liga, posicao, total: rankingLiga.length };
    })
  );

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    foto_url: usuario.foto_url,
    isAdmin: usuario.isAdmin,
    pontos,
    placaresExatos,
    vencedoresAcertados,
    goleadoresAcertados,
    ligas: ligasComPosicao,
  };
}

async function atualizarPerfil(usuarioId, { nome, foto_url }) {
  return prisma.usuario.update({
    where: { id: Number(usuarioId) },
    data: {
      ...(nome && { nome }),
      ...(foto_url !== undefined && { foto_url }),
    },
  });
}

module.exports = { buscarPerfil, atualizarPerfil };