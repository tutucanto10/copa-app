const prisma = require('../src/config/prisma')

async function main() {
  // Busca Pedro Bernardo
  const pedro = await prisma.usuario.findFirst({
    where: { nome: { contains: 'Pedro', mode: 'insensitive' } },
  })
  if (!pedro) { console.log('❌ Usuário não encontrado'); return }
  console.log(`✅ Usuário: ${pedro.nome} (ID ${pedro.id})`)

  // Busca a partida Croácia x Gana na rodada 3
  const partida = await prisma.partida.findFirst({
    where: {
      rodada: 3,
      OR: [
        { selecaoCasa: { nome: { contains: 'Cro', mode: 'insensitive' } }, selecaoFora: { nome: { contains: 'Gana', mode: 'insensitive' } } },
        { selecaoCasa: { nome: { contains: 'Gana', mode: 'insensitive' } }, selecaoFora: { nome: { contains: 'Cro', mode: 'insensitive' } } },
      ],
    },
    include: { selecaoCasa: true, selecaoFora: true },
  })
  if (!partida) { console.log('❌ Partida não encontrada'); return }
  console.log(`✅ Partida: ${partida.selecaoCasa.nome} x ${partida.selecaoFora.nome} (ID ${partida.id})`)

  // Determina quem é 'casa' (Croácia) para o vencedor
  const croEhCasa = partida.selecaoCasa.nome.toLowerCase().includes('cro')
  const placarCasa = croEhCasa ? 2 : 1
  const placarFora = croEhCasa ? 1 : 2
  const vencedor = 'casa' // Croácia ganha — independente de ser casa ou fora na DB

  // Busca aposta existente
  const existente = await prisma.aposta.findFirst({
    where: { usuarioId: pedro.id, partidaId: partida.id },
  })

  let aposta
  if (existente) {
    aposta = await prisma.aposta.update({
      where: { id: existente.id },
      data: { placarCasa, placarFora, vencedor },
    })
    console.log(`✏️  Aposta atualizada (ID ${aposta.id})`)
  } else {
    aposta = await prisma.aposta.create({
      data: { usuarioId: pedro.id, partidaId: partida.id, placarCasa, placarFora, vencedor },
    })
    console.log(`➕ Aposta criada (ID ${aposta.id})`)
  }

  console.log(`✅ Aposta salva: ${placarCasa} × ${placarFora} (vencedor: ${vencedor})`)
  console.log('🏆 Pedro Bernardo deve receber +4 pts nessa partida.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
