const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
 
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
    // Pega o início e fim do dia atual (00:00:00 até 23:59:59)
    const hoje = new Date()
    const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0)
    const fimDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59)
 
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
 
// Busca classificação dos grupos baseado nas partidas e placares
async function buscarClassificacao() {
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
 
// Busca artilheiros (jogadores com mais gols)
async function buscarArtilheiros(limit = 5) {
  try {
    const jogadores = await prisma.jogador.findMany({
      include: {
        selecao: true,
        eventos: {
          where: { tipo: 'GOL' }
        }
      }
    })
 
    const artilheiros = jogadores
      .map(jogador => ({
        nome: jogador.nome,
        selecao: jogador.selecao.nome,
        foto_url: jogador.foto_url,
        gols: jogador.eventos.length
      }))
      .filter(j => j.gols > 0)
      .sort((a, b) => b.gols - a.gols)
      .slice(0, limit)
 
    return artilheiros
  } catch (error) {
    console.error('Erro ao buscar artilheiros:', error)
    throw error
  }
}
 
// Busca assistências (jogadores com mais assistências)
async function buscarAssistencias(limit = 5) {
  try {
    const jogadores = await prisma.jogador.findMany({
      include: {
        selecao: true,
        eventos: {
          where: { tipo: 'ASSISTENCIA' }
        }
      }
    })
 
    const assistentes = jogadores
      .map(jogador => ({
        nome: jogador.nome,
        selecao: jogador.selecao.nome,
        foto_url: jogador.foto_url,
        assistencias: jogador.eventos.length
      }))
      .filter(j => j.assistencias > 0)
      .sort((a, b) => b.assistencias - a.assistencias)
      .slice(0, limit)
 
    return assistentes
  } catch (error) {
    console.error('Erro ao buscar assistências:', error)
    throw error
  }
}
 
module.exports = { buscarClassificacao, buscarArtilheiros, buscarAssistencias, buscarPartidasDoDia }