const express = require('express');
const cors = require('cors');

const partidaRoutes   = require('./src/routes/partidaRoutes');
const apostasRoutes   = require('./src/routes/apostaRoutes');
const eventoRoutes    = require('./src/routes/eventoRoutes');
const goleadorRoutes  = require('./src/routes/goleadorRoutes');
const rankingRoutes   = require('./src/routes/rankingRoutes');
const authRoutes      = require('./src/routes/authRoutes');
const ligaRoutes      = require('./src/routes/ligaRoutes');
const rodadaRoutes    = require('./src/routes/rodadaRoutes');
const jogadorRoutes   = require('./src/routes/jogadorRoutes');
const perfilRoutes    = require('./src/routes/perfilRoutes');
const copaRoutes      = require('./src/routes/copaRoutes');

const { verificarAdmin, loginAdmin } = require('./middleware/adminAuth');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Rota de login admin (SEM proteção)
app.post('/admin/login', loginAdmin);

// Rotas públicas (usuários podem ver)
app.use('/auth',            authRoutes);
app.use('/ranking',         rankingRoutes);
app.use('/perfil',          perfilRoutes);
app.use('/aposta',          apostasRoutes);
app.use('/apostas',         apostasRoutes);
app.use('/aposta-goleador', goleadorRoutes);
app.use('/ligas',           ligaRoutes);

// Partidas e Copa: públicos para visualização
app.use('/partidas',        partidaRoutes);  // Todos podem ver partidas
app.use('/copa',            copaRoutes);     // Todos podem ver copa

// Rotas 100% protegidas (ADMIN apenas - criar/editar/deletar)
app.use('/eventos',         verificarAdmin, eventoRoutes);
app.use('/evento',          verificarAdmin, eventoRoutes);
app.use('/rodadas',         verificarAdmin, rodadaRoutes);
app.use('/jogadores',       verificarAdmin, jogadorRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;