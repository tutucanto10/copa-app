const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Setar Artur como admin
  const artur = await prisma.usuario.findFirst({
    where: { nome: { contains: 'Artur', mode: 'insensitive' } },
  })

  if (artur) {
    await prisma.usuario.update({ where: { id: artur.id }, data: { isAdmin: true } })
    console.log(`✅ isAdmin=true para: ${artur.nome} (id ${artur.id})`)
  } else {
    console.log('⚠️  Usuário Artur não encontrado — crie a conta e rode este script novamente')
  }

  // 2. Corrigir escudo de Portugal
  const portugal = await prisma.selecao.findFirst({ where: { nome: 'Portugal' } })
  if (portugal) {
    await prisma.selecao.update({
      where: { id: portugal.id },
      data: { escudo_url: 'https://upload.wikimedia.org/wikipedia/pt/7/75/Portugal_FPF.png' },
    })
    console.log('✅ Escudo de Portugal atualizado')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
