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

async function main() {
  const fixtures = await buscarPartidasLiga(1, 2026)
  const r16 = fixtures.filter(f => f.league.round === 'Round of 16')

  // 1. Sincroniza resultados das oitavas
  console.log('=== Sincronizando Oitavas ===')
  const partidasOit = await prisma.partida.findMany({
    where: { rodada: 5 },
    include: { selecaoCasa: true, selecaoFora: true },
  })

  for (const p of partidasOit) {
    const homeEn = NOME_EN[p.selecaoCasa.nome]
    const awayEn = NOME_EN[p.selecaoFora.nome]
    const fix = r16.find(f =>
      (f.teams.home.name === homeEn && f.teams.away.name === awayEn) ||
      (f.teams.home.name === awayEn && f.teams.away.name === homeEn)
    )
    if (!fix) { console.log(`  ❓ ${p.selecaoCasa.nome} x ${p.selecaoFora.nome}: não encontrado na API`); continue }

    const novoStatus = converterStatus(fix.fixture.status.short)
    // Detecta se a chave na API está invertida em relação ao nosso DB
    const invertido = fix.teams.home.name === awayEn
    const pcApi = fix.score?.fulltime?.home ?? fix.goals.home ?? p.placarCasa
    const pfApi = fix.score?.fulltime?.away ?? fix.goals.away ?? p.placarFora
    const pc = invertido ? pfApi : pcApi
    const pf = invertido ? pcApi : pfApi

    const isPen = fix.fixture.status.short === 'PEN'
    const isAet = fix.fixture.status.short === 'AET'
    const penCApi = isPen ? (fix.score?.penalty?.home ?? null) : null
    const penFApi = isPen ? (fix.score?.penalty?.away ?? null) : null
    const penC = invertido ? penFApi : penCApi
    const penF = invertido ? penCApi : penFApi

    let vencedorKO = p.vencedorKO
    if (novoStatus === 'FINALIZADA' && !vencedorKO) {
      if (isPen) {
        const penCasaVence = isPen && (penC ?? 0) > (penF ?? 0)
        vencedorKO = penCasaVence ? 'casa' : 'fora'
      } else if (isAet) {
        const goalsHome = invertido ? (fix.goals.away ?? 0) : (fix.goals.home ?? 0)
        const goalsAway = invertido ? (fix.goals.home ?? 0) : (fix.goals.away ?? 0)
        vencedorKO = goalsHome > goalsAway ? 'casa' : 'fora'
      } else if (pc !== pf) {
        vencedorKO = pc > pf ? 'casa' : 'fora'
      }
    }

    await prisma.partida.update({
      where: { id: p.id },
      data: { status: novoStatus, placarCasa: pc, placarFora: pf, penCasa: penC, penFora: penF, vencedorKO },
    })
    const suffix = isPen ? ` PEN ${penC}x${penF}` : isAet ? ' (AET)' : ''
    console.log(`  ✅ ${p.selecaoCasa.nome} ${pc}x${pf} ${p.selecaoFora.nome}${suffix} [${novoStatus}] vencedorKO=${vencedorKO}`)
  }

  // 2. Cria os jogos das quartas (rodada=6)
  console.log('\n=== Criando Quartas (rodada 6) ===')
  const qrtFixtures = fixtures.filter(f => f.league.round === 'Quarter-finals')
  console.log(`  Encontrados ${qrtFixtures.length} jogo(s) de quartas na API`)

  if (qrtFixtures.length === 0) {
    console.log('  ⚠️  Nenhuma quarterfinal encontrada — API pode ainda não ter os fixtures. Tente novamente mais tarde.')
    return
  }

  const selecoes = await prisma.selecao.findMany()
  const findSelecao = (nomeEn) => {
    const nomePt = NOME_PT[nomeEn] || nomeEn
    return selecoes.find(s => s.nome === nomePt)
  }

  for (const fix of qrtFixtures) {
    const casaEn = fix.teams.home.name
    const foraEn = fix.teams.away.name
    const selCasa = findSelecao(casaEn)
    const selFora = findSelecao(foraEn)

    if (!selCasa) { console.log(`  ❌ Seleção não encontrada: "${casaEn}" — adicione ao NOME_PT`); continue }
    if (!selFora) { console.log(`  ❌ Seleção não encontrada: "${foraEn}" — adicione ao NOME_PT`); continue }

    const existe = await prisma.partida.findFirst({
      where: { rodada: 6, selecaoCasaId: selCasa.id, selecaoForaId: selFora.id },
    })
    if (existe) {
      console.log(`  ⚠️  Já existe: ${selCasa.nome} x ${selFora.nome} (ID ${existe.id})`)
      continue
    }

    const criada = await prisma.partida.create({
      data: {
        selecaoCasaId: selCasa.id,
        selecaoForaId: selFora.id,
        data: new Date(fix.fixture.date),
        rodada: 6,
        externalId: fix.fixture.id,
        status: 'AGENDADA',
      },
      include: { selecaoCasa: true, selecaoFora: true },
    })
    const brDate = new Date(fix.fixture.date).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    })
    console.log(`  ✅ ${criada.selecaoCasa.nome} x ${criada.selecaoFora.nome} — ${brDate} BRT (ID ${criada.id}, ext: ${fix.fixture.id})`)
  }

  console.log('\n🎉 Concluído! Quartas criadas no banco.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
