/**
 * setup.js — Roda UMA VEZ para popular o banco do zero.
 * Ordem: seleções → jogos → rodadas
 *
 * Uso: node scripts/setup.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ─── SELEÇÕES (48 times + escudos) ───────────────────────────────────────────

const SELECOES = [
  // GRUPO A
  { nome: 'México',         escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/f/f3/Mexico_national_football_team_crest_%282022%29.png' },
  { nome: 'África do Sul',  escudo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/South_Africa_national_soccer_team_logo.svg/1280px-South_Africa_national_soccer_team_logo.svg.png' },
  { nome: 'Coreia do Sul',  escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/a/a7/South_Korea_national_football_team_logo.png' },
  { nome: 'Rep. Tcheca',    escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/5/5a/FACR.png' },
  // GRUPO B
  { nome: 'Canadá',         escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/7/7a/Logotipo_Sele%C3%A7%C3%A3o_Canad%C3%A1.png' },
  { nome: 'Suíça',          escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/9/96/SFV_Logo.svg.png' },
  { nome: 'Qatar',          escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/thumb/a/a9/Associa%C3%A7%C3%A3o_do_Qatar_de_Futebol.png/250px-Associa%C3%A7%C3%A3o_do_Qatar_de_Futebol.png' },
  { nome: 'Bósnia H.',      escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/5/5a/Logo_of_the_Football_Association_of_Bosnia_and_Herzegovina_%282013-present%29.png' },
  // GRUPO C
  { nome: 'Brasil',         escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Brazilian_Football_Confederation_logo.svg' },
  { nome: 'Marrocos',       escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/7/71/F%C3%A9d%C3%A9ration_Royale_Marocaine_de_Football.png' },
  { nome: 'Escócia',        escudo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Scotland_national_football_team_logo_2014.svg/1280px-Scotland_national_football_team_logo_2014.svg.png' },
  { nome: 'Haiti',          escudo_url: 'https://upload.wikimedia.org/wikipedia/en/e/e7/Federation_Haitienne_de_Football.png' },
  // GRUPO D
  { nome: 'EUA',            escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Crest_of_the_United_States_Soccer_Federation.png' },
  { nome: 'Paraguai',       escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg/1280px-Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg.png' },
  { nome: 'Austrália',      escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Australia_national_football_team_badge.svg/960px-Australia_national_football_team_badge.svg.png' },
  { nome: 'Turquia',        escudo_url: 'https://upload.wikimedia.org/wikipedia/en/7/70/Turkish_Football_Federation_crest.svg' },
  // GRUPO E
  { nome: 'Alemanha',       escudo_url: 'https://images.vexels.com/media/users/3/152460/isolated/preview/825e80bac186d247dd9332f1440d20df-logo-do-time-de-futebol-da-alemanha.png?w=360' },
  { nome: 'Curaçao',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/f/f7/Federashon_Futb%C3%B2l_K%C3%B2rsou.png' },
  { nome: 'Costa do Marfim',escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/a/a1/F%C3%A9d%C3%A9ration_Ivorienne_de_Football.png' },
  { nome: 'Equador',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/7/74/FEFecu.png' },
  // GRUPO F
  { nome: 'Holanda',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/a/a1/Netherlands_national_football_team_logo_2017.png' },
  { nome: 'Japão',          escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/3/32/JapanFA.png' },
  { nome: 'Tunísia',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/8/88/F%C3%A9d%C3%A9ration_Tunisienne_de_Football.png' },
  { nome: 'Suécia',         escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/1/14/SFSverige.png' },
  // GRUPO G
  { nome: 'Bélgica',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/b/b0/Royal_Belgian_FA_logo_2019.png' },
  { nome: 'Egito',          escudo_url: 'https://www.futbox.com/img/v1/f72/e1a/49e/39b/7492f8ff6aa555b47d2c_zoom.png' },
  { nome: 'Irã',            escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/a/a6/Football_Federation_Islamic_Republic_of_Iran.png' },
  { nome: 'Nova Zelândia',  escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/d/db/New_Zealand_Football.png' },
  // GRUPO H
  { nome: 'Espanha',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/3/31/Spain_National_Football_Team_badge.png' },
  { nome: 'Cabo Verde',     escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/e/e1/Federa%C3%A7%C3%A3o_Cabo-Verdiana_de_Futebol.png' },
  { nome: 'Arábia Saudita', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/0/01/SAFF.png' },
  { nome: 'Uruguai',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/0/04/AUF.png' },
  // GRUPO I
  { nome: 'França',         escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/2/25/Logo_Sele%C3%A7%C3%A3o_Francesa_2018.png' },
  { nome: 'Senegal',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/7/7c/FSenegalaiseF.png' },
  { nome: 'Iraque',         escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Iraq_National_Team_Badge_2021_v1.svg/960px-Iraq_National_Team_Badge_2021_v1.svg.png' },
  { nome: 'Noruega',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/9/97/Sele%C3%A7%C3%A3o_Norueguesa_de_Futebol_Logo.png' },
  // GRUPO J
  { nome: 'Argentina',      escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/f/fc/230px-Afa_logo.svg.png' },
  { nome: 'Argélia',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/6/6b/Algeria_National_Football_Team_logo.png' },
  { nome: 'Áustria',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/c/cb/OFB.png' },
  { nome: 'Jordânia',       escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/4/44/Jordan_Football_Association.png' },
  // GRUPO K
  { nome: 'Portugal',       escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/7/75/Portugal_FPF.png' },
  { nome: 'Colômbia',       escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/4/47/Federacion_Colombiana_de_Futbol_logo.svg.png' },
  { nome: 'Uzbequistão',    escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/thumb/b/b6/Uzbekistan_Football_Federation.png/250px-Uzbekistan_Football_Federation.png' },
  { nome: 'RD Congo',       escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/8/8b/F%C3%A9d%C3%A9ration_Congolaise_de_Football.png' },
  // GRUPO L
  { nome: 'Inglaterra',     escudo_url: 'https://upload.wikimedia.org/wikipedia/en/8/8b/England_national_football_team_crest.svg' },
  { nome: 'Croácia',        escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/c/cf/Croatia_football_federation.png' },
  { nome: 'Gana',           escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/6/67/Ghana_Football_Association.png' },
  { nome: 'Panamá',         escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/a/aa/Panama_FA_2.svg.png' },
]

// ─── JOGOS (72 partidas, horários de Brasília) ───────────────────────────────

const RODADA_1 = [
  { data: '2026-06-11T16:00:00', casa: 'México',          fora: 'África do Sul' },
  { data: '2026-06-11T23:00:00', casa: 'Coreia do Sul',   fora: 'Rep. Tcheca' },
  { data: '2026-06-12T16:00:00', casa: 'Canadá',          fora: 'Bósnia H.' },
  { data: '2026-06-12T22:00:00', casa: 'EUA',             fora: 'Paraguai' },
  { data: '2026-06-13T16:00:00', casa: 'Qatar',           fora: 'Suíça' },
  { data: '2026-06-13T19:00:00', casa: 'Brasil',          fora: 'Marrocos' },
  { data: '2026-06-13T22:00:00', casa: 'Haiti',           fora: 'Escócia' },
  { data: '2026-06-14T01:00:00', casa: 'Austrália',       fora: 'Turquia' },
  { data: '2026-06-14T14:00:00', casa: 'Alemanha',        fora: 'Curaçao' },
  { data: '2026-06-14T17:00:00', casa: 'Holanda',         fora: 'Japão' },
  { data: '2026-06-14T20:00:00', casa: 'Costa do Marfim', fora: 'Equador' },
  { data: '2026-06-14T22:00:00', casa: 'Suécia',          fora: 'Tunísia' },
  { data: '2026-06-15T13:00:00', casa: 'Espanha',         fora: 'Cabo Verde' },
  { data: '2026-06-15T16:00:00', casa: 'Bélgica',         fora: 'Egito' },
  { data: '2026-06-15T19:00:00', casa: 'Arábia Saudita',  fora: 'Uruguai' },
  { data: '2026-06-15T22:00:00', casa: 'Irã',             fora: 'Nova Zelândia' },
  { data: '2026-06-16T16:00:00', casa: 'França',          fora: 'Senegal' },
  { data: '2026-06-16T19:00:00', casa: 'Iraque',          fora: 'Noruega' },
  { data: '2026-06-16T22:00:00', casa: 'Argentina',       fora: 'Argélia' },
  { data: '2026-06-17T01:00:00', casa: 'Áustria',         fora: 'Jordânia' },
  { data: '2026-06-17T14:00:00', casa: 'Portugal',        fora: 'RD Congo' },
  { data: '2026-06-17T17:00:00', casa: 'Inglaterra',      fora: 'Croácia' },
  { data: '2026-06-17T20:00:00', casa: 'Gana',            fora: 'Panamá' },
  { data: '2026-06-17T21:00:00', casa: 'Uzbequistão',     fora: 'Colômbia' },
]

const RODADA_2 = [
  { data: '2026-06-18T13:00:00', casa: 'Rep. Tcheca',     fora: 'África do Sul' },
  { data: '2026-06-18T16:00:00', casa: 'Suíça',           fora: 'Bósnia H.' },
  { data: '2026-06-18T19:00:00', casa: 'Canadá',          fora: 'Qatar' },
  { data: '2026-06-18T22:00:00', casa: 'México',          fora: 'Coreia do Sul' },
  { data: '2026-06-19T00:00:00', casa: 'Turquia',         fora: 'Paraguai' },
  { data: '2026-06-19T16:00:00', casa: 'EUA',             fora: 'Austrália' },
  { data: '2026-06-19T19:00:00', casa: 'Escócia',         fora: 'Marrocos' },
  { data: '2026-06-19T21:30:00', casa: 'Brasil',          fora: 'Haiti' },
  { data: '2026-06-20T14:00:00', casa: 'Holanda',         fora: 'Suécia' },
  { data: '2026-06-20T17:00:00', casa: 'Alemanha',        fora: 'Costa do Marfim' },
  { data: '2026-06-20T21:00:00', casa: 'Equador',         fora: 'Curaçao' },
  { data: '2026-06-20T23:00:00', casa: 'Tunísia',         fora: 'Japão' },
  { data: '2026-06-21T13:00:00', casa: 'Espanha',         fora: 'Arábia Saudita' },
  { data: '2026-06-21T16:00:00', casa: 'Bélgica',         fora: 'Irã' },
  { data: '2026-06-21T19:00:00', casa: 'Uruguai',         fora: 'Cabo Verde' },
  { data: '2026-06-21T22:00:00', casa: 'Nova Zelândia',   fora: 'Egito' },
  { data: '2026-06-22T14:00:00', casa: 'Argentina',       fora: 'Áustria' },
  { data: '2026-06-22T18:00:00', casa: 'França',          fora: 'Iraque' },
  { data: '2026-06-22T21:00:00', casa: 'Noruega',         fora: 'Senegal' },
  { data: '2026-06-23T00:00:00', casa: 'Jordânia',        fora: 'Argélia' },
  { data: '2026-06-23T14:00:00', casa: 'Portugal',        fora: 'Uzbequistão' },
  { data: '2026-06-23T17:00:00', casa: 'Inglaterra',      fora: 'Gana' },
  { data: '2026-06-23T20:00:00', casa: 'Panamá',          fora: 'Croácia' },
  { data: '2026-06-23T23:00:00', casa: 'Colômbia',        fora: 'RD Congo' },
]

const RODADA_3 = [
  { data: '2026-06-24T16:00:00', casa: 'Suíça',           fora: 'Canadá' },
  { data: '2026-06-24T16:00:00', casa: 'Bósnia H.',       fora: 'Qatar' },
  { data: '2026-06-24T19:00:00', casa: 'Escócia',         fora: 'Brasil' },
  { data: '2026-06-24T19:00:00', casa: 'Marrocos',        fora: 'Haiti' },
  { data: '2026-06-24T22:00:00', casa: 'Rep. Tcheca',     fora: 'México' },
  { data: '2026-06-24T22:00:00', casa: 'África do Sul',   fora: 'Coreia do Sul' },
  { data: '2026-06-25T17:00:00', casa: 'Equador',         fora: 'Alemanha' },
  { data: '2026-06-25T17:00:00', casa: 'Curaçao',         fora: 'Costa do Marfim' },
  { data: '2026-06-25T20:00:00', casa: 'Japão',           fora: 'Suécia' },
  { data: '2026-06-25T20:00:00', casa: 'Tunísia',         fora: 'Holanda' },
  { data: '2026-06-25T23:00:00', casa: 'Turquia',         fora: 'EUA' },
  { data: '2026-06-25T23:00:00', casa: 'Paraguai',        fora: 'Austrália' },
  { data: '2026-06-26T16:00:00', casa: 'Noruega',         fora: 'França' },
  { data: '2026-06-26T16:00:00', casa: 'Senegal',         fora: 'Iraque' },
  { data: '2026-06-26T21:00:00', casa: 'Cabo Verde',      fora: 'Arábia Saudita' },
  { data: '2026-06-26T21:00:00', casa: 'Uruguai',         fora: 'Espanha' },
  { data: '2026-06-27T00:00:00', casa: 'Egito',           fora: 'Irã' },
  { data: '2026-06-27T00:00:00', casa: 'Nova Zelândia',   fora: 'Bélgica' },
  { data: '2026-06-27T18:00:00', casa: 'Panamá',          fora: 'Inglaterra' },
  { data: '2026-06-27T18:00:00', casa: 'Croácia',         fora: 'Gana' },
  { data: '2026-06-27T20:30:00', casa: 'Colômbia',        fora: 'Portugal' },
  { data: '2026-06-27T20:30:00', casa: 'RD Congo',        fora: 'Uzbequistão' },
  { data: '2026-06-27T23:00:00', casa: 'Argélia',         fora: 'Áustria' },
  { data: '2026-06-27T23:00:00', casa: 'Jordânia',        fora: 'Argentina' },
]

// Rodada 1 abre no dia 11/06 às 12h Brasília (15:00 UTC), fecha às 12h do dia 11
// O prazo de apostas é antes do primeiro jogo de cada rodada
const RODADAS_CONFIG = [
  { numero: 1, dataFechamento: '2026-06-11T15:00:00Z' }, // 12:00 Brasília em 11/06
  { numero: 2, dataFechamento: '2026-06-18T16:00:00Z' }, // 13:00 Brasília em 18/06 (antes do 1º jogo R2)
  { numero: 3, dataFechamento: '2026-06-24T19:00:00Z' }, // 16:00 Brasília em 24/06 (antes do 1º jogo R3)
]

// ─── FUNÇÕES ─────────────────────────────────────────────────────────────────

async function cadastrarSelecoes() {
  console.log('\n📋 PASSO 1: Seleções e escudos')
  console.log('─'.repeat(50))

  let cadastradas = 0, existentes = 0, erros = 0

  for (const s of SELECOES) {
    try {
      const existe = await prisma.selecao.findFirst({ where: { nome: s.nome } })
      if (existe) {
        await prisma.selecao.update({ where: { id: existe.id }, data: { escudo_url: s.escudo_url } })
      } else {
        await prisma.selecao.create({ data: { nome: s.nome, escudo_url: s.escudo_url } })
      }
      process.stdout.write('.')
      cadastradas++
    } catch (err) {
      console.error(`\n❌ ${s.nome}: ${err.message}`)
      erros++
    }
  }

  console.log(`\n✅ ${cadastradas} seleções prontas | ❌ ${erros} erros`)
}

async function importarJogos() {
  console.log('\n📋 PASSO 2: Jogos da Copa 2026')
  console.log('─'.repeat(50))

  const selecoes = await prisma.selecao.findMany()
  const map = {}
  selecoes.forEach(s => { map[s.nome] = s.id })

  const rodadas = [
    { num: 1, jogos: RODADA_1 },
    { num: 2, jogos: RODADA_2 },
    { num: 3, jogos: RODADA_3 },
  ]

  let total = 0, erros = 0

  for (const r of rodadas) {
    console.log(`\n  Rodada ${r.num} (${r.jogos.length} jogos):`)
    for (const j of r.jogos) {
      const casaId = map[j.casa]
      const foraId = map[j.fora]

      if (!casaId || !foraId) {
        console.error(`  ❌ Seleção não encontrada: ${j.casa} x ${j.fora}`)
        erros++
        continue
      }

      const existe = await prisma.partida.findFirst({
        where: { selecaoCasaId: casaId, selecaoForaId: foraId, data: new Date(j.data) },
      })

      if (existe) {
        if (existe.rodada !== r.num) {
          await prisma.partida.update({ where: { id: existe.id }, data: { rodada: r.num } })
        }
      } else {
        await prisma.partida.create({
          data: {
            selecaoCasaId: casaId,
            selecaoForaId: foraId,
            data: new Date(j.data),
            placarCasa: 0,
            placarFora: 0,
            status: 'AGENDADA',
            rodada: r.num,
          },
        })
      }

      process.stdout.write('.')
      total++
    }
  }

  console.log(`\n✅ ${total} partidas importadas | ❌ ${erros} erros`)
}

async function criarRodadas() {
  console.log('\n📋 PASSO 3: Registros de Rodada (controle de apostas)')
  console.log('─'.repeat(50))

  for (const r of RODADAS_CONFIG) {
    const rodada = await prisma.rodada.upsert({
      where: { numero: r.numero },
      update: { dataFechamento: new Date(r.dataFechamento) },
      create: {
        numero: r.numero,
        status: 'ABERTA',
        dataFechamento: new Date(r.dataFechamento),
      },
    })
    const local = new Date(r.dataFechamento).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    console.log(`  Rodada ${r.numero}: prazo de apostas até ${local} (Brasília)`)
  }

  console.log('✅ Rodadas configuradas')
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗')
  console.log('║        SETUP — COPA 2026 BOLÃO                      ║')
  console.log('╚══════════════════════════════════════════════════════╝')

  try {
    await cadastrarSelecoes()
    await importarJogos()
    await criarRodadas()

    console.log('\n╔══════════════════════════════════════════════════════╗')
    console.log('║  ✅ SETUP CONCLUÍDO COM SUCESSO!                    ║')
    console.log('║                                                      ║')
    console.log('║  Próximos passos:                                    ║')
    console.log('║  1. node scripts/importarJogadoresElite.js           ║')
    console.log('║  2. node scripts/importarJogadoresForte.js           ║')
    console.log('║  3. node scripts/importarJogadoresMedios.js          ║')
    console.log('║  4. node scripts/importarJogadoresFracoRuim.js       ║')
    console.log('║  5. pm2 start scripts/automacao.js --name automacao  ║')
    console.log('╚══════════════════════════════════════════════════════╝\n')
  } catch (err) {
    console.error('\n💥 Erro fatal no setup:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
