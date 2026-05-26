const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  await p.partida.update({
    where: { id: 12 },
    data: {
      status: 'AGENDADA',
      placarCasa: 0,
      placarFora: 0,
    },
  });
  console.log('✅ Partida restaurada para AGENDADA!');
}

main().finally(() => p.$disconnect());