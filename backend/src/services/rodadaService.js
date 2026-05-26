const prisma = require('../config/prisma');

// Se não existe registro de Rodada para o número, permite apostar (só bloqueia se FECHADA ou prazo passou)
async function rodadaAbertaParaApostas(numeroRodada) {
  const rodada = await prisma.rodada.findFirst({
    where: { numero: numeroRodada },
  });

  if (!rodada) return true;
  if (rodada.status === 'FECHADA') return false;
  if (!rodada.dataFechamento) return true;

  const agora = new Date();
  return agora < rodada.dataFechamento;
}

async function listarRodadas() {
  const rodadas = await prisma.rodada.findMany({
    orderBy: { numero: 'asc' },
  });

  const agora = new Date();
  return rodadas.map((r) => ({
    ...r,
    apostasAbertas: r.status !== 'FECHADA' && (!r.dataFechamento || agora < r.dataFechamento),
    minutosParaFechar: r.dataFechamento
      ? Math.max(0, Math.floor((new Date(r.dataFechamento) - agora) / 60000))
      : null,
  }));
}

async function criarRodada({ numero, dataJogo }) {
  // dataJogo = '2026-06-11' (data no fuso de Brasília)
  const dataAbertura   = new Date(`${dataJogo}T03:00:00Z`) // 00:00 Brasília
  const dataFechamento = new Date(`${dataJogo}T15:00:00Z`) // 12:00 Brasília

  return prisma.rodada.upsert({
    where: { numero },
    update: { dataAbertura, dataFechamento, status: 'ABERTA' },
    create: { numero, status: 'ABERTA', dataAbertura, dataFechamento },
  });
}

module.exports = {
  rodadaAbertaParaApostas,
  listarRodadas,
  criarRodada,
};
