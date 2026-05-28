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

module.exports = { buscarAoVivo, buscarPartidasLiga, buscarFixture, converterStatus };
