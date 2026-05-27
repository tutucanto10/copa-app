const prisma = require('../config/prisma');

function calcularPontos(apostas) {
  let pontos = 0, placaresExatos = 0, vencedoresAcertados = 0;
  for (const aposta of apostas) {
    const partida = aposta.partida;
    if (partida.status !== 'FINALIZADA') continue;
    const vencedorReal =
      partida.placarCasa > partida.placarFora ? 'casa' :
      partida.placarFora > partida.placarCasa ? 'fora' : 'empate';
    if (
      aposta.placarCasa === partida.placarCasa &&
      aposta.placarFora === partida.placarFora
    ) {
      pontos += 3; placaresExatos++;
    } else if (aposta.vencedor && aposta.vencedor === vencedorReal) {
      pontos += 1; vencedoresAcertados++;
    }
  }
  return { pontos, placaresExatos, vencedoresAcertados };
}

async function buscarPerfil(usuarioId) {
  const [usuario, eventosGol] = await Promise.all([
    prisma.usuario.findUnique({
      where: { id: Number(usuarioId) },
      include: {
        apostas: { include: { partida: true } },
        apostasGoleador: { include: { partida: true } },
        ligas: { include: { liga: true } },
      },
    }),
    prisma.evento.findMany({
      where: { tipo: 'GOL' },
      select: { partidaId: true, jogadorId: true },
    }),
  ]);

  if (!usuario) throw new Error('Usuário não encontrado');

  const golSet = new Set(eventosGol.map((e) => `${e.partidaId}-${e.jogadorId}`));

  const { pontos, placaresExatos, vencedoresAcertados } = calcularPontos(usuario.apostas);

  let goleadoresAcertados = 0;
  for (const ag of usuario.apostasGoleador) {
    if (ag.partida.status !== 'FINALIZADA') continue;
    if (golSet.has(`${ag.partidaId}-${ag.jogadorId}`)) goleadoresAcertados++;
  }

  // Ranking por liga — busca todos os membros de uma vez por liga
  const ligasComPosicao = await Promise.all(
    usuario.ligas.map(async (ml) => {
      const membros = await prisma.membroLiga.findMany({
        where: { ligaId: ml.ligaId },
        include: { usuario: { include: { apostas: { include: { partida: true } } } } },
      });

      const pontosPorUsuario = membros.map((m) => ({
        usuarioId: m.usuarioId,
        pontos: calcularPontos(m.usuario.apostas).pontos,
      }));

      pontosPorUsuario.sort((a, b) => b.pontos - a.pontos);
      const posicao = pontosPorUsuario.findIndex((p) => p.usuarioId === usuario.id) + 1;

      return { liga: ml.liga, posicao, total: membros.length };
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
