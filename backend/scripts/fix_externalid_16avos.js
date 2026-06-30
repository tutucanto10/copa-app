const prisma = require('../src/config/prisma')
const { buscarPartidasLiga, converterStatus } = require('../src/services/apiFootballService')

// Mapa nome PT (nosso banco) -> nome EN (api-football)
const NOME_EN = {
  'África do Sul': 'South Africa',
  'Canadá': 'Canada',
  'Brasil': 'Brazil',
  'Japão': 'Japan',
  'Alemanha': 'Germany',
  'Paraguai': 'Paraguay',
  'Holanda': 'Netherlands',
  'Marrocos': 'Morocco',
  'Costa do Marfim': 'Ivory Coast',
  'Noruega': 'Norway',
  'França': 'France',
  'Suécia': 'Sweden',
  'México': 'Mexico',
  'Equador': 'Ecuador',
  'Inglaterra': 'England',
  'RD Congo': 'Congo DR',
  'Bélgica': 'Belgium',
  'Senegal': 'Senegal',
  'EUA': 'USA',
  'Bósnia H.': 'Bosnia & Herzegovina',
  'Espanha': 'Spain',
  'Áustria': 'Austria',
  'Portugal': 'Portugal',
  'Croácia': 'Croatia',
  'Suíça': 'Switzerland',
  'Argélia': 'Algeria',
  'Austrália': 'Australia',
  'Egito': 'Egypt',
  'Argentina': 'Argentina',
  'Cabo Verde': 'Cape Verde Islands',
  'Colômbia': 'Colombia',
  'Gana': 'Ghana',
}

async function main() {
  const partidas = await prisma.partida.findMany({
    where: { rodada: 4 },
    include: { selecaoCasa: true, selecaoFora: true },
  })

  const fixtures = await buscarPartidasLiga(1, 2026)
  const r32 = fixtures.filter(f => f.league.round === 'Round of 32')
  console.log(`📡 ${r32.length} fixtures de Round of 32 na API\n`)

  for (const p of partidas) {
    const homeEn = NOME_EN[p.selecaoCasa.nome]
    const awayEn = NOME_EN[p.selecaoFora.nome]
    const match = r32.find(f => f.teams.home.name === homeEn && f.teams.away.name === awayEn)

    if (!match) {
      console.log(`❓ ${p.selecaoCasa.nome} x ${p.selecaoFora.nome} → não encontrado (esperava ${homeEn} x ${awayEn})`)
      continue
    }

    const novoStatus = converterStatus(match.fixture.status.short)
    const novoPlacarCasa = match.score?.fulltime?.home ?? match.goals.home ?? p.placarCasa
    const novoPlacarFora = match.score?.fulltime?.away ?? match.goals.away ?? p.placarFora
    const isPen = match.fixture.status.short === 'PEN'
    const novoPenCasa = isPen ? (match.score?.penalty?.home ?? null) : p.penCasa
    const novoPenFora = isPen ? (match.score?.penalty?.away ?? null) : p.penFora

    await prisma.partida.update({
      where: { id: p.id },
      data: {
        externalId: match.fixture.id,
        status: novoStatus,
        placarCasa: novoPlacarCasa,
        placarFora: novoPlacarFora,
        penCasa: novoPenCasa,
        penFora: novoPenFora,
      },
    })

    const penInfo = isPen ? ` (PEN ${novoPenCasa}x${novoPenFora})` : ''
    console.log(`✅ ${p.selecaoCasa.nome} ${novoPlacarCasa}x${novoPlacarFora} ${p.selecaoFora.nome}${penInfo} [${novoStatus}] → externalId=${match.fixture.id}`)
  }

  console.log('\n🎉 Concluído. Job de placar ao vivo agora vai encontrar essas partidas.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
