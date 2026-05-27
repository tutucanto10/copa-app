import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import Placar from '../components/Placar'
import Timeline from '../components/Timeline'

export default function Partida() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const USUARIO_ID = usuario?.id
  const navigate = useNavigate()
  const [partida, setPartida] = useState(null)
  const [eventos, setEventos] = useState([])
  const [jogadores, setJogadores] = useState([])
  const [aposta, setAposta] = useState({ placarCasa: '', placarFora: '' })
  const [apostaFeita, setApostaFeita] = useState(null)
  const [vencedorAposta, setVencedorAposta] = useState(null)
  const [vencedorFeito, setVencedorFeito] = useState(null)
  const [goleadoresSelecionados, setGoleadoresSelecionados] = useState([])
  const [goleadoresFeitos, setGoleadoresFeitos] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState('vencedor')
  const [rodadaAberta, setRodadaAberta] = useState(true)

  useEffect(() => {
    api.get(`/partidas/${id}`).then((r) => setPartida(r.data))
    api.get(`/eventos/${id}`).then((r) => setEventos(r.data))
    api.get(`/partidas/${id}/jogadores`).then((r) => setJogadores(r.data))

    if (USUARIO_ID) {
      api.get(`/apostas/usuario/${USUARIO_ID}/${id}`)
        .then((r) => {
          if (r.data) {
            setApostaFeita({
              placarCasa: r.data.placarCasa,
              placarFora: r.data.placarFora,
            })
          }
        })
        .catch(() => {})
    }

    const vencedorSalvo = localStorage.getItem(`vencedor_${id}`)
    if (vencedorSalvo) setVencedorFeito(vencedorSalvo)

    const goleadoresSalvos = localStorage.getItem(`goleadores_${id}`)
    if (goleadoresSalvos) setGoleadoresFeitos(JSON.parse(goleadoresSalvos))
  }, [id, USUARIO_ID])

  useEffect(() => {
    if (!partida) return
    api.get('/rodadas').then((r) => {
      const rodada = r.data.find((rd) => rd.numero === partida.rodada)
      if (rodada) setRodadaAberta(rodada.apostasAbertas)
    })
  }, [partida])

  const finalizada = partida?.status === 'FINALIZADA'
  const aoVivo = partida?.status === 'AO_VIVO'
  const podeApostar = !finalizada && !aoVivo

  const acertouPlacar = apostaFeita && finalizada &&
    apostaFeita.placarCasa === partida?.placarCasa &&
    apostaFeita.placarFora === partida?.placarFora

  const vencedorReal = partida
    ? partida.placarCasa > partida.placarFora ? 'casa'
    : partida.placarFora > partida.placarCasa ? 'fora' : 'empate'
    : null

  const acertouVencedor = vencedorFeito && finalizada && vencedorFeito === vencedorReal

  async function handleVencedor(opcao) {
  if (vencedorFeito || !podeApostar) return
  setVencedorAposta(opcao)
  try {
    await api.post('/apostas/vencedor', {
      usuarioId: USUARIO_ID,
      partidaId: Number(id),
      vencedor: opcao,
    })
    localStorage.setItem(`vencedor_${id}`, opcao)
    setVencedorFeito(opcao)
  } catch (err) {
    alert('Erro ao registrar aposta de vencedor: ' + err.message)
  }
}

  async function handleAposta(e) {
    e.preventDefault()
    if (aposta.placarCasa === '' || aposta.placarFora === '') return
    setEnviando(true)
    try {
      await api.post('/aposta', {
        usuarioId: USUARIO_ID,
        partidaId: Number(id),
        placarCasa: Number(aposta.placarCasa),
        placarFora: Number(aposta.placarFora),
      })
      const feita = {
        placarCasa: Number(aposta.placarCasa),
        placarFora: Number(aposta.placarFora),
      }
      setApostaFeita(feita)
    } catch (err) {
      alert('Erro ao registrar aposta: ' + err.message)
    } finally {
      setEnviando(false)
    }
  }

  async function handleGoleadores(e) {
    e.preventDefault()
    if (goleadoresSelecionados.length === 0) return
    setEnviando(true)
    try {
      await api.post('/aposta-goleador', {
        usuarioId: USUARIO_ID,
        partidaId: Number(id),
        jogadorIds: goleadoresSelecionados,
      })
      const nomes = jogadores
        .filter((j) => goleadoresSelecionados.includes(j.id))
        .map((j) => j.nome)
      localStorage.setItem(`goleadores_${id}`, JSON.stringify(nomes))
      setGoleadoresFeitos(nomes)
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setEnviando(false)
    }
  }

  function toggleGoleador(jogadorId) {
    setGoleadoresSelecionados((prev) =>
      prev.includes(jogadorId) ? prev.filter((i) => i !== jogadorId) : [...prev, jogadorId]
    )
  }

  if (!partida) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#8b9bb4' }}>Carregando...</div>
  )

  const inputStyle = {
    width: 70, background: '#0a0e1a', border: '1px solid #1e2d45',
    borderRadius: 8, color: '#f0f4ff', fontSize: '1.5rem',
    fontFamily: 'var(--fonte-display)', textAlign: 'center',
    padding: '0.5rem', outline: 'none',
  }

  const abaStyle = (a) => ({
    background: 'none', border: 'none',
    borderBottom: abaAtiva === a ? '2px solid #00a651' : '2px solid transparent',
    color: abaAtiva === a ? '#f0f4ff' : '#8b9bb4',
    fontFamily: 'var(--fonte-display)', fontSize: '0.95rem',
    letterSpacing: '1.5px', padding: '0.5rem 1rem', cursor: 'pointer',
  })

  const msgBloqueio = (
    <div style={{
      background: '#1a0a0a', border: '1px solid #e8192c',
      borderRadius: 8, padding: '0.75rem 1rem',
      color: '#e8192c', fontWeight: 600, fontSize: '0.9rem',
    }}>
      🔒 {finalizada
        ? 'Partida finalizada — apostas encerradas'
        : aoVivo
        ? 'Jogo em andamento — apostas encerradas'
        : 'Apostas encerradas'}
    </div>
  )

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <button onClick={() => navigate('/')} style={{
        background: 'none', border: 'none', color: '#8b9bb4',
        marginBottom: '1.5rem', fontSize: '0.85rem',
        display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      }}>← Voltar</button>

      {/* Placar */}
      <div style={{
        background: '#111827', border: '1px solid #1e2d45',
        borderRadius: 12, padding: '2rem', marginBottom: '1.5rem', textAlign: 'center',
      }}>
        <Placar partida={partida} grande />
      </div>

      {/* Resultado das apostas */}
      {finalizada && (apostaFeita || vencedorFeito) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {vencedorFeito && (
            <div style={{
              background: acertouVencedor ? '#022c1a' : '#1f0a0a',
              border: `1px solid ${acertouVencedor ? '#00a651' : '#e8192c'}`,
              borderRadius: 12, padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{acertouVencedor ? '✅' : '❌'}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--fonte-display)', fontSize: '1.1rem',
                  letterSpacing: '2px', color: acertouVencedor ? '#00a651' : '#e8192c',
                }}>
                  {acertouVencedor ? 'VENCEDOR CERTO!' : 'VENCEDOR ERRADO!'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#8b9bb4', marginTop: 2 }}>
                  Você apostou: {vencedorFeito === 'casa' ? partida.selecaoCasa?.nome : vencedorFeito === 'fora' ? partida.selecaoFora?.nome : 'Empate'}
                  {' · '}
                  Resultado: {vencedorReal === 'casa' ? partida.selecaoCasa?.nome : vencedorReal === 'fora' ? partida.selecaoFora?.nome : 'Empate'}
                </div>
              </div>
              {acertouVencedor && !acertouPlacar && (
                <div style={{
                  background: '#00a651', borderRadius: 8,
                  padding: '0.4rem 0.75rem', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.4rem', color: '#fff' }}>+1</div>
                  <div style={{ fontSize: '0.65rem', color: '#d4f5e9', letterSpacing: 1 }}>PTS</div>
                </div>
              )}
            </div>
          )}

          {apostaFeita && (
            <div style={{
              background: acertouPlacar ? '#022c1a' : '#1f0a0a',
              border: `1px solid ${acertouPlacar ? '#00a651' : '#e8192c'}`,
              borderRadius: 12, padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{acertouPlacar ? '✅' : '❌'}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--fonte-display)', fontSize: '1.1rem',
                  letterSpacing: '2px', color: acertouPlacar ? '#00a651' : '#e8192c',
                }}>
                  {acertouPlacar ? 'PLACAR EXATO!' : 'PLACAR ERRADO!'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#8b9bb4', marginTop: 2 }}>
                  {acertouPlacar
                    ? `Placar correto: ${partida.placarCasa} × ${partida.placarFora}`
                    : `Você apostou: ${apostaFeita.placarCasa} × ${apostaFeita.placarFora} · Resultado: ${partida.placarCasa} × ${partida.placarFora}`
                  }
                </div>
              </div>
              {acertouPlacar && (
                <div style={{
                  background: '#00a651', borderRadius: 8,
                  padding: '0.4rem 0.75rem', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.4rem', color: '#fff' }}>+3</div>
                  <div style={{ fontSize: '0.65rem', color: '#d4f5e9', letterSpacing: 1 }}>PTS</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Abas de aposta */}
      <div style={{
        background: '#111827', border: '1px solid #1e2d45',
        borderRadius: 12, marginBottom: '1.5rem', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #1e2d45', padding: '0 1rem' }}>
          <button style={abaStyle('vencedor')} onClick={() => setAbaAtiva('vencedor')}>🏆 QUEM VENCE?</button>
          <button style={abaStyle('placar')} onClick={() => setAbaAtiva('placar')}>🎯 PLACAR EXATO</button>
          <button style={abaStyle('goleadores')} onClick={() => setAbaAtiva('goleadores')}>⚽ GOLEADORES</button>
        </div>

        <div style={{ padding: '1.5rem' }}>

          {/* ABA VENCEDOR */}
          {abaAtiva === 'vencedor' && (
            <>
              <p style={{ color: '#8b9bb4', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Quem você acha que vai vencer? Acerte e ganhe <strong style={{ color: '#f5d000' }}>+1pts</strong>
              </p>

              {vencedorFeito ? (
                <div style={{
                  background: '#0a1a10', border: '1px solid #00a651',
                  borderRadius: 8, padding: '0.75rem 1rem',
                  color: '#00a651', fontWeight: 600,
                }}>
                  ✅ Você apostou em: <strong>
                    {vencedorFeito === 'casa' ? partida.selecaoCasa?.nome
                      : vencedorFeito === 'fora' ? partida.selecaoFora?.nome
                      : 'Empate'}
                  </strong>
                  {podeApostar && (
                    <button onClick={() => { setVencedorFeito(null); localStorage.removeItem(`vencedor_${id}`) }}
                      style={{
                        marginLeft: '1rem', background: 'none',
                        border: '1px solid #1e2d45', borderRadius: 6,
                        color: '#8b9bb4', padding: '0.2rem 0.6rem',
                        fontSize: '0.75rem', cursor: 'pointer',
                      }}>Alterar</button>
                  )}
                </div>
              ) : !podeApostar ? msgBloqueio : (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { key: 'casa', label: partida.selecaoCasa?.nome, flag: partida.selecaoCasa?.escudo_url },
                    { key: 'empate', label: 'Empate', flag: null },
                    { key: 'fora', label: partida.selecaoFora?.nome, flag: partida.selecaoFora?.escudo_url },
                  ].map((op) => (
                    <button key={op.key} onClick={() => handleVencedor(op.key)} style={{
                      flex: 1, minWidth: 100,
                      background: vencedorAposta === op.key ? '#0a1a10' : '#0a0e1a',
                      border: `2px solid ${vencedorAposta === op.key ? '#00a651' : '#1e2d45'}`,
                      borderRadius: 12, padding: '1rem',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '0.5rem',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                      {op.flag ? (
                        <img src={op.flag} alt={op.label} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>🤝</span>
                      )}
                      <span style={{
                        fontFamily: 'var(--fonte-display)', fontSize: '0.95rem',
                        letterSpacing: 1, color: '#f0f4ff',
                      }}>{op.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ABA PLACAR */}
          {abaAtiva === 'placar' && (
            <>
              <p style={{ color: '#8b9bb4', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Acerte o placar exato e ganhe <strong style={{ color: '#f5d000' }}>+3pts</strong>
              </p>

              {apostaFeita ? (
                <div>
                  <div style={{
                    background: '#0a1a10', border: '1px solid #00a651',
                    borderRadius: 8, padding: '0.75rem 1rem',
                    color: '#00a651', fontWeight: 600,
                  }}>
                    ✅ Aposta: {apostaFeita.placarCasa} × {apostaFeita.placarFora}
                    {!finalizada && podeApostar && ' — aguardando resultado'}
                  </div>
                  {podeApostar && (
                    <form onSubmit={handleAposta} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#8b9bb4' }}>{partida.selecaoCasa?.nome}</span>
                        <input type="number" min={0} value={aposta.placarCasa}
                          onChange={(e) => setAposta({ ...aposta, placarCasa: e.target.value })}
                          style={inputStyle} />
                        <span style={{ color: '#8b9bb4' }}>×</span>
                        <input type="number" min={0} value={aposta.placarFora}
                          onChange={(e) => setAposta({ ...aposta, placarFora: e.target.value })}
                          style={inputStyle} />
                        <span style={{ fontSize: '0.85rem', color: '#8b9bb4' }}>{partida.selecaoFora?.nome}</span>
                      </div>
                      <button type="submit" disabled={enviando} style={{
                        background: '#1e2d45', color: '#f0f4ff', border: 'none',
                        borderRadius: 8, padding: '0.6rem 1.5rem',
                        fontWeight: 700, fontSize: '0.9rem', letterSpacing: 1,
                        opacity: enviando ? 0.6 : 1, cursor: 'pointer',
                      }}>
                        {enviando ? 'Enviando...' : 'ALTERAR'}
                      </button>
                    </form>
                  )}
                </div>
              ) : !podeApostar ? msgBloqueio : (
                <form onSubmit={handleAposta} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#8b9bb4' }}>{partida.selecaoCasa?.nome}</span>
                    <input type="number" min={0} value={aposta.placarCasa}
                      onChange={(e) => setAposta({ ...aposta, placarCasa: e.target.value })}
                      style={inputStyle} />
                    <span style={{ color: '#8b9bb4' }}>×</span>
                    <input type="number" min={0} value={aposta.placarFora}
                      onChange={(e) => setAposta({ ...aposta, placarFora: e.target.value })}
                      style={inputStyle} />
                    <span style={{ fontSize: '0.85rem', color: '#8b9bb4' }}>{partida.selecaoFora?.nome}</span>
                  </div>
                  <button type="submit" disabled={enviando} style={{
                    background: '#00a651', color: '#fff', border: 'none',
                    borderRadius: 8, padding: '0.6rem 1.5rem',
                    fontWeight: 700, fontSize: '0.9rem', letterSpacing: 1,
                    opacity: enviando ? 0.6 : 1, cursor: 'pointer',
                  }}>
                    {enviando ? 'Enviando...' : 'APOSTAR'}
                  </button>
                </form>
              )}
            </>
          )}

          {/* ABA GOLEADORES */}
          {abaAtiva === 'goleadores' && (
            <>
              <p style={{ color: '#8b9bb4', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Selecione os jogadores que você acha que vão marcar gol
              </p>

              {goleadoresFeitos ? (
                <div>
                  <div style={{ color: '#00a651', fontWeight: 600, marginBottom: '0.75rem' }}>
                    ✅ Goleadores apostados:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {goleadoresFeitos.map((nome) => (
                      <span key={nome} style={{
                        background: '#0a1a10', border: '1px solid #00a651',
                        borderRadius: 20, padding: '0.3rem 0.75rem',
                        fontSize: '0.85rem', color: '#00a651',
                      }}>⚽ {nome}</span>
                    ))}
                  </div>
                  {podeApostar && (
                    <button onClick={() => { setGoleadoresFeitos(null); localStorage.removeItem(`goleadores_${id}`) }}
                      style={{
                        marginTop: '1rem', background: 'none',
                        border: '1px solid #1e2d45', borderRadius: 8,
                        color: '#8b9bb4', padding: '0.4rem 1rem',
                        fontSize: '0.8rem', cursor: 'pointer',
                      }}>Alterar apostas</button>
                  )}
                </div>
              ) : !podeApostar ? msgBloqueio : (
                <form onSubmit={handleGoleadores}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {jogadores.map((j) => {
                      const sel = goleadoresSelecionados.includes(j.id)
                      return (
                        <div key={j.id} onClick={() => toggleGoleador(j.id)} style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          background: sel ? '#0a1a10' : '#0a0e1a',
                          border: `1px solid ${sel ? '#00a651' : '#1e2d45'}`,
                          borderRadius: 8, padding: '0.6rem 1rem', cursor: 'pointer',
                        }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%',
                            border: `2px solid ${sel ? '#00a651' : '#1e2d45'}`,
                            background: sel ? '#00a651' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', color: '#fff', flexShrink: 0,
                          }}>{sel ? '✓' : ''}</div>
                          <span style={{ fontWeight: 600, color: '#f0f4ff' }}>{j.nome}</span>
                          <span style={{ color: '#8b9bb4', fontSize: '0.8rem', marginLeft: 'auto' }}>{j.selecao?.nome}</span>
                        </div>
                      )
                    })}
                  </div>
                  <button type="submit" disabled={enviando || goleadoresSelecionados.length === 0} style={{
                    background: goleadoresSelecionados.length > 0 ? '#00a651' : '#1e2d45',
                    color: '#fff', border: 'none', borderRadius: 8,
                    padding: '0.6rem 1.5rem', fontWeight: 700,
                    fontSize: '0.9rem', letterSpacing: 1,
                    cursor: goleadoresSelecionados.length > 0 ? 'pointer' : 'not-allowed',
                  }}>
                    {enviando ? 'Salvando...' : `CONFIRMAR (${goleadoresSelecionados.length})`}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: '#111827', border: '1px solid #1e2d45',
        borderRadius: 12, padding: '1.5rem',
      }}>
        <h2 style={{
          fontFamily: 'var(--fonte-display)', fontSize: '1.4rem',
          letterSpacing: '2px', marginBottom: '1rem', color: '#f0f4ff',
        }}>
          📋 TIMELINE DE EVENTOS
        </h2>
        <Timeline eventos={eventos} />
      </div>
    </div>
  )
}