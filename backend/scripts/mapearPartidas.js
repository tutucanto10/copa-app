require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { buscarPartidasLiga } = require('../src/services/apiFootballService');

const prisma = new PrismaClient();

// Normaliza nome para comparação (remove acentos, lowercase)
function normalizar(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Verifica se dois nomes de time são parecidos o suficiente
function timesCompativeis(nomeApi, nomeNosso) {
  const a = normalizar(nomeApi);
  const b = normalizar(nomeNosso);
  return a.includes(b) || b.includes(a) || a === b;
}

async function main() {
  const LEAGUE_ID = process.env.COPA_LEAGUE_ID || 1; // 1 = FIFA World Cup
  const SEASON    = process.env.COPA_SEASON || 2026;

  console.log(`🔍 Buscando fixtures da liga ${LEAGUE_ID} temporada ${SEASON}...`);
  const fixtures = await buscarPartidasLiga(LEAGUE_ID, SEASON);
  console.log(`✅ ${fixtures.length} fixture(s) encontrado(s) na API`);

  const partidas = await prisma.partida.findMany({
    include: { selecaoCasa: true, selecaoFora: true },
  });
  console.log(`📋 ${partidas.length} partida(s) no nosso banco`);

  let mapeadas = 0;
  let naomapeadas = 0;

  for (const partida of partidas) {
    const dataPartida = new Date(partida.data);

    const fixture = fixtures.find((f) => {
      const dataApi = new Date(f.fixture.date);
      const mesmoDia =
        dataApi.toISOString().slice(0, 10) === dataPartida.toISOString().slice(0, 10);
      const casaOk = timesCompativeis(f.teams.home.name, partida.selecaoCasa.nome);
      const foraOk = timesCompativeis(f.teams.away.name, partida.selecaoFora.nome);
      return mesmoDia && casaOk && foraOk;
    });

    if (fixture) {
      await prisma.partida.update({
        where: { id: partida.id },
        data: { externalId: fixture.fixture.id },
      });
      console.log(`✅ ${partida.selecaoCasa.nome} × ${partida.selecaoFora.nome} → fixture #${fixture.fixture.id}`);
      mapeadas++;
    } else {
      console.log(`⚠️  Não encontrado: ${partida.selecaoCasa.nome} × ${partida.selecaoFora.nome} (${dataPartida.toISOString().slice(0, 10)})`);
      naomapeadas++;
    }
  }

  console.log(`\n📊 Resultado: ${mapeadas} mapeadas, ${naomapeadas} não encontradas`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Erro:', err.message);
  prisma.$disconnect();
  process.exit(1);
});
