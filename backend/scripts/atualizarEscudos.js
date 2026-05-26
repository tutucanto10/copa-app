const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ESCUDOS OFICIAIS - Wikimedia Commons
const ESCUDOS = {
  'México': 'https://upload.wikimedia.org/wikipedia/pt/f/f3/Mexico_national_football_team_crest_%282022%29.png',
  'África do Sul': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/South_Africa_national_soccer_team_logo.svg/1280px-South_Africa_national_soccer_team_logo.svg.png',
  'Coreia do Sul': 'https://upload.wikimedia.org/wikipedia/pt/a/a7/South_Korea_national_football_team_logo.png',
  'Rep. Tcheca': 'https://upload.wikimedia.org/wikipedia/pt/5/5a/FACR.png',
  'Canadá': 'https://upload.wikimedia.org/wikipedia/pt/7/7a/Logotipo_Sele%C3%A7%C3%A3o_Canad%C3%A1.png',
  'Suíça': 'https://upload.wikimedia.org/wikipedia/pt/9/96/SFV_Logo.svg.png',
  'Qatar': 'https://upload.wikimedia.org/wikipedia/pt/thumb/a/a9/Associa%C3%A7%C3%A3o_do_Qatar_de_Futebol.png/250px-Associa%C3%A7%C3%A3o_do_Qatar_de_Futebol.png',
  'Bósnia H.': 'https://upload.wikimedia.org/wikipedia/pt/5/5a/Logo_of_the_Football_Association_of_Bosnia_and_Herzegovina_%282013-present%29.png',
  'Brasil': 'https://upload.wikimedia.org/wikipedia/commons/9/99/Brazilian_Football_Confederation_logo.svg',
  'Marrocos': 'https://upload.wikimedia.org/wikipedia/pt/7/71/F%C3%A9d%C3%A9ration_Royale_Marocaine_de_Football.png',
  'Escócia': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Scotland_national_football_team_logo_2014.svg/1280px-Scotland_national_football_team_logo_2014.svg.png',
  'Haiti': 'https://upload.wikimedia.org/wikipedia/en/e/e7/Federation_Haitienne_de_Football.png',
  'EUA': 'https://upload.wikimedia.org/wikipedia/commons/8/86/Crest_of_the_United_States_Soccer_Federation.png',
  'Paraguai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg/1280px-Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg.png',
  'Austrália': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Australia_national_football_team_badge.svg/960px-Australia_national_football_team_badge.svg.png',
  'Turquia': 'https://upload.wikimedia.org/wikipedia/en/7/70/Turkish_Football_Federation_crest.svg',
  'Alemanha': 'https://images.vexels.com/media/users/3/152460/isolated/preview/825e80bac186d247dd9332f1440d20df-logo-do-time-de-futebol-da-alemanha.png?w=360',
  'Curaçao': 'https://upload.wikimedia.org/wikipedia/pt/f/f7/Federashon_Futb%C3%B2l_K%C3%B2rsou.png',
  'Costa do Marfim': 'https://upload.wikimedia.org/wikipedia/pt/a/a1/F%C3%A9d%C3%A9ration_Ivorienne_de_Football.png',
  'Equador': 'https://upload.wikimedia.org/wikipedia/pt/7/74/FEFecu.png',
  'Holanda': 'https://upload.wikimedia.org/wikipedia/pt/a/a1/Netherlands_national_football_team_logo_2017.png',
  'Japão': 'https://upload.wikimedia.org/wikipedia/pt/3/32/JapanFA.png',
  'Tunísia': 'https://upload.wikimedia.org/wikipedia/pt/8/88/F%C3%A9d%C3%A9ration_Tunisienne_de_Football.png',
  'Suécia': 'https://upload.wikimedia.org/wikipedia/pt/1/14/SFSverige.png',
  'Bélgica': 'https://upload.wikimedia.org/wikipedia/pt/b/b0/Royal_Belgian_FA_logo_2019.png',
  'Egito': 'https://www.futbox.com/img/v1/f72/e1a/49e/39b/7492f8ff6aa555b47d2c_zoom.png',
  'Irã': 'https://upload.wikimedia.org/wikipedia/pt/a/a6/Football_Federation_Islamic_Republic_of_Iran.png',
  'Nova Zelândia': 'https://upload.wikimedia.org/wikipedia/pt/d/db/New_Zealand_Football.png',
  'Espanha': 'https://upload.wikimedia.org/wikipedia/pt/3/31/Spain_National_Football_Team_badge.png',
  'Cabo Verde': 'https://upload.wikimedia.org/wikipedia/pt/e/e1/Federa%C3%A7%C3%A3o_Cabo-Verdiana_de_Futebol.png',
  'Arábia Saudita': 'https://upload.wikimedia.org/wikipedia/pt/0/01/SAFF.png',
  'Uruguai': 'https://upload.wikimedia.org/wikipedia/pt/0/04/AUF.png',
  'França': 'https://upload.wikimedia.org/wikipedia/pt/2/25/Logo_Sele%C3%A7%C3%A3o_Francesa_2018.png',
  'Senegal': 'https://upload.wikimedia.org/wikipedia/pt/7/7c/FSenegalaiseF.png',
  'Iraque': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Iraq_National_Team_Badge_2021_v1.svg/960px-Iraq_National_Team_Badge_2021_v1.svg.png',
  'Noruega': 'https://upload.wikimedia.org/wikipedia/pt/9/97/Sele%C3%A7%C3%A3o_Norueguesa_de_Futebol_Logo.png',
  'Argentina': 'https://upload.wikimedia.org/wikipedia/pt/f/fc/230px-Afa_logo.svg.png',
  'Argélia': 'https://upload.wikimedia.org/wikipedia/pt/6/6b/Algeria_National_Football_Team_logo.png',
  'Áustria': 'https://upload.wikimedia.org/wikipedia/pt/c/cb/OFB.png',
  'Jordânia': 'https://upload.wikimedia.org/wikipedia/pt/4/44/Jordan_Football_Association.png',
  'Portugal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Portugal_National_Team_logo.png/250px-Portugal_National_Team_logo.png',
  'Colômbia': 'https://upload.wikimedia.org/wikipedia/pt/4/47/Federacion_Colombiana_de_Futbol_logo.svg.png',
  'Uzbequistão': 'https://upload.wikimedia.org/wikipedia/pt/thumb/b/b6/Uzbekistan_Football_Federation.png/250px-Uzbekistan_Football_Federation.png',
  'RD Congo': 'https://upload.wikimedia.org/wikipedia/pt/8/8b/F%C3%A9d%C3%A9ration_Congolaise_de_Football.png',
  'Inglaterra': 'https://upload.wikimedia.org/wikipedia/en/8/8b/England_national_football_team_crest.svg',
  'Croácia': 'https://upload.wikimedia.org/wikipedia/pt/c/cf/Croatia_football_federation.png',
  'Gana': 'https://upload.wikimedia.org/wikipedia/pt/6/67/Ghana_Football_Association.png',
  'Panamá': 'https://upload.wikimedia.org/wikipedia/pt/a/aa/Panama_FA_2.svg.png',
}

async function atualizarEscudos() {
  console.log('🔄 Atualizando escudos das seleções...\n')
  
  try {
    const selecoes = await prisma.selecao.findMany()
    
    let atualizadas = 0
    let naoEncontradas = 0
    let erros = 0
    
    for (const selecao of selecoes) {
      try {
        const escudoNovo = ESCUDOS[selecao.nome]
        
        if (!escudoNovo) {
          console.log(`⚠️  ${selecao.nome.padEnd(25)} - Escudo não encontrado no mapeamento`)
          naoEncontradas++
          continue
        }
        
        // Atualiza o escudo
        await prisma.selecao.update({
          where: { id: selecao.id },
          data: { escudo_url: escudoNovo }
        })
        
        console.log(`✅ ${selecao.nome.padEnd(25)} - Escudo atualizado`)
        atualizadas++
        
      } catch (error) {
        console.error(`❌ ${selecao.nome.padEnd(25)} - Erro:`, error.message)
        erros++
      }
    }
    
    console.log('\n' + '='.repeat(70))
    console.log(`🎉 ATUALIZAÇÃO CONCLUÍDA!`)
    console.log(`   📊 Total de seleções: ${selecoes.length}`)
    console.log(`   ✅ Escudos atualizados: ${atualizadas}`)
    console.log(`   ⚠️  Não encontradas: ${naoEncontradas}`)
    console.log(`   ❌ Erros: ${erros}`)
    console.log('='.repeat(70) + '\n')
    
  } catch (error) {
    console.error('💥 Erro fatal:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar
atualizarEscudos()
