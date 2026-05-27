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

async function buscarApostasUsuario(usuarioId) {
  const [apostas, eventosGol] = await Promise.all([
    prisma.aposta.findMany({
      where: { usuarioId: Number(usuarioId) },
      include: {
        partida: {
          include: { selecaoCasa: true, selecaoFora: true },
        },
      },
      orderBy: { partida: { data: 'asc' } },
    }),
    prisma.evento.findMany({
      where: { tipo: 'GOL' },
      select: { partidaId: true, jogadorId: true },
    }),
  ]);

  return apostas.map((a) => {
    const p = a.partida;
    const finalizada = p.status === 'FINALIZADA';
    let resultado = 'pendente';
    let pontos = 0;

    if (finalizada) {
      const vencedorReal =
        p.placarCasa > p.placarFora ? 'casa' :
        p.placarFora > p.placarCasa ? 'fora' : 'empate';

      if (a.placarCasa === p.placarCasa && a.placarFora === p.placarFora) {
        resultado = 'placar_exato';
        pontos = 3;
      } else if (a.vencedor && a.vencedor === vencedorReal) {
        resultado = 'vencedor_certo';
        pontos = 1;
      } else {
        resultado = 'errou';
      }
    }

    return {
      id: a.id,
      placarCasa: a.placarCasa,
      placarFora: a.placarFora,
      vencedor: a.vencedor,
      resultado,
      pontos,
      partida: {
        id: p.id,
        data: p.data,
        status: p.status,
        placarCasa: p.placarCasa,
        placarFora: p.placarFora,
        selecaoCasa: { nome: p.selecaoCasa.nome, escudo_url: p.selecaoCasa.escudo_url },
        selecaoFora: { nome: p.selecaoFora.nome, escudo_url: p.selecaoFora.escudo_url },
      },
    };
  });
}

module.exports = { buscarPerfil, atualizarPerfil, buscarApostasUsuario };
