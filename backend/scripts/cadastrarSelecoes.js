const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
 
// 48 SELEÇÕES DA COPA 2026
// Escudos OFICIAIS das federações (Wikimedia Commons)
const SELECOES = [
  // GRUPO A
  { nome: 'México', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/f/f3/Mexico_national_football_team_crest_%282022%29.png' },
  { nome: 'África do Sul', escudo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/South_Africa_national_soccer_team_logo.svg/1280px-South_Africa_national_soccer_team_logo.svg.png' },
  { nome: 'Coreia do Sul', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/a/a7/South_Korea_national_football_team_logo.png' },
  { nome: 'Rep. Tcheca', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/5/5a/FACR.png' },
  
  // GRUPO B
  { nome: 'Canadá', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/7/7a/Logotipo_Sele%C3%A7%C3%A3o_Canad%C3%A1.png' },
  { nome: 'Suíça', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/9/96/SFV_Logo.svg.png' },
  { nome: 'Qatar', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/thumb/a/a9/Associa%C3%A7%C3%A3o_do_Qatar_de_Futebol.png/250px-Associa%C3%A7%C3%A3o_do_Qatar_de_Futebol.png' },
  { nome: 'Bósnia H.', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/5/5a/Logo_of_the_Football_Association_of_Bosnia_and_Herzegovina_%282013-present%29.png' },
  
  // GRUPO C
  { nome: 'Brasil', escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Brazilian_Football_Confederation_logo.svg' },
  { nome: 'Marrocos', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/7/71/F%C3%A9d%C3%A9ration_Royale_Marocaine_de_Football.png' },
  { nome: 'Escócia', escudo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Scotland_national_football_team_logo_2014.svg/1280px-Scotland_national_football_team_logo_2014.svg.png' },
  { nome: 'Haiti', escudo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0m488kZXKrgflvKZGOlJ3ro_0WcaqNgOvfg&s' },
  
  // GRUPO D
  { nome: 'EUA', escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Crest_of_the_United_States_Soccer_Federation.png' },
  { nome: 'Paraguai', escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg/1280px-Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg.png' },
  { nome: 'Austrália', escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Australia_national_football_team_badge.svg/960px-Australia_national_football_team_badge.svg.png' },
  { nome: 'Turquia', escudo_url: 'https://upload.wikimedia.org/wikipedia/en/7/70/Turkish_Football_Federation_crest.svg' },
  
  // GRUPO E
  { nome: 'Alemanha', escudo_url: 'https://images.vexels.com/media/users/3/152460/isolated/preview/825e80bac186d247dd9332f1440d20df-logo-do-time-de-futebol-da-alemanha.png?w=360' },
  { nome: 'Curaçao', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/f/f7/Federashon_Futb%C3%B2l_K%C3%B2rsou.png' },
  { nome: 'Costa do Marfim', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/a/a1/F%C3%A9d%C3%A9ration_Ivorienne_de_Football.png' },
  { nome: 'Equador', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/7/74/FEFecu.png' },
  
  // GRUPO F
  { nome: 'Holanda', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/a/a1/Netherlands_national_football_team_logo_2017.png' },
  { nome: 'Japão', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/3/32/JapanFA.png' },
  { nome: 'Tunísia', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/8/88/F%C3%A9d%C3%A9ration_Tunisienne_de_Football.png' },
  { nome: 'Suécia', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/1/14/SFSverige.png' },
  
  // GRUPO G
  { nome: 'Bélgica', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/b/b0/Royal_Belgian_FA_logo_2019.png' },
  { nome: 'Egito', escudo_url: 'https://upload.wikimedia.org/wikipedia/en/f/f8/Egyptian_Football_Association_logo.svg' },
  { nome: 'Irã', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/a/a6/Football_Federation_Islamic_Republic_of_Iran.png' },
  { nome: 'Nova Zelândia', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/d/db/New_Zealand_Football.png' },
  
  // GRUPO H
  { nome: 'Espanha', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/3/31/Spain_National_Football_Team_badge.png' },
  { nome: 'Cabo Verde', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/e/e1/Federa%C3%A7%C3%A3o_Cabo-Verdiana_de_Futebol.png' },
  { nome: 'Arábia Saudita', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/0/01/SAFF.png' },
  { nome: 'Uruguai', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/0/04/AUF.png' },
  
  // GRUPO I
  { nome: 'França', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/2/25/Logo_Sele%C3%A7%C3%A3o_Francesa_2018.png' },
  { nome: 'Senegal', escudo_url: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Senegalese_Football_Federation_logo.svg' },
  { nome: 'Iraque', escudo_url: 'https://upload.wikimedia.org/wikipedia/en/e/e4/UEFA_logo.svg' },
  { nome: 'Noruega', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/9/97/Sele%C3%A7%C3%A3o_Norueguesa_de_Futebol_Logo.png' },
  
  // GRUPO J
  { nome: 'Argentina', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/f/fc/230px-Afa_logo.svg.png' },
  { nome: 'Argélia', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/6/6b/Algeria_National_Football_Team_logo.png' },
  { nome: 'Áustria', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/c/cb/OFB.png' },
  { nome: 'Jordânia', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/4/44/Jordan_Football_Association.png' },
  
  // GRUPO K
  { nome: 'Portugal', escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Portugal_National_Team_logo.png/250px-Portugal_National_Team_logo.png' },
  { nome: 'Colômbia', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/4/47/Federacion_Colombiana_de_Futbol_logo.svg.png' },
  { nome: 'Uzbequistão', escudo_url: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Uzbekistan_Football_Association_logo.svg' },
  { nome: 'RD Congo', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/8/8b/F%C3%A9d%C3%A9ration_Congolaise_de_Football.png' },
  
  // GRUPO L
  { nome: 'Inglaterra', escudo_url: 'https://upload.wikimedia.org/wikipedia/en/8/8b/England_national_football_team_crest.svg' },
  { nome: 'Croácia', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/c/cf/Croatia_football_federation.png' },
  { nome: 'Gana', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/6/67/Ghana_Football_Association.png' },
  { nome: 'Panamá', escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/a/aa/Panama_FA_2.svg.png' },
]
 
async function cadastrarSelecoes() {
  console.log('⚽ Iniciando cadastro das 48 seleções da Copa 2026...\n')
  console.log('🏆 Usando escudos OFICIAIS das federações (Wikimedia Commons)\n')
  
  try {
    let cadastradas = 0
    let jaExistiam = 0
    let erros = 0
    
    for (const selecao of SELECOES) {
      try {
        // Verifica se já existe
        const existe = await prisma.selecao.findFirst({
          where: { nome: selecao.nome }
        })
        
        if (existe) {
          console.log(`⏭️  ${selecao.nome.padEnd(25)} - Já cadastrada`)
          jaExistiam++
          continue
        }
        
        // Cadastra
        await prisma.selecao.create({
          data: {
            nome: selecao.nome,
            escudo_url: selecao.escudo_url
          }
        })
        
        console.log(`✅ ${selecao.nome.padEnd(25)} - Cadastrada`)
        cadastradas++
        
      } catch (error) {
        console.error(`❌ ${selecao.nome.padEnd(25)} - Erro:`, error.message)
        erros++
      }
    }
    
    console.log('\n' + '='.repeat(70))
    console.log(`🎉 CADASTRO CONCLUÍDO!`)
    console.log(`   📊 Total de seleções: ${SELECOES.length}`)
    console.log(`   ✅ Cadastradas: ${cadastradas}`)
    console.log(`   ⏭️  Já existiam: ${jaExistiam}`)
    console.log(`   ❌ Erros: ${erros}`)
    console.log('='.repeat(70))
    console.log('\n💡 Próximos passos:')
    console.log('   1. Rode o script de importação de jogos!')
    console.log('   2. Execute: node scripts/importarJogosCopa2026.js')
    console.log('   3. Acesse /partidas e /copa para ver tudo funcionando! 🚀\n')
    
  } catch (error) {
    console.error('💥 Erro fatal:', error)
  } finally {
    await prisma.$disconnect()
  }
}
 
// Executar
cadastrarSelecoes()