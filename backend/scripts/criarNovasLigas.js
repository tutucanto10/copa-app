require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  const ligas = ['Vasco adepto ao lula', 'Crias'];
  for (const nome of ligas) {
    const existe = await prisma.liga.findUnique({ where: { nome } });
    if (existe) {
      console.log('⏭  Já existe:', nome, '(id:', existe.id + ')');
    } else {
      const liga = await prisma.liga.create({ data: { nome } });
      console.log('✅ Criada:', nome, '(id:', liga.id + ')');
    }
  }
}

main()
  .catch(e => console.error('Erro:', e.message))
  .finally(() => prisma.$disconnect());
