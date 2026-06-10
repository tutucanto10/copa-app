require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { buscarPartidasLiga } = require('../src/services/apiFootballService');

const prisma = new PrismaClient();

// Traduções API (inglês) → nosso banco (português)
const ALIASES = {
  'south korea':              'coreia do sul',
  'korea republic':           'coreia do sul',
  'republic of korea':        'coreia do sul',
  'czech republic':           'rep. tcheca',
  'czechia':                  'rep. tcheca',
  'united states':            'eua',
  'usa':                      'eua',
  'netherlands':              'holanda',
  'holland':                  'holanda',
  'bosnia and herzegovina':   'bósnia h.',
  'bosnia':                   'bósnia h.',
  "cote d'ivoire":            'costa do marfim',
  'ivory coast':              'costa do marfim',
  'new zealand':              'nova zelândia',
  'saudi arabia':             'arábia saudita',
  'iran':                     'irã',
  'algeria':                  'argélia',
  'austria':                  'áustria',
  'jordan':                   'jordânia',
  'norway':                   'noruega',
  'sweden':                   'suécia',
  'belgium':                  'bélgica',
  'tunisia':                  'tunísia',
  'ghana':                    'gana',
  'morocco':                  'marrocos',
  'scotland':                 'escócia',
  'croatia':                  'croácia',
  'france':                   'frança',
  'england':                  'inglaterra',
  'germany':                  'alemanha',
  'spain':                    'espanha',
  'ecuador':                  'equador',
  'colombia':                 'colômbia',
  'uzbekistan':               'uzbequistão',
  'dr congo':                 'rd congo',
  'democratic republic of congo': 'rd congo',
  'congo dr':                 'rd congo',
  'curacao':                  'curaçao',
  'cape verde':               'cabo verde',
  'iraq':                     'iraque',
  'mexico':                   'méxico',
  'switzerland':              'suíça',
  'canada':                   'canadá',
  'paraguay':                 'paraguai',
  'australia':                'austrália',
  'turkey':                   'turquia',
  'türkiye':                  'turquia',
  'turkiye':                  'turquia',
  'cape verde islands':       'cabo verde',
  'japan':                    'japão',
  'uruguay':                  'uruguai',
  'panama':                   'panamá',
  'egypt':                    'egito',
  'south africa':             'áfrica do sul',
  'haiti':                    'haiti',
  'senegal':                  'senegal',
  'portugal':                 'portugal',
  'argentina':                'argentina',
  'brazil':                   'brasil',
  'brasil':                   'brasil',
  'qatar':                    'qatar',
};

function normalizar(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function resolverNome(nomeApi) {
  const lower = nomeApi.toLowerCase().trim();
  // Tenta alias direto primeiro
  if (ALIASES[lower]) return normalizar(ALIASES[lower]);
  // Remove acentos e tenta alias novamente
  const semAcento = lower.normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (ALIASES[semAcento]) return normalizar(ALIASES[semAcento]);
  // Fallback: normaliza o próprio nome da API
  return normalizar(nomeApi);
}

function timesCompativeis(nomeApi, nomeNosso) {
  const a = resolverNome(nomeApi);
  const b = normalizar(nomeNosso);
  return a === b || a.includes(b) || b.includes(a);
}

async function main() {
  const LEAGUE_ID = process.env.COPA_LEAGUE_ID || 1;
  const SEASON    = process.env.COPA_SEASON    || 2026;

  console.log(`\n🔍 Buscando fixtures da liga ${LEAGUE_ID} temporada ${SEASON}...`);
  const fixtures = await buscarPartidasLiga(LEAGUE_ID, SEASON);
  console.log(`✅ ${fixtures.length} fixture(s) encontrado(s) na API\n`);

  const partidas = await prisma.partida.findMany({
    include: { selecaoCasa: true, selecaoFora: true },
    orderBy: { data: 'asc' },
  });
  console.log(`📋 ${partidas.length} partida(s) no banco\n`);
  console.log('━'.repeat(80));

  let mapeadas   = 0;
  let jaHaviam   = 0;
  let naoEncontradas = [];

  for (const partida of partidas) {
    // Se já tem externalId, só atualiza se vier diferente
    const dataPartida = new Date(partida.data);

    const fixture = fixtures.find((f) => {
      const dataApi  = new Date(f.fixture.date);
      const mesmoDia = dataApi.toISOString().slice(0, 10) === dataPartida.toISOString().slice(0, 10);
      const casaOk   = timesCompativeis(f.teams.home.name, partida.selecaoCasa.nome);
      const foraOk   = timesCompativeis(f.teams.away.name, partida.selecaoFora.nome);
      return mesmoDia && casaOk && foraOk;
    });

    if (fixture) {
      if (partida.externalId === fixture.fixture.id) {
        console.log(`⏭  Já mapeado: ${partida.selecaoCasa.nome} × ${partida.selecaoFora.nome} → #${fixture.fixture.id}`);
        jaHaviam++;
      } else {
        await prisma.partida.update({
          where: { id: partida.id },
          data: { externalId: fixture.fixture.id },
        });
        console.log(`✅ ${partida.selecaoCasa.nome.padEnd(20)} × ${partida.selecaoFora.nome.padEnd(20)} → fixture #${fixture.fixture.id}`);
        mapeadas++;
      }
    } else {
      console.log(`⚠️  NÃO ENCONTRADO: ${partida.selecaoCasa.nome} × ${partida.selecaoFora.nome} (${dataPartida.toISOString().slice(0, 10)})`);
      naoEncontradas.push({ partida, dataPartida });
    }
  }

  console.log('\n' + '━'.repeat(80));
  console.log(`\n📊 Resultado:`);
  console.log(`   ✅ Mapeadas agora:  ${mapeadas}`);
  console.log(`   ⏭  Já mapeadas:    ${jaHaviam}`);
  console.log(`   ⚠️  Não encontradas: ${naoEncontradas.length}`);

  if (naoEncontradas.length > 0) {
    console.log('\n⚠️  Partidas sem match na API (verifique datas ou nomes no banco):');
    naoEncontradas.forEach(({ partida, dataPartida }) => {
      console.log(`   - ${partida.selecaoCasa.nome} × ${partida.selecaoFora.nome}  [${dataPartida.toISOString().slice(0, 10)}]  id=${partida.id}`);
    });
    console.log('\n   Dica: rode com NODE_ENV=debug para ver os nomes que a API retornou.');
  } else {
    console.log('\n🎉 Todas as partidas foram mapeadas com sucesso!');
  }

  // Modo debug: lista todos os nomes que a API retornou (útil para diagnosticar falhas)
  if (process.env.NODE_ENV === 'debug') {
    console.log('\n--- DEBUG: nomes de times na API ---');
    const nomes = new Set();
    fixtures.forEach((f) => { nomes.add(f.teams.home.name); nomes.add(f.teams.away.name); });
    [...nomes].sort().forEach((n) => console.log(`  "${n}"`));
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Erro:', err.message);
  prisma.$disconnect();
  process.exit(1);
});
