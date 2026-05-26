import { useEffect, useState } from 'react'
import api from '../api/api'

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
  const [partidasDoDia, setPartidasDoDia] = useState([])

  useEffect(() => {
    carregarDadosCopa()
  }, [])

  async function carregarDadosCopa() {
    try {
      // Busca classificação dos grupos
      const resClassificacao = await api.get('/copa/classificacao')
      setClassificacao(resClassificacao.data)

      // Busca artilheiros
      const resArtilheiros = await api.get('/copa/artilheiros?limit=5')
      setArtilheiros(resArtilheiros.data)

      // Busca assistências
      const resAssistencias = await api.get('/copa/assistencias?limit=5')
      setAssistentes(resAssistencias.data)
    } catch (error) {
      console.error('Erro ao carregar dados da Copa:', error)
      // Em caso de erro, mantém dados vazios
      const classifVazia = {}
      Object.keys(GRUPOS_COPA).forEach((grupo) => {
        classifVazia[grupo] = GRUPOS_COPA[grupo].map((selecao) => ({
          ...selecao,
          jogos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          golsPro: 0,
          golsContra: 0,
          saldoGols: 0,
          pontos: 0,
        }))
      })
      setClassificacao(classifVazia)
      setArtilheiros([])
      setAssistentes([])
    }
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 0.5rem',
        }}>
          Copa do Mundo 2026 🏆
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
          Acompanhe grupos, artilheiros e mata-mata em tempo real
        </p>
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border-tertiary)' }}>
        {[
          { id: 'grupos', label: '📊 Grupos' },
          { id: 'artilheiros', label: '⚽ Artilheiros' },
          { id: 'matamata', label: '🏅 Mata-Mata' },
        ].map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: 'transparent',
              color: abaAtiva === aba.id ? '#00a651' : 'var(--color-text-secondary)',
              fontWeight: abaAtiva === aba.id ? 700 : 500,
              cursor: 'pointer',
              borderBottom: abaAtiva === aba.id ? '3px solid #00a651' : '3px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {/* Conteúdo - Grupos - VISUALIZAÇÃO COMPLETA */}
      {abaAtiva === 'grupos' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          maxWidth: 1600,
          margin: '0 auto',
        }}>
          {Object.keys(GRUPOS_COPA).map((letra) => (
            <div
              key={letra}
              style={{
                background: 'linear-gradient(135deg, #1a4d2e 0%, #0d2b1a 100%)',
                borderRadius: 12,
                padding: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '1rem',
                backdropFilter: 'blur(10px)',
              }}>
                {/* Header do Grupo */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '2px solid rgba(255,255,255,0.2)',
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#fff',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Grupo {letra}
                  </h3>
                </div>

                {/* Seleções */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {GRUPOS_COPA[letra]?.map((selecao, index) => {
                    const dados = classificacao[letra]?.[index]
                    return (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255,255,255,0.98)',
                          borderRadius: 6,
                          padding: '0.5rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          borderLeft: index === 0 ? '3px solid #fbbf24' : '3px solid transparent',
                        }}
                      >
                        {/* Escudo */}
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 4,
                          flexShrink: 0,
                          background: '#f9fafb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 2,
                        }}>
                          <img
                            src={selecao.escudo}
                            alt={selecao.nome}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </div>

                        {/* Nome */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#1f2937',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {selecao.nome}
                          </div>
                          {dados && (
                            <div style={{
                              fontSize: 9,
                              color: '#6b7280',
                              marginTop: '0.1rem',
                            }}>
                              {dados.jogos}J • {dados.vitorias}V • {dados.empates}E
                            </div>
                          )}
                        </div>

                        {/* Pontos */}
                        {dados && (
                          <div style={{
                            fontSize: 20,
                            fontWeight: 900,
                            color: index === 0 ? '#fbbf24' : '#00a651',
                            minWidth: 28,
                            textAlign: 'right',
                          }}>
                            {dados.pontos}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conteúdo - Artilheiros */}
      {abaAtiva === 'artilheiros' && (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Top Artilheiros */}
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '1rem',
              }}>⚽ Artilheiros</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {artilheiros.map((jogador, index) => (
                  <div
                    key={index}
                    style={{
                      background: index === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'var(--color-background-primary)',
                      border: '1px solid var(--color-border-tertiary)',
                      borderRadius: 12,
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: index === 0 ? '#000' : '#00a651',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: 14,
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: index === 0 ? '#000' : 'var(--color-text-primary)',
                      }}>
                        {jogador.nome}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: index === 0 ? 'rgba(0,0,0,0.7)' : 'var(--color-text-secondary)',
                      }}>
                        {jogador.selecao}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: index === 0 ? '#000' : '#00a651',
                    }}>
                      {jogador.gols}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Assistências */}
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '1rem',
              }}>🅰️ Assistências</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {assistentes.map((jogador, index) => (
                  <div
                    key={index}
                    style={{
                      background: index === 0 ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' : 'var(--color-background-primary)',
                      border: '1px solid var(--color-border-tertiary)',
                      borderRadius: 12,
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: index === 0 ? '#000' : '#3b82f6',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: 14,
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: index === 0 ? '#fff' : 'var(--color-text-primary)',
                      }}>
                        {jogador.nome}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: index === 0 ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)',
                      }}>
                        {jogador.selecao}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: index === 0 ? '#fff' : '#3b82f6',
                    }}>
                      {jogador.assistencias}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo - Mata-Mata */}
      {abaAtiva === 'matamata' && (
        <div style={{
          background: 'var(--color-background-secondary)',
          borderRadius: 12,
          padding: '2rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Chaveamento do mata-mata será exibido após a conclusão da fase de grupos
          </p>
        </div>
      )}
    </div>
  )
}