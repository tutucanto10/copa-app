const { listarJogadores, criarJogador, atualizarJogador, removerJogador } = require('../services/jogadorService')
const { listarJogadoresPorPartida } = require('../services/partidaService')

async function index(req, res) {
  try {
    const lista = await listarJogadores()
    res.json(lista)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function porPartida(req, res) {
  try {
    const jogadores = await listarJogadoresPorPartida(req.params.partidaId)
    res.json(jogadores)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function store(req, res) {
  try {
    const { nome, posicao, selecaoId, foto_url } = req.body
    if (!nome || !posicao || !selecaoId) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, posicao, selecaoId' })
    }
    const jogador = await criarJogador({ nome, posicao, selecaoId, foto_url })
    res.status(201).json(jogador)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function update(req, res) {
  try {
    const { nome, posicao, foto_url } = req.body
    const jogador = await atualizarJogador(req.params.id, { nome, posicao, foto_url })
    res.json(jogador)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function destroy(req, res) {
  try {
    await removerJogador(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { index, porPartida, store, update, destroy }