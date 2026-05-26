const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ============================================
// 👑 TIER ELITE (6 seleções - 66 jogadores)
// Brasil, França, Argentina, Inglaterra, Espanha, Portugal
// Preços base: GOL: 12 | DEF: 10 | MEI: 12 | ATA: 15
// ============================================

const JOGADORES_ELITE = {
  
  // 🇧🇷 BRASIL
  'Brasil': [
    { nome: 'Bento', posicao: 'GOL', preco: 10, foto_url: null },
    { nome: 'Ibañez', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Marquinhos', posicao: 'DEF', preco: 10, foto_url: null },
    { nome: 'Léo Pereira', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Douglas Santos', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Casemiro', posicao: 'MEI', preco: 11, foto_url: null },
    { nome: 'Danilo', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Luiz Henrique', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Vinícius Júnior', posicao: 'ATA', preco: 15, foto_url: null },
    { nome: 'Matheus Cunha', posicao: 'ATA', preco: 11, foto_url: null },
    { nome: 'João Pedro', posicao: 'ATA', preco: 10, foto_url: null },
  ],

  // 🇫🇷 FRANÇA
  'França': [
    { nome: 'Mike Maignan', posicao: 'GOL', preco: 11, foto_url: null },
    { nome: 'Jules Koundé', posicao: 'DEF', preco: 10, foto_url: null },
    { nome: 'William Saliba', posicao: 'DEF', preco: 10, foto_url: null },
    { nome: 'Dayot Upamecano', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Theo Hernández', posicao: 'DEF', preco: 10, foto_url: null },
    { nome: 'Aurélien Tchouaméni', posicao: 'MEI', preco: 11, foto_url: null },
    { nome: 'Eduardo Camavinga', posicao: 'MEI', preco: 10, foto_url: null },
    { nome: 'Antoine Griezmann', posicao: 'MEI', preco: 12, foto_url: null },
    { nome: 'Kylian Mbappé', posicao: 'ATA', preco: 15, foto_url: null },
    { nome: 'Marcus Thuram', posicao: 'ATA', preco: 11, foto_url: null },
    { nome: 'Ousmane Dembélé', posicao: 'ATA', preco: 12, foto_url: null },
  ],

  // 🇦🇷 ARGENTINA
  'Argentina': [
    { nome: 'Emiliano Martínez', posicao: 'GOL', preco: 12, foto_url: null },
    { nome: 'Nahuel Molina', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Cristian Romero', posicao: 'DEF', preco: 10, foto_url: null },
    { nome: 'Nicolás Otamendi', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Nicolás Tagliafico', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Rodrigo De Paul', posicao: 'MEI', preco: 10, foto_url: null },
    { nome: 'Enzo Fernández', posicao: 'MEI', preco: 11, foto_url: null },
    { nome: 'Alexis Mac Allister', posicao: 'MEI', preco: 11, foto_url: null },
    { nome: 'Lionel Messi', posicao: 'ATA', preco: 15, foto_url: null },
    { nome: 'Lautaro Martínez', posicao: 'ATA', preco: 14, foto_url: null },
    { nome: 'Julián Álvarez', posicao: 'ATA', preco: 13, foto_url: null },
  ],

  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 INGLATERRA
  'Inglaterra': [
    { nome: 'Jordan Pickford', posicao: 'GOL', preco: 10, foto_url: null },
    { nome: 'Kyle Walker', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'John Stones', posicao: 'DEF', preco: 10, foto_url: null },
    { nome: 'Harry Maguire', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Luke Shaw', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Declan Rice', posicao: 'MEI', preco: 12, foto_url: null },
    { nome: 'Jude Bellingham', posicao: 'MEI', preco: 13, foto_url: null },
    { nome: 'Phil Foden', posicao: 'MEI', preco: 12, foto_url: null },
    { nome: 'Harry Kane', posicao: 'ATA', preco: 15, foto_url: null },
    { nome: 'Bukayo Saka', posicao: 'ATA', preco: 14, foto_url: null },
    { nome: 'Marcus Rashford', posicao: 'ATA', preco: 11, foto_url: null },
  ],

  // 🇪🇸 ESPANHA
  'Espanha': [
    { nome: 'Unai Simón', posicao: 'GOL', preco: 11, foto_url: null },
    { nome: 'Dani Carvajal', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Aymeric Laporte', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Nacho Fernández', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Marc Cucurella', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Rodri', posicao: 'MEI', preco: 13, foto_url: null },
    { nome: 'Pedri', posicao: 'MEI', preco: 12, foto_url: null },
    { nome: 'Gavi', posicao: 'MEI', preco: 11, foto_url: null },
    { nome: 'Álvaro Morata', posicao: 'ATA', preco: 11, foto_url: null },
    { nome: 'Nico Williams', posicao: 'ATA', preco: 13, foto_url: null },
    { nome: 'Lamine Yamal', posicao: 'ATA', preco: 15, foto_url: null },
  ],

  // 🇵🇹 PORTUGAL
  'Portugal': [
    { nome: 'Diogo Costa', posicao: 'GOL', preco: 11, foto_url: null },
    { nome: 'João Cancelo', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Rúben Dias', posicao: 'DEF', preco: 10, foto_url: null },
    { nome: 'António Silva', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Nuno Mendes', posicao: 'DEF', preco: 9, foto_url: null },
    { nome: 'Bruno Fernandes', posicao: 'MEI', preco: 12, foto_url: null },
    { nome: 'Bernardo Silva', posicao: 'MEI', preco: 12, foto_url: null },
    { nome: 'Vitinha', posicao: 'MEI', preco: 10, foto_url: null },
    { nome: 'Cristiano Ronaldo', posicao: 'ATA', preco: 15, foto_url: null },
    { nome: 'Rafael Leão', posicao: 'ATA', preco: 12, foto_url: null },
    { nome: 'Gonçalo Ramos', posicao: 'ATA', preco: 12, foto_url: null },
  ],
}

async function importarElite() {
  console.log('👑 Importando jogadores TIER ELITE...\n')
  
  try {
    const selecoes = await prisma.selecao.findMany()
    const selecaoMap = {}
    selecoes.forEach(s => { selecaoMap[s.nome] = s.id })
    
    let total = 0
    
    for (const [nomeSelecao, jogadores] of Object.entries(JOGADORES_ELITE)) {
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
          console.log(`⏭️  ${jog.nome.padEnd(25)} ${jog.posicao} ${jog.preco}💰`)
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
        
        console.log(`✅ ${jog.nome.padEnd(25)} ${jog.posicao} ${jog.preco}💰`)
        total++
      }
    }
    
    console.log('\n' + '━'.repeat(70))
    console.log(`🎉 ${total} jogadores ELITE importados!`)
    console.log('━'.repeat(70) + '\n')
    
  } catch (error) {
    console.error('💥 Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importarElite()
