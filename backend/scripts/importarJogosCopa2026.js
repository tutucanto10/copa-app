const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// RODADA 1 - Horários de Brasília (dos arquivos oficiais)
const RODADA_1 = [
  { data: '2026-06-11T16:00:00', casa: 'México', fora: 'África do Sul' },
  { data: '2026-06-11T23:00:00', casa: 'Coreia do Sul', fora: 'Rep. Tcheca' },
  { data: '2026-06-12T16:00:00', casa: 'Canadá', fora: 'Bósnia H.' },
  { data: '2026-06-12T22:00:00', casa: 'EUA', fora: 'Paraguai' },
  { data: '2026-06-13T16:00:00', casa: 'Qatar', fora: 'Suíça' },
  { data: '2026-06-13T19:00:00', casa: 'Brasil', fora: 'Marrocos' },
  { data: '2026-06-13T22:00:00', casa: 'Haiti', fora: 'Escócia' },
  { data: '2026-06-14T01:00:00', casa: 'Austrália', fora: 'Turquia' },
  { data: '2026-06-14T14:00:00', casa: 'Alemanha', fora: 'Curaçao' },
  { data: '2026-06-14T20:00:00', casa: 'Costa do Marfim', fora: 'Equador' },
  { data: '2026-06-14T17:00:00', casa: 'Holanda', fora: 'Japão' },
  { data: '2026-06-14T22:00:00', casa: 'Suécia', fora: 'Tunísia' },
  { data: '2026-06-15T13:00:00', casa: 'Espanha', fora: 'Cabo Verde' },
  { data: '2026-06-15T19:00:00', casa: 'Arábia Saudita', fora: 'Uruguai' },
  { data: '2026-06-15T16:00:00', casa: 'Bélgica', fora: 'Egito' },
  { data: '2026-06-15T22:00:00', casa: 'Irã', fora: 'Nova Zelândia' },
  { data: '2026-06-17T01:00:00', casa: 'Áustria', fora: 'Jordânia' },
  { data: '2026-06-16T16:00:00', casa: 'França', fora: 'Senegal' },
  { data: '2026-06-16T19:00:00', casa: 'Iraque', fora: 'Noruega' },
  { data: '2026-06-16T22:00:00', casa: 'Argentina', fora: 'Argélia' },
  { data: '2026-06-17T14:00:00', casa: 'Portugal', fora: 'RD Congo' },
  { data: '2026-06-17T17:00:00', casa: 'Inglaterra', fora: 'Croácia' },
  { data: '2026-06-17T20:00:00', casa: 'Gana', fora: 'Panamá' },
  { data: '2026-06-17T21:00:00', casa: 'Uzbequistão', fora: 'Colômbia' },
]

// RODADA 2
const RODADA_2 = [
  { data: '2026-06-18T13:00:00', casa: 'Rep. Tcheca', fora: 'África do Sul' },
  { data: '2026-06-18T16:00:00', casa: 'Suíça', fora: 'Bósnia H.' },
  { data: '2026-06-18T19:00:00', casa: 'Canadá', fora: 'Qatar' },
  { data: '2026-06-18T22:00:00', casa: 'México', fora: 'Coreia do Sul' },
  { data: '2026-06-19T00:00:00', casa: 'Turquia', fora: 'Paraguai' },
  { data: '2026-06-19T16:00:00', casa: 'EUA', fora: 'Austrália' },
  { data: '2026-06-19T19:00:00', casa: 'Escócia', fora: 'Marrocos' },
  { data: '2026-06-19T21:30:00', casa: 'Brasil', fora: 'Haiti' },
  { data: '2026-06-20T23:00:00', casa: 'Tunísia', fora: 'Japão' },
  { data: '2026-06-20T14:00:00', casa: 'Holanda', fora: 'Suécia' },
  { data: '2026-06-20T17:00:00', casa: 'Alemanha', fora: 'Costa do Marfim' },
  { data: '2026-06-20T21:00:00', casa: 'Equador', fora: 'Curaçao' },
  { data: '2026-06-21T13:00:00', casa: 'Espanha', fora: 'Arábia Saudita' },
  { data: '2026-06-21T16:00:00', casa: 'Bélgica', fora: 'Irã' },
  { data: '2026-06-21T19:00:00', casa: 'Uruguai', fora: 'Cabo Verde' },
  { data: '2026-06-21T22:00:00', casa: 'Nova Zelândia', fora: 'Egito' },
  { data: '2026-06-22T14:00:00', casa: 'Argentina', fora: 'Áustria' },
  { data: '2026-06-22T18:00:00', casa: 'França', fora: 'Iraque' },
  { data: '2026-06-22T21:00:00', casa: 'Noruega', fora: 'Senegal' },
  { data: '2026-06-23T00:00:00', casa: 'Jordânia', fora: 'Argélia' },
  { data: '2026-06-23T14:00:00', casa: 'Portugal', fora: 'Uzbequistão' },
  { data: '2026-06-23T17:00:00', casa: 'Inglaterra', fora: 'Gana' },
  { data: '2026-06-23T20:00:00', casa: 'Panamá', fora: 'Croácia' },
  { data: '2026-06-23T23:00:00', casa: 'Colômbia', fora: 'RD Congo' },
]

// RODADA 3
const RODADA_3 = [
  { data: '2026-06-24T16:00:00', casa: 'Suíça', fora: 'Canadá' },
  { data: '2026-06-24T16:00:00', casa: 'Bósnia H.', fora: 'Qatar' },
  { data: '2026-06-24T19:00:00', casa: 'Escócia', fora: 'Brasil' },
  { data: '2026-06-24T19:00:00', casa: 'Marrocos', fora: 'Haiti' },
  { data: '2026-06-24T22:00:00', casa: 'Rep. Tcheca', fora: 'México' },
  { data: '2026-06-24T22:00:00', casa: 'África do Sul', fora: 'Coreia do Sul' },
  { data: '2026-06-25T17:00:00', casa: 'Equador', fora: 'Alemanha' },
  { data: '2026-06-25T17:00:00', casa: 'Curaçao', fora: 'Costa do Marfim' },
  { data: '2026-06-25T20:00:00', casa: 'Japão', fora: 'Suécia' },
  { data: '2026-06-25T20:00:00', casa: 'Tunísia', fora: 'Holanda' },
  { data: '2026-06-25T23:00:00', casa: 'Turquia', fora: 'EUA' },
  { data: '2026-06-25T23:00:00', casa: 'Paraguai', fora: 'Austrália' },
  { data: '2026-06-26T16:00:00', casa: 'Noruega', fora: 'França' },
  { data: '2026-06-26T16:00:00', casa: 'Senegal', fora: 'Iraque' },
  { data: '2026-06-26T21:00:00', casa: 'Cabo Verde', fora: 'Arábia Saudita' },
  { data: '2026-06-26T21:00:00', casa: 'Uruguai', fora: 'Espanha' },
  { data: '2026-06-27T00:00:00', casa: 'Egito', fora: 'Irã' },
  { data: '2026-06-27T00:00:00', casa: 'Nova Zelândia', fora: 'Bélgica' },
  { data: '2026-06-27T18:00:00', casa: 'Panamá', fora: 'Inglaterra' },
  { data: '2026-06-27T18:00:00', casa: 'Croácia', fora: 'Gana' },
  { data: '2026-06-27T20:30:00', casa: 'Colômbia', fora: 'Portugal' },
  { data: '2026-06-27T20:30:00', casa: 'RD Congo', fora: 'Uzbequistão' },
  { data: '2026-06-27T23:00:00', casa: 'Argélia', fora: 'Áustria' },
  { data: '2026-06-27T23:00:00', casa: 'Jordânia', fora: 'Argentina' },
]

async function importar() {
  console.log('⚽ Importando jogos da Copa 2026...\n')
  
  try {
    // Buscar seleções
    const selecoes = await prisma.selecao.findMany()
    const map = {}
    selecoes.forEach(s => { map[s.nome] = s.id })
    
    console.log(`✅ ${selecoes.length} seleções encontradas\n`)
    
    const rodadas = [
      { num: 1, jogos: RODADA_1 },
      { num: 2, jogos: RODADA_2 },
      { num: 3, jogos: RODADA_3 },
    ]
    
    for (const r of rodadas) {
      console.log(`\n📅 RODADA ${r.num}`)
      console.log('━'.repeat(70))
      
      for (const j of r.jogos) {
        const casaId = map[j.casa]
        const foraId = map[j.fora]
        
        if (!casaId || !foraId) {
          console.log(`❌ Seleção não encontrada: ${j.casa} x ${j.fora}`)
          continue
        }
        
        // Verifica se já existe
        const existe = await prisma.partida.findFirst({
          where: {
            selecaoCasaId: casaId,
            selecaoForaId: foraId,
            data: new Date(j.data)
          }
        })
        
        if (existe) {
          // Atualiza a rodada se estiver diferente
          if (existe.rodada !== r.num) {
            await prisma.partida.update({
              where: { id: existe.id },
              data: { rodada: r.num }
            })
            console.log(`🔄 ${j.casa.padEnd(18)} x ${j.fora.padEnd(18)} → Rodada atualizada`)
          }
          continue
        }
        
        // Cria novo jogo
        await prisma.partida.create({
          data: {
            selecaoCasaId: casaId,
            selecaoForaId: foraId,
            data: new Date(j.data),
            placarCasa: 0,
            placarFora: 0,
            status: 'AGENDADA',
            rodada: r.num
          }
        })
        
        const hora = new Date(j.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        console.log(`✅ ${j.casa.padEnd(18)} x ${j.fora.padEnd(18)} ${hora}`)
      }
    }
    
    console.log('\n' + '━'.repeat(70))
    console.log('🎉 Importação concluída!')
    console.log('━'.repeat(70) + '\n')
    
  } catch (error) {
    console.error('💥 Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importar()
