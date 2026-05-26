const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ============================================
// ⭐ TIER MÉDIO (15 seleções - 165 jogadores)
// Colômbia, Marrocos, Japão, Coreia do Sul, Suíça, Senegal, 
// Austrália, Canadá, Equador, Turquia, Suécia, Noruega, 
// Escócia, Rep. Tcheca, Áustria
// Preços base: GOL: 8 | DEF: 6 | MEI: 8 | ATA: 10
// ============================================

const JOGADORES_MEDIO = {
  
  // 🇨🇴 COLÔMBIA
  'Colômbia': [
    { nome: 'Camilo Vargas', posicao: 'GOL', preco: 8, foto_url: null },
    { nome: 'Daniel Muñoz', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Davinson Sánchez', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Carlos Cuesta', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Johan Mojica', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Jefferson Lerma', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Richard Ríos', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'James Rodríguez', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Luis Díaz', posicao: 'ATA', preco: 10, foto_url: null },
    { nome: 'Jhon Durán', posicao: 'ATA', preco: 9, foto_url: null },
    { nome: 'Jhon Arias', posicao: 'ATA', preco: 8, foto_url: null },
  ],

  // 🇲🇦 MARROCOS
  'Marrocos': [
    { nome: 'Yassine Bounou', posicao: 'GOL', preco: 8, foto_url: null },
    { nome: 'Achraf Hakimi', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Nayef Aguerd', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Romain Saïss', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Noussair Mazraoui', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Sofyan Amrabat', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Azzedine Ounahi', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Hakim Ziyech', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Youssef En-Nesyri', posicao: 'ATA', preco: 9, foto_url: null },
    { nome: 'Sofiane Boufal', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Amine Harit', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🇯🇵 JAPÃO
  'Japão': [
    { nome: 'Shuichi Gonda', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Hiroki Ito', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Takehiro Tomiyasu', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Ko Itakura', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Yuta Nakayama', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Wataru Endo', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Hidemasa Morita', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Takefusa Kubo', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Kaoru Mitoma', posicao: 'ATA', preco: 10, foto_url: null },
    { nome: 'Junya Ito', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Ayase Ueda', posicao: 'ATA', preco: 8, foto_url: null },
  ],

  // 🇰🇷 COREIA DO SUL
  'Coreia do Sul': [
    { nome: 'Kim Seung-gyu', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Kim Min-jae', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Kim Young-gwon', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Kim Jin-su', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Lee Ki-je', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Hwang In-beom', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Lee Jae-sung', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Lee Kang-in', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Son Heung-min', posicao: 'ATA', preco: 10, foto_url: null },
    { nome: 'Hwang Hee-chan', posicao: 'ATA', preco: 9, foto_url: null },
    { nome: 'Cho Gue-sung', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🇨🇭 SUÍÇA
  'Suíça': [
    { nome: 'Yann Sommer', posicao: 'GOL', preco: 8, foto_url: null },
    { nome: 'Silvan Widmer', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Manuel Akanji', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Nico Elvedi', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Ricardo Rodriguez', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Granit Xhaka', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Remo Freuler', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Xherdan Shaqiri', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Breel Embolo', posicao: 'ATA', preco: 9, foto_url: null },
    { nome: 'Noah Okafor', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Ruben Vargas', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🇸🇳 SENEGAL
  'Senegal': [
    { nome: 'Édouard Mendy', posicao: 'GOL', preco: 8, foto_url: null },
    { nome: 'Youssouf Sabaly', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Kalidou Koulibaly', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Abdou Diallo', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Ismail Jakobs', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Idrissa Gueye', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Pape Matar Sarr', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Krepin Diatta', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Sadio Mané', posicao: 'ATA', preco: 9, foto_url: null },
    { nome: 'Ismaïla Sarr', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Boulaye Dia', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🇦🇺 AUSTRÁLIA
  'Austrália': [
    { nome: 'Mathew Ryan', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Nathaniel Atkinson', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Harry Souttar', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Kye Rowles', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Aziz Behich', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Jackson Irvine', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Aaron Mooy', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Ajdin Hrustic', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Mathew Leckie', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Mitchell Duke', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Craig Goodwin', posicao: 'ATA', preco: 6, foto_url: null },
  ],

  // 🇨🇦 CANADÁ
  'Canadá': [
    { nome: 'Milan Borjan', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Alistair Johnston', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Steven Vitória', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Kamal Miller', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Alphonso Davies', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'Stephen Eustáquio', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Ismaël Koné', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Jonathan David', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Alphonso Davies', posicao: 'ATA', preco: 9, foto_url: null },
    { nome: 'Cyle Larin', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Tajon Buchanan', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🇪🇨 EQUADOR
  'Equador': [
    { nome: 'Alexander Domínguez', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Ángelo Preciado', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Félix Torres', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Piero Hincapié', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Pervis Estupiñán', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Moisés Caicedo', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Carlos Gruezo', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Kendry Páez', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Enner Valencia', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Kevin Rodríguez', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Gonzalo Plata', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🇹🇷 TURQUIA
  'Turquia': [
    { nome: 'Uğurcan Çakır', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Zeki Çelik', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Çağlar Söyüncü', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Abdülkerim Bardakcı', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Ferdi Kadıoğlu', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Hakan Çalhanoğlu', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Orkun Kökçü', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Arda Güler', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Kerem Aktürkoğlu', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Barış Alper Yılmaz', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Kenan Yıldız', posicao: 'ATA', preco: 8, foto_url: null },
  ],

  // 🇸🇪 SUÉCIA
  'Suécia': [
    { nome: 'Robin Olsen', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Emil Krafth', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Victor Lindelöf', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Isak Hien', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Ludwig Augustinsson', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Dejan Kulusevski', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Jens Cajuste', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Jesper Karlsson', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Alexander Isak', posicao: 'ATA', preco: 10, foto_url: null },
    { nome: 'Viktor Gyökeres', posicao: 'ATA', preco: 9, foto_url: null },
    { nome: 'Anthony Elanga', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🇳🇴 NORUEGA
  'Noruega': [
    { nome: 'Ørjan Nyland', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Marcus Holmgren Pedersen', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Leo Skiri Østigård', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Andreas Hanche-Olsen', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'David Møller Wolfe', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Martin Ødegaard', posicao: 'MEI', preco: 9, foto_url: null },
    { nome: 'Sander Berge', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Patrick Berg', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Erling Haaland', posicao: 'ATA', preco: 10, foto_url: null },
    { nome: 'Antonio Nusa', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Oscar Bobb', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🏴󠁧󠁢󠁳󠁣󠁴󠁿 ESCÓCIA
  'Escócia': [
    { nome: 'Angus Gunn', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Aaron Hickey', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Scott McKenna', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Grant Hanley', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Andy Robertson', posicao: 'DEF', preco: 8, foto_url: null },
    { nome: 'John McGinn', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Callum McGregor', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Billy Gilmour', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Che Adams', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Lawrence Shankland', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Ryan Christie', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🇨🇿 REPÚBLICA TCHECA
  'Rep. Tcheca': [
    { nome: 'Jindřích Staněk', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Vladimír Coufal', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Tomáš Souček', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Ladislav Krejčí', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'David Jurásek', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Tomáš Souček', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Lukáš Provod', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Pavel Šulc', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Patrik Schick', posicao: 'ATA', preco: 9, foto_url: null },
    { nome: 'Adam Hložek', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Mojmír Chytil', posicao: 'ATA', preco: 7, foto_url: null },
  ],

  // 🇦🇹 ÁUSTRIA
  'Áustria': [
    { nome: 'Patrick Pentz', posicao: 'GOL', preco: 7, foto_url: null },
    { nome: 'Phillipp Mwene', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Kevin Danso', posicao: 'DEF', preco: 7, foto_url: null },
    { nome: 'Maximilian Wöber', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Philipp Lienhart', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Marcel Sabitzer', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Konrad Laimer', posicao: 'MEI', preco: 8, foto_url: null },
    { nome: 'Christoph Baumgartner', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Marko Arnautović', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Michael Gregoritsch', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Junior Adamu', posicao: 'ATA', preco: 7, foto_url: null },
  ],
}

async function importarMedio() {
  console.log('⭐ Importando jogadores TIER MÉDIO...\n')
  
  try {
    const selecoes = await prisma.selecao.findMany()
    const selecaoMap = {}
    selecoes.forEach(s => { selecaoMap[s.nome] = s.id })
    
    let total = 0
    
    for (const [nomeSelecao, jogadores] of Object.entries(JOGADORES_MEDIO)) {
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
    console.log(`🎉 ${total} jogadores MÉDIO importados!`)
    console.log('━'.repeat(70) + '\n')
    
  } catch (error) {
    console.error('💥 Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importarMedio()
