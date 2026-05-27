const prisma = require('../config/prisma');

async function listarLigas() {
  return prisma.liga.findMany({
    include: {
      membros: {
        include: {
          usuario: { select: { id: true, nome: true } },
        },
      },
    },
  });
}

async function criarLiga(nome) {
  return prisma.liga.create({ data: { nome } });
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
  const liga = await prisma.liga.findUnique({
    where: { id: Number(ligaId) },
    include: {
      membros: {
        include: {
          usuario: {
            include: {
              apostas: { include: { partida: true } },
              apostasGoleador: { include: { jogador: true, partida: true } },
            },
          },
        },
      },
    },
  });

  if (!liga) throw new Error('Liga não encontrada');

  const ranking = await Promise.all(
    liga.membros.map(async (membro) => {
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

        // Placar exato → +3pts
        const acertouPlacar =
          aposta.placarCasa === partida.placarCasa &&
          aposta.placarFora === partida.placarFora &&
          aposta.placarCasa >= 0

        if (acertouPlacar) {
          pontos += 3;
          placaresExatos++;
        }

        // Vencedor certo → +1pt (acumulável com placar exato)
        if (aposta.vencedor && aposta.vencedor === vencedorReal) {
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

      return {
        id: usuario.id,
        nome: usuario.nome,
        foto_url: usuario.foto_url || null,
        pontos,
        placaresExatos,
        vencedoresAcertados,
        goleadoresAcertados,
      };
    })
  );

  return {
    liga: { id: liga.id, nome: liga.nome },
    ranking: ranking.sort((a, b) => b.pontos - a.pontos),
  };
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
};