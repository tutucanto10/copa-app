import { useEffect, useState } from 'react'
import api from '../api/api'

const API_URL = import.meta.env.VITE_API_URL || ''

function PlayerAvatar({ nome, foto_url, tamanho = 42, borda, bg = '#1e2d45', corTexto = '#cbd5e1' }) {
  const iniciais = nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
  const proxied = foto_url ? `${API_URL}/proxy-image?url=${encodeURIComponent(foto_url)}` : null
  return (
    <div style={{
      width: tamanho, height: tamanho, borderRadius: '50%', flexShrink: 0,
      background: bg, border: borda ? `2px solid ${borda}` : 'none',
      overflow: 'hidden', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: tamanho * 0.31, fontWeight: 700, color: corTexto, lineHeight: 1 }}>
        {iniciais}
      </span>
      {proxied && (
        <img
          src={proxied} alt={nome}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        />
      )}
    </div>
  )
}

const GRUPOS_COPA = {
  A: [
    { nome: 'México', escudo: 'https://upload.wikimedia.org/wikipedia/pt/f/f3/Mexico_national_football_team_crest_%282022%29.png' },
    { nome: 'África do Sul', escudo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/South_Africa_national_soccer_team_logo.svg/1280px-South_Africa_national_soccer_team_logo.svg.png' },
    { nome: 'Coreia do Sul', escudo: 'https://upload.wikimedia.org/wikipedia/pt/a/a7/South_Korea_national_football_team_logo.png' },
    { nome: 'Rep. Tcheca', escudo: 'https://upload.wikimedia.org/wikipedia/pt/5/5a/FACR.png' },
  ],
  B: [
    { nome: 'Canadá', escudo: 'https://upload.wikimedia.org/wikipedia/pt/7/7a/Logotipo_Sele%C3%A7%C3%A3o_Canad%C3%A1.png' },
    { nome: 'Suíça', escudo: 'https://upload.wikimedia.org/wikipedia/pt/9/96/SFV_Logo.svg.png' },
    { nome: 'Qatar', escudo: 'https://upload.wikimedia.org/wikipedia/pt/thumb/a/a9/Associa%C3%A7%C3%A3o_do_Qatar_de_Futebol.png/250px-Associa%C3%A7%C3%A3o_do_Qatar_de_Futebol.png' },
    { nome: 'Bósnia H.', escudo: 'https://upload.wikimedia.org/wikipedia/pt/5/5a/Logo_of_the_Football_Association_of_Bosnia_and_Herzegovina_%282013-present%29.png' },
  ],
  C: [
    { nome: 'Brasil', escudo: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Brazilian_Football_Confederation_logo.svg' },
    { nome: 'Marrocos', escudo: 'https://upload.wikimedia.org/wikipedia/pt/7/71/F%C3%A9d%C3%A9ration_Royale_Marocaine_de_Football.png' },
    { nome: 'Escócia', escudo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Scotland_national_football_team_logo_2014.svg/1280px-Scotland_national_football_team_logo_2014.svg.png' },
    { nome: 'Haiti', escudo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0m488kZXKrgflvKZGOlJ3ro_0WcaqNgOvfg&s' },
  ],
  D: [
    { nome: 'EUA', escudo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Crest_of_the_United_States_Soccer_Federation.png' },
    { nome: 'Paraguai', escudo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg/1280px-Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg.png' },
    { nome: 'Austrália', escudo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Australia_national_football_team_badge.svg/960px-Australia_national_football_team_badge.svg.png' },
    { nome: 'Turquia', escudo: 'https://upload.wikimedia.org/wikipedia/en/7/70/Turkish_Football_Federation_crest.svg' },
  ],
  E: [
    { nome: 'Alemanha', escudo: 'https://images.vexels.com/media/users/3/152460/isolated/preview/825e80bac186d247dd9332f1440d20df-logo-do-time-de-futebol-da-alemanha.png?w=360' },
    { nome: 'Curaçao', escudo: 'https://upload.wikimedia.org/wikipedia/pt/f/f7/Federashon_Futb%C3%B2l_K%C3%B2rsou.png' },
    { nome: 'Costa do Marfim', escudo: 'https://upload.wikimedia.org/wikipedia/pt/a/a1/F%C3%A9d%C3%A9ration_Ivorienne_de_Football.png' },
    { nome: 'Equador', escudo: 'https://upload.wikimedia.org/wikipedia/pt/7/74/FEFecu.png' },
  ],
  F: [
    { nome: 'Holanda', escudo: 'https://upload.wikimedia.org/wikipedia/pt/a/a1/Netherlands_national_football_team_logo_2017.png' },
    { nome: 'Japão', escudo: 'https://upload.wikimedia.org/wikipedia/pt/3/32/JapanFA.png' },
    { nome: 'Tunísia', escudo: 'https://upload.wikimedia.org/wikipedia/pt/8/88/F%C3%A9d%C3%A9ration_Tunisienne_de_Football.png' },
    { nome: 'Suécia', escudo: 'https://upload.wikimedia.org/wikipedia/pt/1/14/SFSverige.png' },
  ],
  G: [
    { nome: 'Bélgica', escudo: 'https://upload.wikimedia.org/wikipedia/pt/b/b0/Royal_Belgian_FA_logo_2019.png' },
    { nome: 'Egito', escudo: 'https://upload.wikimedia.org/wikipedia/en/f/f8/Egyptian_Football_Association_logo.svg' },
    { nome: 'Irã', escudo: 'https://upload.wikimedia.org/wikipedia/pt/a/a6/Football_Federation_Islamic_Republic_of_Iran.png' },
    { nome: 'Nova Zelândia', escudo: 'https://upload.wikimedia.org/wikipedia/pt/d/db/New_Zealand_Football.png' },
  ],
  H: [
    { nome: 'Espanha', escudo: 'https://upload.wikimedia.org/wikipedia/pt/3/31/Spain_National_Football_Team_badge.png' },
    { nome: 'Cabo Verde', escudo: 'https://upload.wikimedia.org/wikipedia/pt/e/e1/Federa%C3%A7%C3%A3o_Cabo-Verdiana_de_Futebol.png' },
    { nome: 'Arábia Saudita', escudo: 'https://upload.wikimedia.org/wikipedia/pt/0/01/SAFF.png' },
    { nome: 'Uruguai', escudo: 'https://upload.wikimedia.org/wikipedia/pt/0/04/AUF.png' },
  ],
  I: [
    { nome: 'França', escudo: 'https://upload.wikimedia.org/wikipedia/pt/2/25/Logo_Sele%C3%A7%C3%A3o_Francesa_2018.png' },
    { nome: 'Senegal', escudo: 'https://upload.wikimedia.org/wikipedia/pt/7/7c/FSenegalaiseF.png' },
    { nome: 'Iraque', escudo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Iraq_National_Team_Badge_2021_v1.svg/960px-Iraq_National_Team_Badge_2021_v1.svg.png' },
    { nome: 'Noruega', escudo: 'https://upload.wikimedia.org/wikipedia/pt/9/97/Sele%C3%A7%C3%A3o_Norueguesa_de_Futebol_Logo.png' },
  ],
  J: [
    { nome: 'Argentina', escudo: 'https://upload.wikimedia.org/wikipedia/pt/f/fc/230px-Afa_logo.svg.png' },
    { nome: 'Argélia', escudo: 'https://upload.wikimedia.org/wikipedia/pt/6/6b/Algeria_National_Football_Team_logo.png' },
    { nome: 'Áustria', escudo: 'https://upload.wikimedia.org/wikipedia/pt/c/cb/OFB.png' },
    { nome: 'Jordânia', escudo: 'https://upload.wikimedia.org/wikipedia/pt/4/44/Jordan_Football_Association.png' },
  ],
  K: [
    { nome: 'Portugal', escudo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Portugal_National_Team_logo.png/250px-Portugal_National_Team_logo.png' },
    { nome: 'Colômbia', escudo: 'https://upload.wikimedia.org/wikipedia/pt/4/47/Federacion_Colombiana_de_Futbol_logo.svg.png' },
    { nome: 'Uzbequistão', escudo: 'https://upload.wikimedia.org/wikipedia/pt/thumb/b/b6/Uzbekistan_Football_Federation.png/250px-Uzbekistan_Football_Federation.png' },
    { nome: 'RD Congo', escudo: 'https://upload.wikimedia.org/wikipedia/pt/8/8b/F%C3%A9d%C3%A9ration_Congolaise_de_Football.png' },
  ],
  L: [
    { nome: 'Inglaterra', escudo: 'https://upload.wikimedia.org/wikipedia/en/8/8b/England_national_football_team_crest.svg' },
    { nome: 'Croácia', escudo: 'https://upload.wikimedia.org/wikipedia/pt/c/cf/Croatia_football_federation.png' },
    { nome: 'Gana', escudo: 'https://upload.wikimedia.org/wikipedia/pt/6/67/Ghana_Football_Association.png' },
    { nome: 'Panamá', escudo: 'https://upload.wikimedia.org/wikipedia/pt/a/aa/Panama_FA_2.svg.png' },
  ],
}

export default function Copa() {
  const [abaAtiva, setAbaAtiva] = useState('grupos')
  const [classificacao, setClassificacao] = useState({})
  const [artilheiros, setArtilheiros] = useState([])
  const [assistentes, setAssistentes] = useState([])

  useEffect(() => { carregarDadosCopa() }, [])

  async function carregarDadosCopa() {
    try {
      const [resClass, resArt, resAss] = await Promise.all([
        api.get('/copa/classificacao'),
        api.get('/copa/artilheiros?limit=5'),
        api.get('/copa/assistencias?limit=5'),
      ])
      setClassificacao(resClass.data)
      setArtilheiros(resArt.data)
      setAssistentes(resAss.data)
    } catch (error) {
      console.error('Erro ao carregar dados da Copa:', error)
      const vazio = {}
      Object.keys(GRUPOS_COPA).forEach((g) => {
        vazio[g] = GRUPOS_COPA[g].map((s) => ({
          ...s, jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
          golsPro: 0, golsContra: 0, saldoGols: 0, pontos: 0,
        }))
      })
      setClassificacao(vazio)
    }
  }

  return (
    <div style={{ padding: '1.5rem 1rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{
          fontSize: '1.75rem', fontWeight: 700,
          color: 'var(--color-text-primary)', margin: '0 0 0.3rem',
          fontFamily: 'var(--fonte-display)', letterSpacing: '2px',
        }}>
          COPA 2026 🏆
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
          Grupos, artilheiros e mata-mata em tempo real
        </p>
      </div>

      {/* Abas */}
      <div style={{
        display: 'flex', marginBottom: '1.5rem',
        borderBottom: '1px solid var(--color-border-tertiary)',
        overflowX: 'auto',
      }}>
        {[
          { id: 'grupos', label: '📊 Grupos' },
          { id: 'artilheiros', label: '⚽ Artilheiros' },
          { id: 'matamata', label: '🏅 Mata-Mata' },
        ].map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            style={{
              padding: '0.65rem 1.1rem', border: 'none', background: 'transparent',
              color: abaAtiva === aba.id ? '#00a651' : 'var(--color-text-secondary)',
              fontWeight: abaAtiva === aba.id ? 700 : 500, cursor: 'pointer',
              borderBottom: abaAtiva === aba.id ? '3px solid #00a651' : '3px solid transparent',
              whiteSpace: 'nowrap', fontSize: 14, transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {/* ── GRUPOS ── */}
      {abaAtiva === 'grupos' && (
        <div className="copa-grupos-grid">
          {Object.keys(GRUPOS_COPA).map((letra) => {
            const raw = classificacao[letra] || GRUPOS_COPA[letra].map((s) => ({
              nome: s.nome, escudo: s.escudo,
              jogos: 0, saldoGols: 0, pontos: 0,
            }))
            const times = raw
              .filter((t, i, arr) => arr.findIndex((x) => x.nome === t.nome) === i)
              .slice(0, 4)

            return (
              <div key={letra} style={{
                background: 'linear-gradient(160deg, #1a4d2e 0%, #0d2316 100%)',
                borderRadius: 10, overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
              }}>
                {/* Cabeçalho do grupo */}
                <div style={{
                  padding: '0.45rem 0.65rem',
                  background: 'rgba(0,0,0,0.25)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>
                    GRUPO {letra}
                  </span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {['J', 'SG', 'PTS'].map((col) => (
                      <span key={col} style={{
                        fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 700,
                        width: col === 'J' ? 16 : 22, textAlign: 'center',
                      }}>{col}</span>
                    ))}
                  </div>
                </div>

                {/* Times */}
                <div style={{ padding: '0.35rem 0.4rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {times.map((time, index) => (
                    <div key={index} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '0.28rem 0.45rem', borderRadius: 5,
                      background: index < 2 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                      borderLeft: `2px solid ${index === 0 ? '#fbbf24' : index === 1 ? 'rgba(255,255,255,0.25)' : 'transparent'}`,
                    }}>
                      <img
                        src={time.escudo}
                        alt={time.nome}
                        style={{ width: 18, height: 14, objectFit: 'contain', flexShrink: 0 }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      <span style={{
                        flex: 1, minWidth: 0, fontSize: 10,
                        fontWeight: index < 2 ? 700 : 400,
                        color: index < 2 ? '#fff' : 'rgba(255,255,255,0.5)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {time.nome}
                      </span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 16, textAlign: 'center' }}>
                        {time.jogos ?? 0}
                      </span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 22, textAlign: 'center' }}>
                        {time.saldoGols != null
                          ? time.saldoGols > 0 ? `+${time.saldoGols}` : time.saldoGols
                          : 0}
                      </span>
                      <span style={{
                        fontSize: 12, fontWeight: 900, width: 22, textAlign: 'center',
                        color: index === 0 ? '#fbbf24' : index === 1 ? '#86efac' : '#00a651',
                      }}>
                        {time.pontos ?? 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── ARTILHEIROS ── */}
      {abaAtiva === 'artilheiros' && (
        <div className="copa-stats-grid">
          {/* Artilheiros */}
          <div>
            <div style={{
              fontSize: '0.7rem', fontWeight: 800, letterSpacing: 1.5,
              color: 'var(--color-text-secondary)', textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>⚽ Artilheiros</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {artilheiros.length === 0 ? (
                <div style={{
                  textAlign: 'center', color: 'var(--color-text-secondary)',
                  padding: '2rem', background: 'var(--color-background-secondary)', borderRadius: 12,
                }}>
                  Disponível quando a Copa começar ⚽
                </div>
              ) : artilheiros.map((jogador, index) => (
                <div key={index} style={{
                  background: index === 0
                    ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                    : 'var(--color-background-secondary)',
                  borderRadius: 12, padding: '0.65rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <span style={{
                    fontWeight: 900, fontSize: 12, minWidth: 20, textAlign: 'center',
                    color: index === 0 ? '#78350f' : 'var(--color-text-secondary)',
                  }}>#{index + 1}</span>

                  <PlayerAvatar
                    nome={jogador.nome}
                    foto_url={jogador.foto_url}
                    borda={index === 0 ? '#92400e' : '#2d3f55'}
                    bg={index === 0 ? '#92400e' : '#1e2d45'}
                    corTexto={index === 0 ? '#fbbf24' : '#94a3b8'}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: index === 0 ? '#1c0a00' : 'var(--color-text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{jogador.nome}</div>
                    <div style={{ fontSize: 11, color: index === 0 ? '#78350f' : 'var(--color-text-secondary)' }}>
                      {jogador.selecao}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: index === 0 ? '#1c0a00' : '#00a651', lineHeight: 1 }}>
                      {jogador.gols}
                    </div>
                    <div style={{ fontSize: 9, color: index === 0 ? '#92400e' : 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      gols
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assistências */}
          <div>
            <div style={{
              fontSize: '0.7rem', fontWeight: 800, letterSpacing: 1.5,
              color: 'var(--color-text-secondary)', textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>🅰️ Assistências</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {assistentes.length === 0 ? (
                <div style={{
                  textAlign: 'center', color: 'var(--color-text-secondary)',
                  padding: '2rem', background: 'var(--color-background-secondary)', borderRadius: 12,
                }}>
                  Disponível quando a Copa começar 🅰️
                </div>
              ) : assistentes.map((jogador, index) => (
                <div key={index} style={{
                  background: index === 0
                    ? 'linear-gradient(135deg, #60a5fa, #3b82f6)'
                    : 'var(--color-background-secondary)',
                  borderRadius: 12, padding: '0.65rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <span style={{
                    fontWeight: 900, fontSize: 12, minWidth: 20, textAlign: 'center',
                    color: index === 0 ? '#fff' : 'var(--color-text-secondary)',
                  }}>#{index + 1}</span>

                  <PlayerAvatar
                    nome={jogador.nome}
                    foto_url={jogador.foto_url}
                    borda={index === 0 ? 'rgba(255,255,255,0.4)' : '#2d3f55'}
                    bg={index === 0 ? 'rgba(255,255,255,0.2)' : '#1e2d45'}
                    corTexto={index === 0 ? '#fff' : '#94a3b8'}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: index === 0 ? '#fff' : 'var(--color-text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{jogador.nome}</div>
                    <div style={{ fontSize: 11, color: index === 0 ? 'rgba(255,255,255,0.75)' : 'var(--color-text-secondary)' }}>
                      {jogador.selecao}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: index === 0 ? '#fff' : '#3b82f6', lineHeight: 1 }}>
                      {jogador.assistencias}
                    </div>
                    <div style={{ fontSize: 9, color: index === 0 ? 'rgba(255,255,255,0.7)' : 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      asts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MATA-MATA ── */}
      {abaAtiva === 'matamata' && (
        <div style={{
          background: 'var(--color-background-secondary)',
          borderRadius: 12, padding: '2rem', textAlign: 'center',
        }}>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', margin: 0 }}>
            Chaveamento será exibido após a fase de grupos
          </p>
        </div>
      )}
    </div>
  )
}
