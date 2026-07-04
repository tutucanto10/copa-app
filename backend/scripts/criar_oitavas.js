const prisma = require('../src/config/prisma')
const { buscarPartidasLiga, converterStatus } = require('../src/services/apiFootballService')

const NOME_EN = {
  'África do Sul': 'South Africa', 'Canadá': 'Canada', 'Brasil': 'Brazil', 'Japão': 'Japan',
  'Alemanha': 'Germany', 'Paraguai': 'Paraguay', 'Holanda': 'Netherlands', 'Marrocos': 'Morocco',
  'Costa do Marfim': 'Ivory Coast', 'Noruega': 'Norway', 'França': 'France', 'Suécia': 'Sweden',
  'México': 'Mexico', 'Equador': 'Ecuador', 'Inglaterra': 'England', 'RD Congo': 'Congo DR',
  'Bélgica': 'Belgium', 'Senegal': 'Senegal', 'EUA': 'USA', 'Bósnia H.': 'Bosnia & Herzegovina',
  'Espanha': 'Spain', 'Áustria': 'Austria', 'Portugal': 'Portugal', 'Croácia': 'Croatia',
  'Suíça': 'Switzerland', 'Argélia': 'Algeria', 'Austrália': 'Australia', 'Egito': 'Egypt',
  'Argentina': 'Argentina', 'Cabo Verde': 'Cape Verde Islands', 'Colômbia': 'Colombia', 'Gana': 'Ghana',
}
const NOME_PT = Object.fromEntries(Object.entries(NOME_EN).map(([pt, en]) => [en, pt]))

// Oitavas: [casaEN, foraEN, externalId, dataUTC]
const OITAVAS_API = [
  ['Canada',      'Morocco',   1567824, '2026-07-04T17:00:00Z'],
  ['Paraguay',    'France',    1569870, '2026-07-04T21:00:00Z'],
  ['Brazil',      'Norway',    1568100, '2026-07-05T20:00:00Z'],
  ['Mexico',      'England',   1570714, '2026-07-06T00:00:00Z'],
  ['Portugal',    'Spain',     1576756, '2026-07-06T19:00:00Z'],
  ['USA',         'Belgium',   1570715, '2026-07-07T00:00:00Z'],
  ['Argentina',   'Egypt',     1576804, '2026-07-07T16:00:00Z'],
  ['Switzerland', 'Colombia',  1576805, '2026-07-07T20:00:00Z'],
]

async function main() {
  const fixtures = await buscarPartidasLiga(1, 2026)
  const r32 = fixtures.filter(f => f.league.round === 'Round of 32')

  // 1. Sincroniza resultados finais dos 16avos
  console.log('=== Sincronizando 16avos ===')
  const partidas16 = await prisma.partida.findMany({
    where: { rodada: 4 },
    include: { selecaoCasa: true, selecaoFora: true },
  })

  for (const p of partidas16) {
    const homeEn = NOME_EN[p.selecaoCasa.nome]
    const awayEn = NOME_EN[p.selecaoFora.nome]
    const fix = r32.find(f => f.teams.home.name === homeEn && f.teams.away.name === awayEn)
    if (!fix) { console.log(`  ❓ ${p.selecaoCasa.nome} x ${p.selecaoFora.nome}: não encontrado na API`); continue }

    const novoStatus = converterStatus(fix.fixture.status.short)
    const pc = fix.score?.fulltime?.home ?? fix.goals.home ?? p.placarCasa
    const pf = fix.score?.fulltime?.away ?? fix.goals.away ?? p.placarFora
    const isPen = fix.fixture.status.short === 'PEN'
    const penC = isPen ? (fix.score?.penalty?.home ?? null) : null
    const penF = isPen ? (fix.score?.penalty?.away ?? null) : null

    await prisma.partida.update({
      where: { id: p.id },
      data: { status: novoStatus, placarCasa: pc, placarFora: pf, penCasa: penC, penFora: penF },
    })
    const penInfo = isPen ? ` PEN ${penC}x${penF}` : fix.fixture.status.short === 'AET' ? ' (AET)' : ''
    console.log(`  ✅ ${p.selecaoCasa.nome} ${pc}x${pf} ${p.selecaoFora.nome}${penInfo} [${novoStatus}]`)
  }

  // 2. Cria os jogos das oitavas (rodada=5)
  console.log('\n=== Criando Oitavas (rodada 5) ===')
  const selecoes = await prisma.selecao.findMany()
  const findSelecao = (nomeEn) => {
    const nomePt = NOME_PT[nomeEn] || nomeEn
    return selecoes.find(s => s.nome === nomePt)
  }

  for (const [casaEn, foraEn, externalId, dataUTC] of OITAVAS_API) {
    const selCasa = findSelecao(casaEn)
    const selFora = findSelecao(foraEn)
    if (!selCasa) { console.log(`  ❌ Seleção não encontrada: ${casaEn}`); continue }
    if (!selFora) { console.log(`  ❌ Seleção não encontrada: ${foraEn}`); continue }

    // Verifica se já existe
    const existe = await prisma.partida.findFirst({
      where: { rodada: 5, selecaoCasaId: selCasa.id, selecaoForaId: selFora.id },
    })
    if (existe) {
      console.log(`  ⚠️  Já existe: ${selCasa.nome} x ${selFora.nome} (ID ${existe.id})`)
      continue
    }

    const criada = await prisma.partida.create({
      data: {
        selecaoCasaId: selCasa.id,
        selecaoForaId: selFora.id,
        data: new Date(dataUTC),
        rodada: 5,
        externalId,
        status: 'AGENDADA',
      },
      include: { selecaoCasa: true, selecaoFora: true },
    })
    const brDate = new Date(dataUTC).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
    console.log(`  ✅ ${criada.selecaoCasa.nome} x ${criada.selecaoFora.nome} — ${brDate} BRT (ID ${criada.id})`)
  }

  console.log('\n🎉 Concluído! Oitavas criadas no banco.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
