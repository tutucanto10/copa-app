import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

function formatarHora(data) {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  })
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
          <span style={{ fontSize: 12, color: '#f5a623' }}>⚠ Você ainda não apostou</span>
        ) : partida.status === 'AGENDADA' ? (
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>🔒 Apostas encerradas</span>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Sem aposta registrada</span>
        )}
      </div>
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
