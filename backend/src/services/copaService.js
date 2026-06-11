const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { buscarTopScorers, buscarTopAssists, buscarStandings } = require('./apiFootballService')
 
// Mapeamento dos grupos da Copa 2026
const GRUPOS = {
  A: ['México', 'África do Sul', 'Coreia do Sul', 'Rep. Tcheca'],
  B: ['Canadá', 'Suíça', 'Qatar', 'Bósnia H.'],
  C: ['Brasil', 'Marrocos', 'Escócia', 'Haiti'],
  D: ['EUA', 'Paraguai', 'Austrália', 'Turquia'],
  E: ['Alemanha', 'Curaçao', 'Costa do Marfim', 'Equador'],
  F: ['Holanda', 'Japão', 'Tunísia', 'Suécia'],
  G: ['Bélgica', 'Egito', 'Irã', 'Nova Zelândia'],
  H: ['Espanha', 'Cabo Verde', 'Arábia Saudita', 'Uruguai'],
  I: ['França', 'Senegal', 'Iraque', 'Noruega'],
  J: ['Argentina', 'Argélia', 'Áustria', 'Jordânia'],
  K: ['Portugal', 'Colômbia', 'Uzbequistão', 'RD Congo'],
  L: ['Inglaterra', 'Croácia', 'Gana', 'Panamá'],
}
 
// Busca partidas do dia atual
async function buscarPartidasDoDia() {
  try {
    // Calcula início e fim do dia em BRT (UTC-3) para não perder jogos noturnos
    const BRT = 3 * 60 * 60 * 1000
    const hojeEmBRT = new Date(Date.now() - BRT)
    const ano = hojeEmBRT.getUTCFullYear()
    const mes = hojeEmBRT.getUTCMonth()
    const dia = hojeEmBRT.getUTCDate()
    const inicioDia = new Date(Date.UTC(ano, mes, dia,      3,  0,  0)) // 00:00 BRT
    const fimDia    = new Date(Date.UTC(ano, mes, dia + 1,  2, 59, 59)) // 23:59 BRT
 
    const partidas = await prisma.partida.findMany({
      where: {
        data: {
          gte: inicioDia,
          lte: fimDia
        }
      },
      include: {
        selecaoCasa: true,
        selecaoFora: true
      },
      orderBy: {
        data: 'asc'
      }
    })
 
    return partidas.map(partida => ({
      id: partida.id,
      data: partida.data,
      status: partida.status,
      selecaoCasa: {
        id: partida.selecaoCasa.id,
        nome: partida.selecaoCasa.nome,
        escudo_url: partida.selecaoCasa.escudo_url
      },
      selecaoFora: {
        id: partida.selecaoFora.id,
        nome: partida.selecaoFora.nome,
        escudo_url: partida.selecaoFora.escudo_url
      },
      placarCasa: partida.placarCasa,
      placarFora: partida.placarFora,
      rodada: partida.rodada
    }))
  } catch (error) {
    console.error('Erro ao buscar partidas do dia:', error)
    throw error
  }
}
 
// Busca classificação — usa API-Football se disponível, senão calcula da base local
async function buscarClassificacao() {
  if (process.env.APIFOOTBALL_KEY) {
    try {
      const grupos = await buscarStandings(1, 2026);
      if (grupos && Object.keys(grupos).length > 0) return grupos;
    } catch (e) {
      console.warn('API-Football standings falhou, usando base local:', e.message);
    }
  }
  try {
    const selecoes = await prisma.selecao.findMany({
      include: {
        casas: {
          where: {
            status: { in: ['FINALIZADA', 'AO_VIVO'] }
          }
        },
        foras: {
          where: {
            status: { in: ['FINALIZADA', 'AO_VIVO'] }
          }
        }
      }
    })
 
    const classificacaoPorGrupo = {}
 
    // Inicializa grupos com estatísticas zeradas
    Object.keys(GRUPOS).forEach(grupo => {
      classificacaoPorGrupo[grupo] = GRUPOS[grupo].map(nomeSelecao => {
        const selecao = selecoes.find(s => s.nome === nomeSelecao)
        
        let jogos = 0
        let vitorias = 0
        let empates = 0
        let derrotas = 0
        let golsPro = 0
        let golsContra = 0
 
        if (selecao) {
          // Jogos em casa
          selecao.casas.forEach(partida => {
            jogos++
            golsPro += partida.placarCasa
            golsContra += partida.placarFora
            if (partida.placarCasa > partida.placarFora) vitorias++
            else if (partida.placarCasa === partida.placarFora) empates++
            else derrotas++
          })
 
          // Jogos fora
          selecao.foras.forEach(partida => {
            jogos++
            golsPro += partida.placarFora
            golsContra += partida.placarCasa
            if (partida.placarFora > partida.placarCasa) vitorias++
            else if (partida.placarFora === partida.placarCasa) empates++
            else derrotas++
          })
        }
 
        const pontos = vitorias * 3 + empates * 1
 
        return {
          nome: nomeSelecao,
          escudo: selecao?.escudo_url || null,
          jogos,
          vitorias,
          empates,
          derrotas,
          golsPro,
          golsContra,
          saldoGols: golsPro - golsContra,
          pontos
        }
      })
 
      // Ordena por: pontos > vitórias > saldo de gols > gols pró
      classificacaoPorGrupo[grupo].sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos
        if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias
        if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols
        return b.golsPro - a.golsPro
      })
    })
 
    return classificacaoPorGrupo
  } catch (error) {
    console.error('Erro ao buscar classificação:', error)
    throw error
  }
}
 
// Busca artilheiros — usa API-Football se disponível, senão base local
async function buscarArtilheiros(limit = 5) {
  if (process.env.APIFOOTBALL_KEY) {
    try {
      return await buscarTopScorers(1, 2026, limit)
    } catch (e) {
      console.warn('API-Football artilheiros falhou, usando base local:', e.message)
    }
  }
  const jogadores = await prisma.jogador.findMany({
    include: { selecao: true, eventos: { where: { tipo: 'GOL' } } }
  })
  return jogadores
    .map(j => ({ nome: j.nome, selecao: j.selecao.nome, foto_url: j.foto_url, gols: j.eventos.length }))
    .filter(j => j.gols > 0)
    .sort((a, b) => b.gols - a.gols)
    .slice(0, limit)
}

// Busca assistências — usa API-Football se disponível, senão base local
async function buscarAssistencias(limit = 5) {
  if (process.env.APIFOOTBALL_KEY) {
    try {
      return await buscarTopAssists(1, 2026, limit)
    } catch (e) {
      console.warn('API-Football assistências falhou, usando base local:', e.message)
    }
  }
  const jogadores = await prisma.jogador.findMany({
    include: { selecao: true, eventos: { where: { tipo: 'ASSISTENCIA' } } }
  })
  return jogadores
    .map(j => ({ nome: j.nome, selecao: j.selecao.nome, foto_url: j.foto_url, assistencias: j.eventos.length }))
    .filter(j => j.assistencias > 0)
    .sort((a, b) => b.assistencias - a.assistencias)
    .slice(0, limit)
}
 
module.exports = { buscarClassificacao, buscarArtilheiros, buscarAssistencias, buscarPartidasDoDia }