// Uso: node scripts/corrigirAposta.js
// Corrige aposta do usuário Artur em Coreia do Sul × Rep. Tcheca → 2×1, vencedor: Coreia

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const usuario = await prisma.usuario.findFirst({
    where: { nome: { contains: 'Artur', mode: 'insensitive' } },
  })
  if (!usuario) { console.error('Usuário Artur não encontrado'); return }
  console.log(`Usuário: ${usuario.nome} (id=${usuario.id})`)

  const partida = await prisma.partida.findFirst({
    where: {
      AND: [
        { selecaoCasa: { nome: { contains: 'Coreia', mode: 'insensitive' } } },
        { selecaoFora: { nome: { contains: 'Tcheca', mode: 'insensitive' } } },
      ],
    },
    include: { selecaoCasa: true, selecaoFora: true },
  }).then(p => p ?? prisma.partida.findFirst({
    where: {
      AND: [
        { selecaoCasa: { nome: { contains: 'Tcheca', mode: 'insensitive' } } },
        { selecaoFora: { nome: { contains: 'Coreia', mode: 'insensitive' } } },
      ],
    },
    include: { selecaoCasa: true, selecaoFora: true },
  }))

  if (!partida) { console.error('Partida não encontrada'); return }
  console.log(`Partida: ${partida.selecaoCasa.nome} × ${partida.selecaoFora.nome} (id=${partida.id}, status=${partida.status})`)

  // Determina se Coreia é casa ou fora para montar o placar correto
  const coreiaCasa = partida.selecaoCasa.nome.toLowerCase().includes('coreia')
  const placarCasa = coreiaCasa ? 2 : 1
  const placarFora = coreiaCasa ? 1 : 2
  const vencedor   = coreiaCasa ? 'casa' : 'fora'

  const apostaExistente = await prisma.aposta.findFirst({
    where: { usuarioId: usuario.id, partidaId: partida.id },
  })

  if (apostaExistente) {
    const atualizada = await prisma.aposta.update({
      where: { id: apostaExistente.id },
      data: { placarCasa, placarFora, vencedor },
    })
    console.log(`Aposta atualizada: ${placarCasa}×${placarFora}, vencedor=${vencedor}`, atualizada)
  } else {
    const criada = await prisma.aposta.create({
      data: { usuarioId: usuario.id, partidaId: partida.id, placarCasa, placarFora, vencedor },
    })
    console.log(`Aposta criada: ${placarCasa}×${placarFora}, vencedor=${vencedor}`, criada)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
