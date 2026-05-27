require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { uploadFoto } = require('../src/config/supabase')

const prisma = new PrismaClient()

async function migrar() {
  const usuarios = await prisma.usuario.findMany({
    where: { foto_url: { startsWith: 'data:' } },
    select: { id: true, nome: true },
  })

  console.log(`\n📸 ${usuarios.length} foto(s) para migrar\n`)

  for (const u of usuarios) {
    try {
      const { foto_url } = await prisma.usuario.findUnique({
        where: { id: u.id },
        select: { foto_url: true },
      })
      const url = await uploadFoto(u.id, foto_url)
      await prisma.usuario.update({ where: { id: u.id }, data: { foto_url: url } })
      console.log(`✅ ${u.nome} → ${url}`)
    } catch (err) {
      console.error(`❌ ${u.nome}: ${err.message}`)
    }
  }

  console.log('\n✅ Migração concluída!\n')
  await prisma.$disconnect()
}

migrar()
