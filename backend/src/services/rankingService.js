const prisma = require('../config/prisma');

// Cache simples: evita recalcular a cada requisição
let cache = { data: null, expiresAt: 0 };
const CACHE_TTL = 2 * 60 * 1000; // 2 minutos

async function calcularRanking() {
  if (cache.data && Date.now() < cache.expiresAt) {
    return cache.data;
  }

  const [usuarios, eventosGol] = await Promise.all([
    prisma.usuario.findMany({
      include: {
        apostas: { include: { partida: true } },
        apostasGoleador: { include: { partida: true } },
      },
    }),
    prisma.evento.findMany({
      where: { tipo: 'GOL' },
      select: { partidaId: true, jogadorId: true },
    }),
  ]);

  // Set para checar gols em O(1)
  const golSet = new Set(eventosGol.map((e) => `${e.partidaId}-${e.jogadorId}`));

  const ranking = usuarios.map((usuario) => {
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

      if (
        aposta.placarCasa === partida.placarCasa &&
        aposta.placarFora === partida.placarFora &&
        aposta.placarCasa >= 0
      ) {
        pontos += 3;
        placaresExatos++;
      } else if (aposta.vencedor && aposta.vencedor === vencedorReal) {
        pontos += 1;
        vencedoresAcertados++;
      }
    }

    for (const apostaGol of usuario.apostasGoleador) {
      if (apostaGol.partida.status !== 'FINALIZADA') continue;
      if (golSet.has(`${apostaGol.partidaId}-${apostaGol.jogadorId}`)) {
        goleadoresAcertados++;
      }
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
  });

  const resultado = ranking.sort((a, b) => b.pontos - a.pontos);
  cache = { data: resultado, expiresAt: Date.now() + CACHE_TTL };
  return resultado;
}

module.exports = { calcularRanking };
