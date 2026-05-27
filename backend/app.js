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
const copaRoutes      = require('./src/routes/copaRoutes');

const { verificarAdmin, loginAdmin } = require('./middleware/adminAuth');
const pushRoutes = require('./src/routes/pushRoutes');

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
app.use('/push',            pushRoutes);

// Partidas e Copa: públicos para visualização
app.use('/partidas',        partidaRoutes);  // Todos podem ver partidas
app.use('/copa',            copaRoutes);     // Todos podem ver copa

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

module.exports = app;