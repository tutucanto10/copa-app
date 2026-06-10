const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const partidaRoutes   = require('./src/routes/partidaRoutes');
const apostasRoutes   = require('./src/routes/apostaRoutes');
const eventoRoutes    = require('./src/routes/eventoRoutes');
const goleadorRoutes  = require('./src/routes/goleadorRoutes');
const authRoutes      = require('./src/routes/authRoutes');
const ligaRoutes      = require('./src/routes/ligaRoutes');
const rodadaRoutes    = require('./src/routes/rodadaRoutes');
const jogadorRoutes   = require('./src/routes/jogadorRoutes');
const perfilRoutes    = require('./src/routes/perfilRoutes');
const copaRoutes          = require('./src/routes/copaRoutes');
const comparativoRoutes   = require('./src/routes/comparativoRoutes');
const campeaoRoutes       = require('./src/routes/campeaoRoutes');
const mvpRoutes           = require('./src/routes/mvpRoutes');

const { verificarAdmin, loginAdmin } = require('./middleware/adminAuth');
const pushRoutes = require('./src/routes/pushRoutes');
const prisma = require('./src/config/prisma');
const { limparCacheRanking } = require('./src/services/ligaService');
const { notificarLembretes, notificarResultadoPartida, notificarMvpRodada } = require('./src/services/pushService');
const { buscarAoVivo, converterStatus, buscarEventosFixture } = require('./src/services/apiFootballService');
const { mvpRodadaSingle } = require('./src/services/mvpService');

const app = express();

app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check — usado pelo UptimeRobot para manter o app acordado
app.get('/health', (req, res) => res.json({ ok: true }));

// Rota de login admin (SEM proteção)
app.post('/admin/login', loginAdmin);

// Rotas públicas (usuários podem ver)
app.use('/auth',            authRoutes);
app.use('/perfil',          perfilRoutes);
app.use('/aposta',          apostasRoutes);
app.use('/apostas',         apostasRoutes);
app.use('/aposta-goleador', goleadorRoutes);
app.use('/ligas',           ligaRoutes);
app.use('/duelo',           comparativoRoutes);
app.use('/campeao',         campeaoRoutes);
app.use('/mvp',             mvpRoutes);
app.use('/push',            pushRoutes);

// Partidas e Copa: públicos para visualização
app.use('/partidas',        partidaRoutes);  // Todos podem ver partidas
app.use('/copa',            copaRoutes);     // Todos podem ver copa

// Proxy de imagens — usado pelo share card para contornar CORS no html2canvas
app.get('/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).end();
  try {
    const r = await fetch(url);
    if (!r.ok) return res.status(r.status).end();
    const buf = await r.arrayBuffer();
    res.set('Content-Type', r.headers.get('content-type') || 'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(buf));
  } catch { res.status(500).end(); }
});

// Rotas 100% protegidas (ADMIN apenas - criar/editar/deletar)
app.use('/eventos',         verificarAdmin, eventoRoutes);
app.use('/evento',          verificarAdmin, eventoRoutes);
app.use('/rodadas',         verificarAdmin, rodadaRoutes);
app.use('/jogadores',       verificarAdmin, jogadorRoutes);

// Serve frontend estático em produção
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// Job: atualização de placar ao vivo via API-Football (a cada 2 min)
setInterval(async () => {
  if (!process.env.APIFOOTBALL_KEY) return;
  try {
    const fixtures = await buscarAoVivo();
    if (!fixtures || fixtures.length === 0) return;

    // Pega IDs externos dos fixtures ao vivo
    const externalIds = fixtures.map((f) => f.fixture.id);

    // Busca nossas partidas que têm esses IDs externos
    const partidas = await prisma.partida.findMany({
      where: { externalId: { in: externalIds } },
      include: { selecaoCasa: true, selecaoFora: true },
    });

    for (const partida of partidas) {
      const fixture = fixtures.find((f) => f.fixture.id === partida.externalId);
      if (!fixture) continue;

      const novoStatus   = converterStatus(fixture.fixture.status.short);
      const novoPlacarCasa = fixture.goals.home ?? partida.placarCasa;
      const novoPlacarFora = fixture.goals.away ?? partida.placarFora;

      const mudou =
        novoStatus   !== partida.status ||
        novoPlacarCasa !== partida.placarCasa ||
        novoPlacarFora !== partida.placarFora;

      if (!mudou) continue;

      const atualizada = await prisma.partida.update({
        where: { id: partida.id },
        data: { status: novoStatus, placarCasa: novoPlacarCasa, placarFora: novoPlacarFora },
        include: { selecaoCasa: true, selecaoFora: true },
      });

      limparCacheRanking();
      console.log(`⚽ Placar atualizado: ${partida.selecaoCasa.nome} ${novoPlacarCasa}×${novoPlacarFora} ${partida.selecaoFora.nome} [${novoStatus}]`);

      // Sincroniza eventos (gols, cartões) da partida ao vivo
      try {
        const eventosApi = await buscarEventosFixture(partida.externalId);
        const eventosExistentes = await prisma.evento.findMany({ where: { partidaId: partida.id } });
        for (const ev of eventosApi) {
          const jaExiste = eventosExistentes.some(
            (e) => e.minuto === ev.minuto && e.tipo === ev.tipo && e.nomeExterno === ev.nomeJogador
          );
          if (!jaExiste) {
            await prisma.evento.create({
              data: {
                partidaId: partida.id,
                tipo: ev.tipo,
                minuto: ev.minuto,
                nomeExterno: ev.nomeJogador,
                timeExterno: ev.nomeTime,
              },
            });
            console.log(`  📋 Evento: ${ev.tipo} ${ev.minuto}' — ${ev.nomeJogador} (${ev.nomeTime})`);
          }
        }
      } catch (e) {
        console.error('Erro sync eventos:', e.message);
      }

      // Se acabou de finalizar, dispara notificações
      if (novoStatus === 'FINALIZADA' && partida.status !== 'FINALIZADA') {
        notificarResultadoPartida(atualizada).catch((e) => console.error('Push resultado:', e.message));
        mvpRodadaSingle(atualizada.rodada).then((mvpData) => {
          if (mvpData?.completa && mvpData.mvp) {
            return notificarMvpRodada(atualizada.rodada, mvpData.mvp);
          }
        }).catch((e) => console.error('Push MVP:', e.message));
      }
    }
  } catch (err) {
    console.error('Erro no job de placar ao vivo:', err.message);
  }
}, 2 * 60 * 1000);

// Job: lembrete de aposta 2h antes de cada jogo
setInterval(() => {
  notificarLembretes().catch((err) =>
    console.error('Erro no job de lembretes:', err.message)
  );
}, 30 * 60 * 1000);

// Job: AGENDADA → AO_VIVO quando falta ≤ 1 hora para o início
setInterval(async () => {
  try {
    const umaHoraFutura = new Date(Date.now() + 60 * 60 * 1000);
    const { count } = await prisma.partida.updateMany({
      where: { status: 'AGENDADA', data: { lte: umaHoraFutura } },
      data: { status: 'AO_VIVO' },
    });
    if (count > 0) {
      console.log(`⚽ ${count} partida(s) → AO_VIVO`);
      limparCacheRanking();
    }
  } catch (err) {
    console.error('Erro no job de status:', err.message);
  }
}, 5 * 60 * 1000);

module.exports = app;