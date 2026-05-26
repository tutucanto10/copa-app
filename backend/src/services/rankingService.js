const prisma = require('../config/prisma');

async function calcularRanking() {
  const usuarios = await prisma.usuario.findMany({
    include: {
      apostas: { include: { partida: true } },
      apostasGoleador: { include: { jogador: true, partida: true } },
    },
  });

  const ranking = await Promise.all(
    usuarios.map(async (usuario) => {
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

        if (acertouPlacar) {
          pontos += 3;
          placaresExatos++;
        }

        const acertouVencedor = aposta.vencedor && aposta.vencedor === vencedorReal;
        if (acertouVencedor) {
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

  return ranking.sort((a, b) => b.pontos - a.pontos);
}

module.exports = { calcularRanking };
