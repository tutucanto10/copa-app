const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  await prisma.rodada.deleteMany();
  await prisma.apostaGoleador.deleteMany();
  await prisma.aposta.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.partida.deleteMany();
  await prisma.jogador.deleteMany();
  await prisma.selecao.deleteMany();
  await prisma.membroLiga.deleteMany();
  await prisma.liga.deleteMany();
  await prisma.usuario.deleteMany();

  // Seleções
const selecoesDados = [
  { nome: 'África do Sul',              escudo_url: 'https://flagcdn.com/w80/za.png' },
  { nome: 'Alemanha',                   escudo_url: 'https://flagcdn.com/w80/de.png' },
  { nome: 'Arábia Saudita',             escudo_url: 'https://flagcdn.com/w80/sa.png' },
  { nome: 'Argélia',                    escudo_url: 'https://flagcdn.com/w80/dz.png' },
  { nome: 'Argentina',                  escudo_url: 'https://flagcdn.com/w80/ar.png' },
  { nome: 'Austrália',                  escudo_url: 'https://flagcdn.com/w80/au.png' },
  { nome: 'Áustria',                    escudo_url: 'https://flagcdn.com/w80/at.png' },
  { nome: 'Bélgica',                    escudo_url: 'https://flagcdn.com/w80/be.png' },
  { nome: 'Bósnia e Herzegovina',       escudo_url: 'https://flagcdn.com/w80/ba.png' },
  { nome: 'Brasil',                     escudo_url: 'https://flagcdn.com/w80/br.png' },
  { nome: 'Cabo Verde',                 escudo_url: 'https://flagcdn.com/w80/cv.png' },
  { nome: 'Canadá',                     escudo_url: 'https://flagcdn.com/w80/ca.png' },
  { nome: 'Catar',                      escudo_url: 'https://flagcdn.com/w80/qa.png' },
  { nome: 'Colômbia',                   escudo_url: 'https://flagcdn.com/w80/co.png' },
  { nome: 'Coreia do Sul',              escudo_url: 'https://flagcdn.com/w80/kr.png' },
  { nome: 'Costa do Marfim',            escudo_url: 'https://flagcdn.com/w80/ci.png' },
  { nome: 'Croácia',                    escudo_url: 'https://flagcdn.com/w80/hr.png' },
  { nome: 'Curaçao',                    escudo_url: 'https://flagcdn.com/w80/cw.png' },
  { nome: 'Egito',                      escudo_url: 'https://flagcdn.com/w80/eg.png' },
  { nome: 'Equador',                    escudo_url: 'https://flagcdn.com/w80/ec.png' },
  { nome: 'Escócia',                    escudo_url: 'https://flagcdn.com/w80/gb-sct.png' },
  { nome: 'Espanha',                    escudo_url: 'https://flagcdn.com/w80/es.png' },
  { nome: 'Estados Unidos',             escudo_url: 'https://flagcdn.com/w80/us.png' },
  { nome: 'França',                     escudo_url: 'https://flagcdn.com/w80/fr.png' },
  { nome: 'Gana',                       escudo_url: 'https://flagcdn.com/w80/gh.png' },
  { nome: 'Haiti',                      escudo_url: 'https://flagcdn.com/w80/ht.png' },
  { nome: 'Inglaterra',                 escudo_url: 'https://flagcdn.com/w80/gb-eng.png' },
  { nome: 'Irã',                        escudo_url: 'https://flagcdn.com/w80/ir.png' },
  { nome: 'Iraque',                     escudo_url: 'https://flagcdn.com/w80/iq.png' },
  { nome: 'Japão',                      escudo_url: 'https://flagcdn.com/w80/jp.png' },
  { nome: 'Jordânia',                   escudo_url: 'https://flagcdn.com/w80/jo.png' },
  { nome: 'Marrocos',                   escudo_url: 'https://flagcdn.com/w80/ma.png' },
  { nome: 'México',                     escudo_url: 'https://flagcdn.com/w80/mx.png' },
  { nome: 'Noruega',                    escudo_url: 'https://flagcdn.com/w80/no.png' },
  { nome: 'Nova Zelândia',              escudo_url: 'https://flagcdn.com/w80/nz.png' },
  { nome: 'Países Baixos',              escudo_url: 'https://flagcdn.com/w80/nl.png' },
  { nome: 'Panamá',                     escudo_url: 'https://flagcdn.com/w80/pa.png' },
  { nome: 'Paraguai',                   escudo_url: 'https://flagcdn.com/w80/py.png' },
  { nome: 'Portugal',                   escudo_url: 'https://flagcdn.com/w80/pt.png' },
  { nome: 'República Tcheca',           escudo_url: 'https://flagcdn.com/w80/cz.png' },
  { nome: 'República Democrática do Congo', escudo_url: 'https://flagcdn.com/w80/cd.png' },
  { nome: 'Senegal',                    escudo_url: 'https://flagcdn.com/w80/sn.png' },
  { nome: 'Suécia',                     escudo_url: 'https://flagcdn.com/w80/se.png' },
  { nome: 'Suíça',                      escudo_url: 'https://flagcdn.com/w80/ch.png' },
  { nome: 'Tunísia',                    escudo_url: 'https://flagcdn.com/w80/tn.png' },
  { nome: 'Turquia',                    escudo_url: 'https://flagcdn.com/w80/tr.png' },
  { nome: 'Uruguai',                    escudo_url: 'https://flagcdn.com/w80/uy.png' },
  { nome: 'Uzbequistão',               escudo_url: 'https://flagcdn.com/w80/uz.png' },
];

  const selecoesCriadas = {};
  for (const s of selecoesDados) {
    const selecao = await prisma.selecao.create({ data: s });
    selecoesCriadas[s.nome] = selecao;
  }

  const brasil = selecoesCriadas['Brasil'];
  const franca = selecoesCriadas['França'];
  const espanha = selecoesCriadas['Espanha'];

  // Jogadores Brasil
  const viniciusJr = await prisma.jogador.create({
    data: { nome: 'Vinicius Jr', posicao: 'ATA', selecaoId: brasil.id, preco: 15 },
  });
  const neymar = await prisma.jogador.create({
    data: { nome: 'Neymar', posicao: 'ATA', selecaoId: brasil.id, preco: 12 },
  });
  const raphinha = await prisma.jogador.create({
    data: { nome: 'Raphinha', posicao: 'MEI', selecaoId: brasil.id, preco: 10 },
  });
  const rodrygo = await prisma.jogador.create({
    data: { nome: 'Rodrygo', posicao: 'ATA', selecaoId: brasil.id, preco: 9 },
  });
  const casemiro = await prisma.jogador.create({
    data: { nome: 'Casemiro', posicao: 'MEI', selecaoId: brasil.id, preco: 9 },
  });
  const marquinhos = await prisma.jogador.create({
    data: { nome: 'Marquinhos', posicao: 'DEF', selecaoId: brasil.id, preco: 8 },
  });
  const militao = await prisma.jogador.create({
    data: { nome: 'Militão', posicao: 'DEF', selecaoId: brasil.id, preco: 8 },
  });
  const danilo = await prisma.jogador.create({
    data: { nome: 'Danilo', posicao: 'DEF', selecaoId: brasil.id, preco: 6 },
  });
  const alisson = await prisma.jogador.create({
    data: { nome: 'Alisson', posicao: 'GOL', selecaoId: brasil.id, preco: 10 },
  });

  // Jogadores França
  const mbappe = await prisma.jogador.create({
    data: { nome: 'Kylian Mbappé', posicao: 'ATA', selecaoId: franca.id, preco: 15 },
  });
  await prisma.jogador.create({
    data: { nome: 'Antoine Griezmann', posicao: 'MEI', selecaoId: franca.id, preco: 10 },
  });
  const kounde = await prisma.jogador.create({
    data: { nome: 'Jules Koundé', posicao: 'DEF', selecaoId: franca.id, preco: 7 },
  });
  await prisma.jogador.create({
    data: { nome: 'Tchouaméni', posicao: 'MEI', selecaoId: franca.id, preco: 8 },
  });
  await prisma.jogador.create({
    data: { nome: 'Upamecano', posicao: 'DEF', selecaoId: franca.id, preco: 7 },
  });
  await prisma.jogador.create({
    data: { nome: 'Mike Maignan', posicao: 'GOL', selecaoId: franca.id, preco: 9 },
  });

  // Jogadores Espanha
  const yamal = await prisma.jogador.create({
    data: { nome: 'Lamine Yamal', posicao: 'ATA', selecaoId: espanha.id, preco: 15 },
  });
  await prisma.jogador.create({
    data: { nome: 'Álvaro Morata', posicao: 'ATA', selecaoId: espanha.id, preco: 10 },
  });
  await prisma.jogador.create({
    data: { nome: 'Pedri', posicao: 'MEI', selecaoId: espanha.id, preco: 11 },
  });
  await prisma.jogador.create({
    data: { nome: 'Rodri', posicao: 'MEI', selecaoId: espanha.id, preco: 10 },
  });
  await prisma.jogador.create({
    data: { nome: 'Carvajal', posicao: 'DEF', selecaoId: espanha.id, preco: 7 },
  });
  await prisma.jogador.create({
    data: { nome: 'Laporte', posicao: 'DEF', selecaoId: espanha.id, preco: 7 },
  });
  await prisma.jogador.create({
    data: { nome: 'Unai Simón', posicao: 'GOL', selecaoId: espanha.id, preco: 8 },
  });

  // Usuário admin
  await prisma.usuario.create({
    data: {
      nome: 'Artur',
      email: 'artur@bolao.com',
      isAdmin: true,
    },
  });

  // Ligas
  await prisma.liga.createMany({
    data: [
      { nome: 'Peaky Barbies' },
      { nome: 'Resenha Light' },
      { nome: 'Escritório' },
    ],
    skipDuplicates: true,
  });

  // Rodada 1 — dia 11/06/2026
  const rodada1 = await prisma.rodada.create({
    data: {
      numero: 1,
      status: 'ABERTA',
      dataAbertura: new Date('2026-06-11T03:00:00Z'),
      dataFechamento: new Date('2026-06-11T15:00:00Z'),
    },
  });

  // PARTIDA 1: Brasil x França — FINALIZADA
  const partida1 = await prisma.partida.create({
    data: {
      selecaoCasaId: brasil.id,
      selecaoForaId: franca.id,
      data: new Date('2026-06-11T22:00:00Z'),
      status: 'FINALIZADA',
      rodada: 1,
      placarCasa: 0,
      placarFora: 0,
    },
  });

  const jogadoresBrasil = [
    viniciusJr.id,
    neymar.id,
    raphinha.id,
    rodrygo.id,
    casemiro.id,
    marquinhos.id,
    militao.id,
    danilo.id,
    alisson.id,
  ];

  const eventos1 = [
    { jogadorId: viniciusJr.id, tipo: 'GOL', minuto: 10 },
    { jogadorId: raphinha.id, tipo: 'ASSISTENCIA', minuto: 10 },
    { jogadorId: kounde.id, tipo: 'AMARELO', minuto: 22 },
    { jogadorId: mbappe.id, tipo: 'GOL', minuto: 45 },
    { jogadorId: kounde.id, tipo: 'VERMELHO', minuto: 60 },
    { jogadorId: viniciusJr.id, tipo: 'GOL', minuto: 70 },
  ];

  for (const ev of eventos1) {
    await prisma.evento.create({
      data: {
        partidaId: partida1.id,
        jogadorId: ev.jogadorId,
        tipo: ev.tipo,
        minuto: ev.minuto,
      },
    });

    if (ev.tipo === 'GOL') {
      if (jogadoresBrasil.includes(ev.jogadorId)) {
        await prisma.partida.update({
          where: { id: partida1.id },
          data: { placarCasa: { increment: 1 } },
        });
      } else {
        await prisma.partida.update({
          where: { id: partida1.id },
          data: { placarFora: { increment: 1 } },
        });
      }
    }
  }

  const final1 = await prisma.partida.findUnique({ where: { id: partida1.id } });
  console.log(`✅ Seed concluído!`);
  console.log(`⚽ Brasil ${final1.placarCasa} x ${final1.placarFora} França — FINALIZADA`);
  console.log(`🏆 Rodada 1 criada — abre 00:00, fecha 12:00 (Brasília)`);
  console.log(`🏆 Ligas criadas!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());