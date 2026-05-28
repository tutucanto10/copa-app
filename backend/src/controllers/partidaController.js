const {
  listarPartidas,
  buscarPartida,
  listarJogadoresPorPartida,
  atualizarPartida,
  criarPartida,
  listarSelecoes,
  atualizarSelecao,
} = require('../services/partidaService');
const { notificarResultadoPartida, notificarMvpRodada } = require('../services/pushService');
const { mvpRodadaSingle } = require('../services/mvpService');

async function index(req, res) {
  try {
    const partidas = await listarPartidas();
    res.json(partidas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function show(req, res) {
  try {
    const partida = await buscarPartida(req.params.id);
    if (!partida) return res.status(404).json({ error: 'Partida não encontrada' });
    res.json(partida);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function jogadores(req, res) {
  try {
    const lista = await listarJogadoresPorPartida(req.params.partidaId);
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const { status, placarCasa, placarFora } = req.body;
    const anterior = await buscarPartida(req.params.id);
    const partida = await atualizarPartida(req.params.id, { status, placarCasa, placarFora });
    if (status === 'FINALIZADA' && anterior?.status !== 'FINALIZADA') {
      notificarResultadoPartida(partida).catch((err) =>
        console.error('Erro ao notificar resultado:', err.message)
      );
      // Notifica MVP se essa foi a última partida da rodada
      const rodada = partida.rodada;
      if (rodada) {
        mvpRodadaSingle(rodada).then((mvpData) => {
          if (mvpData.completa && mvpData.mvp) {
            return notificarMvpRodada(rodada, mvpData.mvp);
          }
        }).catch((err) => console.error('Erro ao notificar MVP:', err.message));
      }
    }
    res.json(partida);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function store(req, res) {
  try {
    const { selecaoCasaId, selecaoForaId, data, rodada } = req.body;
    if (!selecaoCasaId || !selecaoForaId || !data) {
      return res.status(400).json({ error: 'Campos obrigatórios: selecaoCasaId, selecaoForaId, data' });
    }
    const partida = await criarPartida({ selecaoCasaId, selecaoForaId, data, rodada });
    res.status(201).json(partida);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function selecoes(req, res) {
  try {
    const lista = await listarSelecoes();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateSelecao(req, res) {
  try {
    const { nome, escudo_url } = req.body;
    const selecao = await atualizarSelecao(req.params.id, { nome, escudo_url });
    res.json(selecao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { index, show, jogadores, update, store, selecoes, updateSelecao };