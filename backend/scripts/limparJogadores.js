const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function limparJogadores() {
  console.log('🧹 Limpando jogadores e escalações do banco...\n')
  
  try {
    // Conta quantos registros existem
    const totalJogadores = await prisma.jogador.count()
    const totalEscalacoes = await prisma.escalacaoJogador.count()
    
    console.log(`📊 Jogadores atuais: ${totalJogadores}`)
    console.log(`📊 Escalações atuais: ${totalEscalacoes}`)
    
    if (totalJogadores === 0) {
      console.log('\n✅ Banco já está limpo!\n')
      return
    }
    
    console.log('\n🗑️  Deletando escalações primeiro...')
    const escalacoesDeletadas = await prisma.escalacaoJogador.deleteMany({})
    console.log(`✅ ${escalacoesDeletadas.count} escalações deletadas!`)
    
    console.log('\n🗑️  Deletando jogadores...')
    const jogadoresDeletados = await prisma.jogador.deleteMany({})
    console.log(`✅ ${jogadoresDeletados.count} jogadores deletados!`)
    
    console.log('\n' + '━'.repeat(70))
    console.log('🎉 Banco limpo! Agora você pode rodar os scripts de importação:')
    console.log('   1. node scripts/importarJogadoresElite.js')
    console.log('   2. node scripts/importarJogadoresForte.js')
    console.log('   3. node scripts/importarJogadoresMedio.js (quando criar)')
    console.log('━'.repeat(70) + '\n')
    
  } catch (error) {
    console.error('💥 Erro ao limpar:', error)
  } finally {
    await prisma.$disconnect()
  }
}

limparJogadores()
