const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.usuario.findMany().then(u => {
  console.log(JSON.stringify(u, null, 2));
  p.$disconnect();
});