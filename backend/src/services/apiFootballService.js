const BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY  = process.env.APIFOOTBALL_KEY;

async function apiFetch(path) {
  if (!API_KEY) throw new Error('APIFOOTBALL_KEY não configurada');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'x-apisports-key': API_KEY },
  });
  if (!res.ok) throw new Error(`API-Football erro ${res.status}`);
  const json = await res.json();
  return json.response;
}

// Busca todas as partidas ao vivo agora
async function buscarAoVivo() {
  return apiFetch('/fixtures?live=all');
}

// Busca partidas de uma liga/temporada
async function buscarPartidasLiga(leagueId, season = 2026) {
  return apiFetch(`/fixtures?league=${leagueId}&season=${season}`);
}

// Busca uma partida específica pelo ID externo
async function buscarFixture(fixtureId) {
  const data = await apiFetch(`/fixtures?id=${fixtureId}`);
  return data[0] || null;
}

// Converte status da API para nosso status interno
function converterStatus(apiStatus) {
  const ao_vivo = ['1H', '2H', 'ET', 'BT', 'P', 'LIVE', 'HT'];
  const finalizada = ['FT', 'AET', 'PEN'];
  if (ao_vivo.includes(apiStatus)) return 'AO_VIVO';
  if (finalizada.includes(apiStatus)) return 'FINALIZADA';
  return 'AGENDADA';
}

async function buscarTopScorers(leagueId = 1, season = 2026, limit = 5) {
  const data = await apiFetch(`/players/topscorers?league=${leagueId}&season=${season}`);
  return data.slice(0, limit).map((item) => ({
    nome: item.player.name,
    foto_url: item.player.photo,
    selecao: item.statistics[0]?.team?.name || '',
    gols: item.statistics[0]?.goals?.total || 0,
  }));
}

async function buscarTopAssists(leagueId = 1, season = 2026, limit = 5) {
  const data = await apiFetch(`/players/topassists?league=${leagueId}&season=${season}`);
  return data.slice(0, limit).map((item) => ({
    nome: item.player.name,
    foto_url: item.player.photo,
    selecao: item.statistics[0]?.team?.name || '',
    assistencias: item.statistics[0]?.goals?.assists || 0,
  }));
}

async function buscarStandings(leagueId = 1, season = 2026) {
  const data = await apiFetch(`/standings?league=${leagueId}&season=${season}`);
  if (!data?.[0]?.league?.standings) return null;

  const grupos = {};
  for (const grupo of data[0].league.standings) {
    if (!grupo.length) continue;
    const letra = grupo[0].group?.replace(/^Group\s*/i, '').trim();
    if (!letra) continue;
    grupos[letra] = grupo.map((t) => ({
      nome: t.team.name,
      escudo: t.team.logo,
      jogos: t.all.played,
      vitorias: t.all.win,
      empates: t.all.draw,
      derrotas: t.all.lose,
      golsPro: t.all.goals.for,
      golsContra: t.all.goals.against,
      saldoGols: t.goalsDiff,
      pontos: t.points,
    }));
  }
  return grupos;
}

async function buscarEventosFixture(fixtureId) {
  const data = await apiFetch(`/fixtures/events?fixture=${fixtureId}`);
  return (data || []).filter((e) => {
    const tipo = e.type?.toLowerCase();
    const detalhe = e.detail?.toLowerCase();
    return tipo === 'goal' || (tipo === 'card' && (detalhe === 'yellow card' || detalhe === 'red card'));
  }).map((e) => ({
    minuto: e.time?.elapsed ?? 0,
    nomeJogador: e.player?.name || null,
    nomeTime: e.team?.name || null,
    tipo: e.type?.toLowerCase() === 'goal' ? 'GOL'
      : e.detail?.toLowerCase() === 'yellow card' ? 'AMARELO' : 'VERMELHO',
  }));
}

module.exports = { buscarAoVivo, buscarPartidasLiga, buscarFixture, converterStatus, buscarTopScorers, buscarTopAssists, buscarStandings, buscarEventosFixture };
