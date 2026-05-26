const prisma = require('../config/prisma');

// Tiers de seleções
const TIERS = {
  elite: ['Brasil', 'França', 'Argentina', 'Inglaterra', 'Espanha', 'Portugal'],
  forte: ['Alemanha', 'Países Baixos', 'Bélgica', 'Croácia', 'Uruguai', 'Estados Unidos', 'México'],
  medio: ['Colômbia', 'Marrocos', 'Japão', 'Coreia do Sul', 'Suíça', 'Senegal', 'Austrália', 'Canadá', 'Equador', 'Turquia', 'Suécia', 'Noruega', 'Escócia', 'República Tcheca', 'Áustria'],
  fraco: ['Irã', 'Tunísia', 'Arábia Saudita', 'Catar', 'Gana', 'Egito', 'Iraque', 'Jordânia', 'Paraguai', 'Panamá', 'Bósnia e Herzegovina', 'República Democrática do Congo', 'Costa do Marfim', 'Curaçao'],
}

const PRECOS = {
  elite: { GOL: 12, DEF: 10, MEI: 12, ATA: 15 },
  forte: { GOL: 10, DEF: 8,  MEI: 10, ATA: 12 },
  medio: { GOL: 8,  DEF: 6,  MEI: 8,  ATA: 10 },
  fraco: { GOL: 6,  DEF: 5,  MEI: 6,  ATA: 7  },
  ruim:  { GOL: 5,  DEF: 4,  MEI: 5,  ATA: 6  },
}

function getTier(nomeSelecao) {
  if (TIERS.elite.includes(nomeSelecao)) return 'elite'
  if (TIERS.forte.includes(nomeSelecao)) return 'forte'
  if (TIERS.medio.includes(nomeSelecao)) return 'medio'
  if (TIERS.fraco.includes(nomeSelecao)) return 'fraco'
  return 'ruim'
}

function calcularPreco(nomeSelecao, posicao) {
  const tier = getTier(nomeSelecao)
  return PRECOS[tier][posicao] || 6
}

async function listarJogadores() {
  return prisma.jogador.findMany({
    include: { selecao: true },
    orderBy: [{ selecao: { nome: 'asc' } }, { posicao: 'asc' }, { nome: 'asc' }],
  })
}

async function criarJogador({ nome, posicao, selecaoId, foto_url }) {
  const selecao = await prisma.selecao.findUnique({ where: { id: Number(selecaoId) } })
  if (!selecao) throw new Error('Seleção não encontrada')

  const preco = calcularPreco(selecao.nome, posicao)

  return prisma.jogador.create({
    data: {
      nome,
      posicao,
      selecaoId: Number(selecaoId),
      preco,
      foto_url: foto_url || null,
    },
    include: { selecao: true },
  })
}

async function atualizarJogador(id, { nome, posicao, foto_url }) {
  const jogador = await prisma.jogador.findUnique({
    where: { id: Number(id) },
    include: { selecao: true },
  })
  if (!jogador) throw new Error('Jogador não encontrado')

  const novoPreco = posicao ? calcularPreco(jogador.selecao.nome, posicao) : jogador.preco

  return prisma.jogador.update({
    where: { id: Number(id) },
    data: {
      ...(nome && { nome }),
      ...(posicao && { posicao, preco: novoPreco }),
      ...(foto_url !== undefined && { foto_url }),
    },
    include: { selecao: true },
  })
}

async function removerJogador(id) {
  return prisma.jogador.delete({ where: { id: Number(id) } })
}

module.exports = { listarJogadores, criarJogador, atualizarJogador, removerJogador, calcularPreco, getTier }