const prisma = require('../config/prisma')

function calcularPontos(aposta, partida) {
  if (!aposta || partida.status !== 'FINALIZADA') return 0
  const vencedorReal =
    partida.placarCasa > partida.placarFora ? 'casa' :
    partida.placarFora > partida.placarCasa ? 'fora' : 'empate'
  if (aposta.placarCasa === partida.placarCasa && aposta.placarFora === partida.placarFora) return 3
  if (aposta.vencedor && aposta.vencedor === vencedorReal) return 1
  return 0
}

async function buscarComparativo(id1, id2) {
  const [usuario1, usuario2, partidas] = await Promise.all([
    prisma.usuario.findUnique({ where: { id: Number(id1) }, select: { id: true, nome: true, foto_url: true } }),
    prisma.usuario.findUnique({ where: { id: Number(id2) }, select: { id: true, nome: true, foto_url: true } }),
    prisma.partida.findMany({
      include: { selecaoCasa: true, selecaoFora: true },
      orderBy: { data: 'asc' },
    }),
  ])

  if (!usuario1 || !usuario2) throw new Error('Usuário não encontrado')

  const ids = partidas.map((p) => p.id)
  const [apostas1, apostas2] = await Promise.all([
    prisma.aposta.findMany({ where: { usuarioId: Number(id1), partidaId: { in: ids } } }),
    prisma.aposta.findMany({ where: { usuarioId: Number(id2), partidaId: { in: ids } } }),
  ])

  const map1 = new Map(apostas1.map((a) => [a.partidaId, a]))
  const map2 = new Map(apostas2.map((a) => [a.partidaId, a]))

  let vitorias1 = 0, vitorias2 = 0, empates = 0
  let pontos1 = 0, pontos2 = 0

  const resultado = partidas.map((p) => {
    const a1 = map1.get(p.id) || null
    const a2 = map2.get(p.id) || null
    const pts1 = calcularPontos(a1, p)
    const pts2 = calcularPontos(a2, p)

    if (p.status === 'FINALIZADA') {
      pontos1 += pts1
      pontos2 += pts2
      if (pts1 > pts2) vitorias1++
      else if (pts2 > pts1) vitorias2++
      else empates++
    }

    return {
      id: p.id,
      rodada: p.rodada,
      status: p.status,
      data: p.data,
      selecaoCasa: { nome: p.selecaoCasa.nome, escudo_url: p.selecaoCasa.escudo_url },
      selecaoFora: { nome: p.selecaoFora.nome, escudo_url: p.selecaoFora.escudo_url },
      placarCasa: p.placarCasa,
      placarFora: p.placarFora,
      aposta1: a1 ? { placarCasa: a1.placarCasa, placarFora: a1.placarFora, vencedor: a1.vencedor, pontos: pts1 } : null,
      aposta2: a2 ? { placarCasa: a2.placarCasa, placarFora: a2.placarFora, vencedor: a2.vencedor, pontos: pts2 } : null,
    }
  })

  return {
    usuario1: { ...usuario1, pontos: pontos1 },
    usuario2: { ...usuario2, pontos: pontos2 },
    duelo: { vitorias1, vitorias2, empates },
    partidas: resultado,
  }
}

module.exports = { buscarComparativo }
