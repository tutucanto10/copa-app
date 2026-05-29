import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

function formatarHora(data) {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  })
}

function horarioFechamento(data) {
  const fecha = new Date(new Date(data).getTime() - 60 * 60 * 1000)
  const agora = new Date()
  if (fecha <= agora) return null // já fechou
  const hora = fecha.toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  })
  const hoje = agora.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  const diaFecha = fecha.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  return diaFecha === hoje ? `⏰ Fecha às ${hora}` : `⏰ Fecha ${diaFecha} às ${hora}`
}

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo',
  })
}

function Countdown({ dataFechamento }) {
  const [texto, setTexto] = useState('')

  useEffect(() => {
    function atualizar() {
      const agora = new Date()
      const fecha = new Date(dataFechamento)
      const diff = fecha - agora
      if (diff <= 0) { setTexto('Apostas encerradas'); return }
      const horas = Math.floor(diff / 3600000)
      const min = Math.floor((diff % 3600000) / 60000)
      const seg = Math.floor((diff % 60000) / 1000)
      if (horas > 0) setTexto(`Fecha em ${horas}h ${min}m`)
      else if (min > 0) setTexto(`Fecha em ${min}m ${seg}s`)
      else setTexto(`Fecha em ${seg}s`)
    }
    atualizar()
    const interval = setInterval(atualizar, 1000)
    return () => clearInterval(interval)
  }, [dataFechamento])

  return <span style={{ fontSize: '12px', color: '#f5a623', fontWeight: 600 }}>⏱ {texto}</span>
}

function StatusPill({ status }) {
  const configs = {
    AGENDADA:   { label: 'Agendada',  bg: '#f1f0f0', color: '#666' },
    AO_VIVO:    { label: 'Ao vivo',   bg: '#eaf3de', color: '#3B6D11' },
    FINALIZADA: { label: 'Finalizada',bg: '#fcebeb', color: '#e8192c' },
  }
  const cfg = configs[status] || configs.AGENDADA

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {status === 'AO_VIVO' && (
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#00a651', display: 'inline-block',
          animation: 'pulseVerde 1.2s ease-in-out infinite',
        }} />
      )}
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.5px',
        padding: '3px 10px', borderRadius: 20,
        background: cfg.bg, color: cfg.color,
      }}>{cfg.label}</span>
    </div>
  )
}

function CardPartida({ partida, aposta, apostasAbertas, onClick }) {
  const aoVivo = partida.status === 'AO_VIVO'
  const finalizada = partida.status === 'FINALIZADA'
  const agendada = partida.status === 'AGENDADA'

  const acertouPlacar = aposta && finalizada &&
    aposta.placarCasa === partida.placarCasa &&
    aposta.placarFora === partida.placarFora

  const vencedorReal = partida.placarCasa > partida.placarFora ? 'casa'
    : partida.placarFora > partida.placarCasa ? 'fora' : 'empate'
  const vencedorAposta = aposta
    ? aposta.placarCasa > aposta.placarFora ? 'casa'
    : aposta.placarFora > aposta.placarCasa ? 'fora' : 'empate'
    : null
  const acertouVencedor = aposta && finalizada && !acertouPlacar &&
    vencedorReal === vencedorAposta

  const pontosAposta = acertouPlacar ? 3 : acertouVencedor ? 1 : 0

  // Define a cor da borda baseado no status
  const getBorderStyle = () => {
    if (finalizada) return '1.5px solid #e8192c' // Vermelho
    if (aoVivo) return '1.5px solid #00a651' // Verde
    if (agendada) return '1.5px solid #8b9bb4' // Cinza
    return '0.5px solid var(--color-border-tertiary)' // Default
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-background-primary)',
        border: getBorderStyle(),
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Header do card */}
      <div style={{
        padding: '10px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
      }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {formatarData(partida.data)} · {formatarHora(partida.data)}
        </span>
        <StatusPill status={partida.status} />
      </div>

      {/* Placar */}
      <div style={{
        padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        {/* Time casa */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
          {partida.selecaoCasa?.escudo_url ? (
            <img
              src={partida.selecaoCasa.escudo_url}
              alt={partida.selecaoCasa.nome}
              style={{ width: 52, height: 36, objectFit: 'contain', borderRadius: 4 }}
            />
          ) : (
            <div style={{
              width: 52, height: 36, borderRadius: 4,
              background: 'var(--color-background-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: 'var(--color-text-secondary)',
            }}>🏳</div>
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center' }}>
            {partida.selecaoCasa?.nome}
          </span>
        </div>

        {/* Placar central */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontSize: '2.5rem', fontWeight: 700, lineHeight: 1,
              color: finalizada || aoVivo ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            }}>
              {finalizada || aoVivo ? partida.placarCasa : '–'}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>×</span>
            <span style={{
              fontSize: '2.5rem', fontWeight: 700, lineHeight: 1,
              color: finalizada || aoVivo ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            }}>
              {finalizada || aoVivo ? partida.placarFora : '–'}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
            {aoVivo ? 'Em andamento' : finalizada ? 'Placar final' : 'Não iniciado'}
          </span>
        </div>

        {/* Time fora */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
          {partida.selecaoFora?.escudo_url ? (
            <img
              src={partida.selecaoFora.escudo_url}
              alt={partida.selecaoFora.nome}
              style={{ width: 52, height: 36, objectFit: 'contain', borderRadius: 4 }}
            />
          ) : (
            <div style={{
              width: 52, height: 36, borderRadius: 4,
              background: 'var(--color-background-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: 'var(--color-text-secondary)',
            }}>🏳</div>
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center' }}>
            {partida.selecaoFora?.nome}
          </span>
        </div>
      </div>

      {/* Footer aposta */}
      <div style={{
        padding: '10px 16px',
        borderTop: '0.5px solid var(--color-border-tertiary)',
      }}>
        {aposta ? (() => {
          const corAposta = finalizada
            ? acertouPlacar ? '#00a651' : acertouVencedor ? '#3b82f6' : '#e24b4a'
            : '#f5a623'

          const nomeVencedor = aposta.vencedor === 'casa' ? partida.selecaoCasa?.nome
            : aposta.vencedor === 'fora' ? partida.selecaoFora?.nome
            : aposta.vencedor === 'empate' ? 'Empate'
            : null

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Placar:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: corAposta }}>
                  {aposta.placarCasa} × {aposta.placarFora}
                  {finalizada && acertouPlacar && ' ✓ +3pts'}
                  {finalizada && acertouVencedor && ' ✓ +1pt'}
                  {finalizada && !acertouPlacar && !acertouVencedor && ' ✗'}
                </span>
              </div>
              {nomeVencedor && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Vencedor:</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: corAposta }}>
                    {nomeVencedor}
                  </span>
                </div>
              )}
            </div>
          )
        })() : apostasAbertas && partida.status === 'AGENDADA' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 12, color: '#f5a623' }}>⚠ Você ainda não apostou</span>
            {horarioFechamento(partida.data) && (
              <span style={{ fontSize: 11, color: '#8b9bb4' }}>{horarioFechamento(partida.data)}</span>
            )}
          </div>
        ) : partida.status === 'AGENDADA' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 12, color: '#8b9bb4' }}>🔒 Apostas encerradas</span>
            {horarioFechamento(partida.data) && (
              <span style={{ fontSize: 11, color: '#8b9bb4' }}>{horarioFechamento(partida.data)}</span>
            )}
          </div>
        ) : (
          <span style={{ fontSize: 12, color: '#8b9bb4' }}>Sem aposta registrada</span>
        )}
      </div>
    </div>
  )
}

function CardCampeao({ usuarioId }) {
  const [minha, setMinha]           = useState(undefined) // undefined=carregando, null=sem aposta
  const [todas, setTodas]           = useState([])
  const [selecoes, setSelecoes]     = useState([])
  const [selecionando, setSelecionando] = useState(false)
  const [escolha, setEscolha]       = useState(null)
  const [salvando, setSalvando]     = useState(false)
  const [verTodas, setVerTodas]     = useState(false)
  const [busca, setBusca]           = useState('')

  useEffect(() => {
    if (!usuarioId) return
    Promise.all([
      api.get(`/campeao/${usuarioId}`),
      api.get('/campeao/todas'),
      api.get('/partidas/selecoes'),
    ]).then(([rMinha, rTodas, rSel]) => {
      setMinha(rMinha.data)
      setTodas(rTodas.data)
      setSelecoes(rSel.data)
    }).catch(() => setMinha(null))
  }, [usuarioId])

  async function confirmar() {
    if (!escolha) return
    setSalvando(true)
    try {
      const r = await api.post('/campeao', { usuarioId, selecaoId: escolha.id })
      setMinha(r.data)
      setTodas((prev) => {
        const sem = prev.filter((a) => a.usuario.id !== usuarioId)
        return [...sem, { usuario: { id: usuarioId }, selecao: r.data.selecao }]
      })
      setSelecionando(false)
      setEscolha(null)
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setSalvando(false)
    }
  }

  const selecoesFiltradas = selecoes.filter((s) =>
    s.nome.toLowerCase().includes(busca.toLowerCase())
  )

  // Agrupa apostas por seleção para mostrar contagem
  const contagemPorSelecao = todas.reduce((acc, a) => {
    const id = a.selecao.id
    if (!acc[id]) acc[id] = { selecao: a.selecao, count: 0, nomes: [] }
    acc[id].count++
    acc[id].nomes.push(a.usuario.nome)
    return acc
  }, {})
  const rankCampeao = Object.values(contagemPorSelecao).sort((a, b) => b.count - a.count)

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a1a10, #001a3d)',
      border: '1px solid #00a651',
      borderRadius: 16, padding: '1.25rem',
      marginBottom: '1.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', letterSpacing: 2, color: '#f5d000' }}>
            🏆 PALPITE DO CAMPEÃO
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8b9bb4', marginTop: 2 }}>
            {todas.length > 0 ? `${todas.length} palpite${todas.length > 1 ? 's' : ''} registrado${todas.length > 1 ? 's' : ''}` : 'Seja o primeiro a apostar!'}
          </div>
        </div>
        {minha && !selecionando && (
          <button onClick={() => setSelecionando(true)} style={{
            background: 'none', border: '1px solid #1e2d45', borderRadius: 8,
            color: '#8b9bb4', padding: '0.3rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer',
          }}>Alterar</button>
        )}
      </div>

      {/* Minha aposta */}
      {minha === undefined ? (
        <div style={{ color: '#8b9bb4', fontSize: '0.85rem' }}>Carregando...</div>
      ) : minha && !selecionando ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {minha.selecao.escudo_url && (
            <img src={minha.selecao.escudo_url} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          )}
          <div>
            <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', color: '#f0f4ff', letterSpacing: 1 }}>
              {minha.selecao.nome}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#00a651' }}>✅ Seu palpite</div>
          </div>
        </div>
      ) : !selecionando ? (
        <button onClick={() => setSelecionando(true)} style={{
          width: '100%', background: '#00a651', color: '#fff', border: 'none',
          borderRadius: 10, padding: '0.75rem', fontFamily: 'var(--fonte-display)',
          fontSize: '0.95rem', letterSpacing: 1, cursor: 'pointer',
        }}>ESCOLHER CAMPEÃO</button>
      ) : null}

      {/* Seletor de times */}
      {selecionando && (
        <div>
          <input
            autoFocus
            placeholder="Filtrar seleção..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#0a0e1a', border: '1px solid #1e2d45',
              borderRadius: 8, padding: '0.5rem 0.75rem',
              color: '#f0f4ff', fontSize: '0.85rem', outline: 'none',
              marginBottom: '0.75rem',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', maxHeight: 260, overflowY: 'auto', marginBottom: '0.75rem' }}>
            {selecoesFiltradas.map((s) => (
              <button key={s.id} onClick={() => setEscolha(s)} style={{
                background: escolha?.id === s.id ? '#0a1a10' : '#0a0e1a',
                border: `2px solid ${escolha?.id === s.id ? '#00a651' : '#1e2d45'}`,
                borderRadius: 10, padding: '0.5rem 0.25rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                cursor: 'pointer',
              }}>
                {s.escudo_url
                  ? <img src={s.escudo_url} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  : <span style={{ fontSize: '1.2rem' }}>🏳</span>
                }
                <span style={{ fontSize: '0.6rem', color: '#f0f4ff', textAlign: 'center', lineHeight: 1.2 }}>
                  {s.nome.substring(0, 9)}
                </span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={confirmar} disabled={!escolha || salvando} style={{
              flex: 1, background: escolha ? '#00a651' : '#1e2d45', color: '#fff',
              border: 'none', borderRadius: 8, padding: '0.6rem',
              fontWeight: 700, fontSize: '0.9rem', cursor: escolha ? 'pointer' : 'not-allowed',
            }}>{salvando ? 'Salvando...' : 'CONFIRMAR'}</button>
            <button onClick={() => { setSelecionando(false); setEscolha(null); setBusca('') }} style={{
              background: 'none', border: '1px solid #1e2d45', borderRadius: 8,
              color: '#8b9bb4', padding: '0.6rem 1rem', cursor: 'pointer',
            }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Ver palpites de todos */}
      {!selecionando && rankCampeao.length > 0 && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid #1e2d45', paddingTop: '0.75rem' }}>
          <button onClick={() => setVerTodas(!verTodas)} style={{
            background: 'none', border: 'none', color: '#8b9bb4',
            fontSize: '0.78rem', cursor: 'pointer', padding: 0,
          }}>
            {verTodas ? '▲ Ocultar' : '▼ Ver palpites de todos'}
          </button>
          {verTodas && (
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {rankCampeao.map(({ selecao, count }) => (
                <div key={selecao.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {selecao.escudo_url && <img src={selecao.escudo_url} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />}
                  <span style={{ fontSize: '0.82rem', color: '#f0f4ff', flex: 1 }}>{selecao.nome}</span>
                  <span style={{
                    background: '#0a1a10', border: '1px solid #00a651',
                    borderRadius: 20, padding: '0.1rem 0.5rem',
                    fontSize: '0.72rem', color: '#00a651', fontWeight: 700,
                  }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MvpRow({ rodada, mvp, completa }) {
  const iniciais = mvp.usuario.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
  return (
    <div style={{
      background: '#0a0e1a',
      border: `1px solid ${completa ? '#f5d00044' : '#1e2d45'}`,
      borderRadius: 10, padding: '0.65rem 1rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
    }}>
      <span style={{ fontSize: '0.7rem', color: '#8b9bb4', fontWeight: 700, minWidth: 64 }}>
        RODADA {rodada}{!completa && ' ⏳'}
      </span>
      {mvp.usuario.foto_url ? (
        <img src={mvp.usuario.foto_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: '#1a1200', border: '2px solid #f5d000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 700, color: '#f5d000',
        }}>{iniciais}</div>
      )}
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f0f4ff', flex: 1 }}>
        {mvp.usuario.nome}
      </span>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.2rem', color: '#f5d000', lineHeight: 1 }}>
          {mvp.pontos}pts
        </div>
        {mvp.exatos > 0 && (
          <div style={{ fontSize: '0.65rem', color: '#8b9bb4', marginTop: 1 }}>
            {mvp.exatos} exato{mvp.exatos > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

function CardMvp({ usuarioId }) {
  const [ligas, setLigas] = useState([])

  useEffect(() => {
    if (!usuarioId) return
    api.get(`/mvp?usuarioId=${usuarioId}`).then((r) => setLigas(r.data)).catch(() => {})
  }, [usuarioId])

  if (ligas.length === 0) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1200, #0d1321)',
      border: '1px solid #f5d000',
      borderRadius: 16, padding: '1.25rem',
      marginBottom: '1.75rem',
    }}>
      <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', letterSpacing: 2, color: '#f5d000', marginBottom: '1rem' }}>
        🏅 MVP DAS RODADAS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {ligas.map(({ liga, rodadas }) => (
          <div key={liga.id}>
            {ligas.length > 1 && (
              <div style={{ fontSize: '0.7rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>
                {liga.nome}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {rodadas.map(({ rodada, mvp, completa }) => (
                <MvpRow key={rodada} rodada={rodada} mvp={mvp} completa={completa} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CardRegras() {
  const [aberto, setAberto] = useState(false)

  return (
    <div style={{
      background: '#111827',
      border: '1px solid #1e2d45',
      borderRadius: 12, marginBottom: '1.75rem', overflow: 'hidden',
    }}>
      <button
        onClick={() => setAberto(!aberto)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '1rem 1.25rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f0f4ff', letterSpacing: 1 }}>
          📋 REGRAS DO BOLÃO
        </span>
        <span style={{ color: '#8b9bb4', fontSize: '0.85rem' }}>{aberto ? '▲' : '▼'}</span>
      </button>

      {aberto && (
        <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Pontuação */}
          <div>
            <div style={{ fontSize: '0.72rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.6rem' }}>
              Pontuação
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { icone: '🎯', label: 'Placar exato', desc: 'Acertou o placar — ex: Brasil 2×1 México', pts: '+3 pts', cor: '#00a651' },
                { icone: '✅', label: 'Vencedor certo', desc: 'Acertou quem ganhou mas errou o placar', pts: '+1 pt', cor: '#3b82f6' },
                { icone: '❌', label: 'Errou', desc: 'Não acertou o resultado', pts: '0 pts', cor: '#e8192c' },
              ].map((r) => (
                <div key={r.label} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  background: '#0a0e1a', borderRadius: 8, padding: '0.6rem 0.85rem',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>{r.icone}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f0f4ff' }}>{r.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#8b9bb4' }}>{r.desc}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1rem', color: r.cor, fontWeight: 700 }}>{r.pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tipos de aposta */}
          <div>
            <div style={{ fontSize: '0.72rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.6rem' }}>
              Tipos de Aposta
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { icone: '🏆', label: 'Quem vence?', desc: 'Escolha o vencedor ou empate. Vale +1pt mesmo que o placar esteja errado' },
                { icone: '🎯', label: 'Placar exato', desc: 'Aposte no placar completo. Se acertar exatamente, leva +3pts' },
                { icone: '⚽', label: 'Goleadores', desc: 'Escolha quais jogadores vão marcar gol na partida' },
                { icone: '🏅', label: 'Palpite do campeão', desc: 'Uma aposta só — escolha a seleção campeã da Copa 2026' },
              ].map((t) => (
                <div key={t.label} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  background: '#0a0e1a', borderRadius: 8, padding: '0.6rem 0.85rem',
                }}>
                  <span style={{ fontSize: '1.1rem', marginTop: 1 }}>{t.icone}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{t.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#8b9bb4', marginTop: 2 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quando apostas fecham */}
          <div style={{
            background: '#0a1a10', border: '1px solid #00a65144',
            borderRadius: 8, padding: '0.75rem 1rem',
            display: 'flex', flexDirection: 'column', gap: '0.35rem',
          }}>
            <div style={{ fontSize: '0.82rem', color: '#f0f4ff', fontWeight: 600 }}>
              ⏰ Quando as apostas fecham?
            </div>
            <div style={{ fontSize: '0.78rem', color: '#8b9bb4', lineHeight: 1.5 }}>
              As apostas de cada jogo fecham <strong style={{ color: '#00a651' }}>1 hora antes do início</strong>. Cada partida tem seu próprio horário — você vê o tempo restante direto no card do jogo.
            </div>
            <div style={{ fontSize: '0.78rem', color: '#8b9bb4', lineHeight: 1.5 }}>
              Você recebe uma notificação <strong style={{ color: '#f5a623' }}>2 horas antes</strong> de cada jogo lembrando de apostar — se ainda não tiver apostado.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const { usuario } = useAuth()
  const [rodadaAtiva, setRodadaAtiva] = useState(1) // Rodada da Copa: 1, 2 ou 3
  const [apostas, setApostas] = useState({})
  const [loading, setLoading] = useState(true)
  const [mostrarHoje, setMostrarHoje] = useState(false)
  const [partidasHoje, setPartidasHoje] = useState([])
  const [todasPartidas, setTodasPartidas] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/partidas'),
      usuario ? api.get(`/apostas/usuario/${usuario.id}`) : Promise.resolve({ data: [] }),
    ]).then(([rPartidas, rApostas]) => {
      const partidasCopa = rPartidas.data.filter(p => p.rodada >= 1 && p.rodada <= 3)
      setTodasPartidas(partidasCopa)
      const mapa = {}
      rApostas.data.forEach(a => { mapa[a.partidaId] = a })
      setApostas(mapa)
    }).finally(() => setLoading(false))
  }, [usuario])

  // Busca partidas do dia quando ativar "Hoje"
  useEffect(() => {
    if (mostrarHoje) {
      api.get('/copa/partidas-do-dia').then((r) => {
        setPartidasHoje(r.data)
      }).catch(() => setPartidasHoje([]))
    }
  }, [mostrarHoje])

  useEffect(() => {
    if (!mostrarHoje) {
      api.get('/copa/partidas-do-dia').then((r) => {
        setPartidasHoje(r.data)
      }).catch(() => setPartidasHoje([]))
    }
  }, [mostrarHoje])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
      Carregando partidas...
    </div>
  )

  // Define quais partidas mostrar
  const partidas = mostrarHoje
    ? partidasHoje
    : todasPartidas.filter(p => p.rodada === rodadaAtiva)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <style>{`
        @keyframes pulseVerde {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>

      <CardCampeao usuarioId={usuario?.id} />
      <CardMvp usuarioId={usuario?.id} />
      <CardRegras />

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{
          fontSize: '2rem', fontWeight: 700,
          color: 'var(--color-text-primary)', margin: '0 0 4px',
          fontFamily: 'var(--fonte-display)',
          letterSpacing: '2px',
        }}>PARTIDAS</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
          Clique em uma partida para apostar
        </p>
      </div>

      {/* Filtro de rodadas + Hoje */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {/* Botão HOJE */}
        <button
          onClick={() => {
            setMostrarHoje(true)
          }}
          style={{
            background: mostrarHoje ? '#fbbf24' : 'var(--color-background-secondary)',
            color: mostrarHoje ? '#000' : 'var(--color-text-secondary)',
            border: mostrarHoje ? 'none' : '0.5px solid var(--color-border-tertiary)',
            borderRadius: 20, padding: '6px 16px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          📅 Jogos de Hoje
        </button>
        
        {/* Botões de Rodadas da Copa */}
        {[1, 2, 3].map((numRodada) => (
          <button
            key={numRodada}
            onClick={() => {
              setMostrarHoje(false)
              setRodadaAtiva(numRodada)
            }}
            style={{
              background: (rodadaAtiva === numRodada && !mostrarHoje) ? '#00a651' : 'var(--color-background-secondary)',
              color: (rodadaAtiva === numRodada && !mostrarHoje) ? '#fff' : 'var(--color-text-secondary)',
              border: (rodadaAtiva === numRodada && !mostrarHoje) ? 'none' : '0.5px solid var(--color-border-tertiary)',
              borderRadius: 20, padding: '6px 16px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Rodada {numRodada}
          </button>
        ))}
      </div>

      {/* Info da rodada ou Jogos de Hoje */}
      {mostrarHoje ? (
        <div style={{
          background: 'var(--color-background-secondary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 8, padding: '10px 14px',
          marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            📅 {new Date().toLocaleDateString('pt-BR', {
              timeZone: 'America/Sao_Paulo', day: '2-digit', month: 'short', year: 'numeric',
            })}
          </span>
          <span style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 600 }}>
            {partidas.length} {partidas.length === 1 ? 'jogo' : 'jogos'} hoje
          </span>
        </div>
      ) : (
        <div style={{
          background: 'var(--color-background-secondary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 8, padding: '10px 14px',
          marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 600 }}>
            ⚽ Rodada {rodadaAtiva}
          </span>
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            • {partidas.length} {partidas.length === 1 ? 'jogo' : 'jogos'}
          </span>
        </div>
      )}

      {/* Lista de partidas - AGRUPADAS POR DIA */}
      {partidas.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '3rem' }}>
          Nenhuma partida nessa rodada.
        </div>
      ) : (() => {
        // Agrupar partidas por dia
        const partidasPorDia = partidas.reduce((acc, partida) => {
          const data = new Date(partida.data)
          const diaKey = data.toLocaleDateString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          if (!acc[diaKey]) acc[diaKey] = []
          acc[diaKey].push(partida)
          return acc
        }, {})
        
        return Object.entries(partidasPorDia).map(([dia, partidasDoDia]) => (
          <div key={dia} style={{ marginBottom: '2rem' }}>
            {/* Header do dia */}
            <div style={{
              background: 'linear-gradient(135deg, #00a651 0%, #00853f 100%)',
              padding: '0.75rem 1rem',
              borderRadius: 8,
              marginBottom: '0.75rem',
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                📅 {dia}
              </span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginLeft: '0.75rem' }}>
                {partidasDoDia.length} {partidasDoDia.length === 1 ? 'jogo' : 'jogos'}
              </span>
            </div>
            
            {/* Partidas do dia */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {partidasDoDia.map((p) => (
                <CardPartida
                  key={p.id}
                  partida={p}
                  aposta={apostas[p.id]}
                  apostasAbertas={true}
                  onClick={() => navigate(`/partida/${p.id}`)}
                />
              ))}
            </div>
          </div>
        ))
      })()}
    </div>
  )
}
