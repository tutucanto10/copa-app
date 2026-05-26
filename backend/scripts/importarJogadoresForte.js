const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ============================================
// ⭐⭐ TIER FORTE (7 seleções - 77 jogadores)
// Alemanha, Holanda, Bélgica, Croácia, Uruguai, EUA, México
// Preços base: GOL: 10 | DEF: 8 | MEI: 10 | ATA: 12
// ============================================

const JOGADORES_FORTE = {
  
  // 🇩🇪 ALEMANHA
  'Alemanha': [
    { nome: 'Marc-André ter Stegen', posicao: 'GOL', preco: 10, foto_url: null },
    { nome: 'Joshua Kimmich', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Antonio Rüdiger', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Nico Schlotterbeck', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'David Raum', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'İlkay Gündoğan', posicao: 'MEI', preco: 10, foto_url: null },
    { nome: 'Toni Kroos', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Jamal Musiala', posicao: 'MEI', preco: 11, foto_url: null },
    { nome: 'Kai Havertz', posicao: 'ATA', preco: 11, foto_url: null },
    { nome: 'Florian Wirtz', posicao: 'ATA', preco: 12, foto_url: null },
    { nome: 'Leroy Sané', posicao: 'ATA', preco: 10, foto_url: null },
  ],

  // 🇳🇱 HOLANDA
  'Holanda': [
    { nome: 'Bart Verbruggen', posicao: 'GOL', preco: 9, foto_url: null },
    { nome: 'Denzel Dumfries', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Virgil van Dijk', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Nathan Aké', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Jeremie Frimpong', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Frenkie de Jong', posicao: 'MEI', preco: 10, foto_url: null },
    { nome: 'Tijjani Reijnders', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Xavi Simons', posicao: 'MEI', preco: 10, foto_url: null },
    { nome: 'Memphis Depay', posicao: 'ATA', preco: 10, foto_url: null },
    { nome: 'Cody Gakpo', posicao: 'ATA', preco: 11, foto_url: null },
    { nome: 'Donyell Malen', posicao: 'ATA', preco: 9, foto_url: null },
  ],

  // 🇧🇪 BÉLGICA
  'Bélgica': [
    { nome: 'Thibaut Courtois', posicao: 'GOL', preco: 10, foto_url: null },
    { nome: 'Timothy Castagne', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Wout Faes', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Arthur Theate', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Maxim De Cuyper', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Amadou Onana', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Kevin De Bruyne', posicao: 'MEI', preco: 11, foto_url: null },
    { nome: 'Youri Tielemans', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Jérémy Doku', posicao: 'ATA', preco: 11, foto_url: null },
    { nome: 'Romelu Lukaku', posicao: 'ATA', preco: 10, foto_url: null },
    { nome: 'Loïs Openda', posicao: 'ATA', preco: 10, foto_url: null },
  ],

  // 🇭🇷 CROÁCIA
  'Croácia': [
    { nome: 'Dominik Livaković', posicao: 'GOL', preco: 9, foto_url: null },
    { nome: 'Josip Juranović', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Joško Gvardiol', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Duje Ćaleta-Car', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Borna Sosa', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Luka Modrić', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Mateo Kovačić', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Marcelo Brozović', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Ivan Perišić', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Andrej Kramarić', posicao: 'ATA', preco: 9, foto_url: null },
    { nome: 'Bruno Petković', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🇺🇾 URUGUAI
  'Uruguai': [
    { nome: 'Sergio Rochet', posicao: 'GOL', preco: 8, foto_url: null },
    { nome: 'Nahitan Nández', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Ronald Araújo', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Sebastián Cáceres', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Mathías Olivera', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Federico Valverde', posicao: 'MEI', preco: 11, foto_url: null },
    { nome: 'Manuel Ugarte', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Nicolás de la Cruz', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Darwin Núñez', posicao: 'ATA', preco: 11, foto_url: null },
    { nome: 'Luis Suárez', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Facundo Pellistri', posicao: 'ATA', preco: 8, foto_url: null },
  ],

  // 🇺🇸 EUA
  'EUA': [
    { nome: 'Matt Turner', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Sergiño Dest', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Cameron Carter-Vickers', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Chris Richards', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Antonee Robinson', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Tyler Adams', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Weston McKennie', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Yunus Musah', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Christian Pulisic', posicao: 'ATA', preco: 11, foto_url: null },
    { nome: 'Timothy Weah', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Folarin Balogun', posicao: 'ATA', preco: 9, foto_url: null },
  ],

  // 🇲🇽 MÉXICO
  'México': [
    { nome: 'Guillermo Ochoa', posicao: 'GOL', preco: 8, foto_url: null },
    { nome: 'Jorge Sánchez', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'César Montes', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Johan Vásquez', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Gerardo Arteaga', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Edson Álvarez', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Luis Chávez', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Orbelín Pineda', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Hirving Lozano', posicao: 'ATA', preco: 9, foto_url: null },
    { nome: 'Santiago Giménez', posicao: 'ATA', preco: 10, foto_url: null },
    { nome: 'Alexis Vega', posicao: 'ATA', preco: 8, foto_url: null },
  ],
}

async function importarForte() {
  console.log('⭐⭐ Importando jogadores TIER FORTE...\n')
  
  try {
    const selecoes = await prisma.selecao.findMany()
    const selecaoMap = {}
    selecoes.forEach(s => { selecaoMap[s.nome] = s.id })
    
    let total = 0
    
    for (const [nomeSelecao, jogadores] of Object.entries(JOGADORES_FORTE)) {
      const selecaoId = selecaoMap[nomeSelecao]
      
      if (!selecaoId) {
        console.log(`❌ Seleção não encontrada: ${nomeSelecao}`)
        continue
      }
      
      console.log(`\n⚽ ${nomeSelecao.toUpperCase()}`)
      console.log('━'.repeat(70))
      
      for (const jog of jogadores) {
        const existe = await prisma.jogador.findFirst({
          where: { nome: jog.nome, selecaoId }
        })
        
        if (existe) {
          console.log(`⏭️  ${jog.nome.padEnd(30)} ${jog.posicao} ${jog.preco}💰`)
          continue
        }
        
        await prisma.jogador.create({
          data: {
            nome: jog.nome,
            posicao: jog.posicao,
            preco: jog.preco,
            foto_url: jog.foto_url,
            selecaoId
          }
        })
        
        console.log(`✅ ${jog.nome.padEnd(30)} ${jog.posicao} ${jog.preco}💰`)
        total++
      }
    }
    
    console.log('\n' + '━'.repeat(70))
    console.log(`🎉 ${total} jogadores FORTE importados!`)
    console.log('━'.repeat(70) + '\n')
    
  } catch (error) {
    console.error('💥 Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importarForte()
