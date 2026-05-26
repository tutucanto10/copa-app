import { useEffect, useState } from 'react'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

const MEDALHAS = ['🥇', '🥈', '🥉']

function Avatar({ user, size = 44 }) {
  if (user.foto_url) {
    return (
      <img src={user.foto_url} alt={user.nome} style={{
        width: size, height: size, borderRadius: '50%',
        objectFit: 'cover', border: '2px solid #1e2d45', flexShrink: 0,
      }} />
    )
  }
  const iniciais = (user.nome || '?').split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#0a1a10', border: '2px solid #00a651',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.35, color: '#00a651', flexShrink: 0,
    }}>{iniciais}</div>
  )
}

export default function Ranking() {
  const { usuario } = useAuth()
  const [abaAtiva, setAbaAtiva] = useState('bolao')

  // Bolão
  const [ligas, setLigas] = useState([])
  const [ligaAtiva, setLigaAtiva] = useState(null)
  const [rankingBolao, setRankingBolao] = useState([])
  const [nomeLiga, setNomeLiga] = useState('')
  const [loadingBolao, setLoadingBolao] = useState(true)

  // Fantasy
  const [rankingFantasy, setRankingFantasy] = useState([])
  const [rodadas, setRodadas] = useState([])
  const [rodadaAtiva, setRodadaAtiva] = useState(null)
  const [loadingFantasy, setLoadingFantasy] = useState(false)

  // Carrega ligas do bolão
  useEffect(() => {
    if (!usuario) return
    api.get('/ligas').then((r) => {
      const todas = r.data
      if (usuario.isAdmin) {
        setLigas(todas)
        if (todas.length > 0) {
          setLigaAtiva(todas[0].id)
          setNomeLiga(todas[0].nome)
        }
      } else {
        api.get('/ligas/usuarios').then((u) => {
          const eu = u.data.find((usr) => usr.id === usuario.id)
          const minhasLigas = eu?.ligas?.map((ml) => ml.liga) || []
          setLigas(minhasLigas)
          if (minhasLigas.length > 0) {
            setLigaAtiva(minhasLigas[0].id)
            setNomeLiga(minhasLigas[0].nome)
          }
        })
      }
    }).finally(() => setLoadingBolao(false))
  }, [usuario])

  // Carrega ranking do bolão
  useEffect(() => {
    if (!ligaAtiva) return
    setLoadingBolao(true)
    api.get(`/ligas/${ligaAtiva}/ranking`)
      .then((r) => {
        setRankingBolao(r.data.ranking)
        setNomeLiga(r.data.liga.nome)
      })
      .finally(() => setLoadingBolao(false))
  }, [ligaAtiva])

  // Carrega rodadas e ranking fantasy
  useEffect(() => {
    if (abaAtiva !== 'fantasy') return
    setLoadingFantasy(true)
    api.get('/fantasy/rodadas').then((r) => {
      setRodadas(r.data)
      if (r.data.length > 0) setRodadaAtiva(r.data[0].id)
    }).finally(() => setLoadingFantasy(false))
  }, [abaAtiva])

  useEffect(() => {
    if (!rodadaAtiva) return
    setLoadingFantasy(true)
    api.get('/fantasy/ranking').then((r) => {
      // Filtra pela rodada ativa
      const filtrado = r.data.filter((t) => t.rodada === rodadas.find((rd) => rd.id === rodadaAtiva)?.numero)
      setRankingFantasy(filtrado)
    }).finally(() => setLoadingFantasy(false))
  }, [rodadaAtiva])

  const abaStyle = (a) => ({
    background: 'none', border: 'none',
    borderBottom: abaAtiva === a ? '2px solid #00a651' : '2px solid transparent',
    color: abaAtiva === a ? '#f0f4ff' : '#8b9bb4',
    fontFamily: 'var(--fonte-display)', fontSize: '1.1rem',
    letterSpacing: '2px', padding: '0.75rem 1.5rem', cursor: 'pointer',
  })

  function CardRanking({ user, index, extra }) {
    return (
      <div style={{
        background: index === 0 ? '#1a1500' : '#111827',
        border: `1px solid ${index === 0 ? '#f5d000' : index === 1 ? '#9ca3af' : index === 2 ? '#92400e' : '#1e2d45'}`,
        borderRadius: 12, padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{
          fontFamily: 'var(--fonte-display)',
          fontSize: index < 3 ? '1.8rem' : '1.2rem',
          minWidth: 40, textAlign: 'center',
          color: index === 0 ? '#f5d000' : index === 1 ? '#9ca3af' : index === 2 ? '#cd7c2f' : '#8b9bb4',
        }}>
          {index < 3 ? MEDALHAS[index] : `${index + 1}º`}
        </div>
        <Avatar user={user} size={44} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f0f4ff', marginBottom: 4 }}>
            {user.nome}
          </div>
          {extra}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--fonte-display)', fontSize: '2.2rem',
            color: index === 0 ? '#f5d000' : '#f0f4ff', lineHeight: 1,
          }}>{user.pontos}</div>
          <div style={{ fontSize: '0.65rem', color: '#8b9bb4', letterSpacing: 1, marginTop: 2 }}>PONTOS</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{
        fontFamily: 'var(--fonte-display)', fontSize: '2.5rem',
        letterSpacing: '3px', marginBottom: '1.5rem', color: '#f0f4ff',
      }}>RANKING</h1>

      {/* Abas principais */}
      <div style={{
        background: '#111827', border: '1px solid #1e2d45',
        borderRadius: 12, overflow: 'hidden', marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #1e2d45', padding: '0 1rem' }}>
          <button style={abaStyle('bolao')} onClick={() => setAbaAtiva('bolao')}>🎯 BOLÃO</button>
          <button style={abaStyle('fantasy')} onClick={() => setAbaAtiva('fantasy')}>⚽ FANTASY</button>
        </div>

        {/* ABA BOLÃO */}
        {abaAtiva === 'bolao' && (
          <div style={{ padding: '1.5rem' }}>
            {ligas.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#8b9bb4', padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                Você ainda não foi adicionado a nenhuma liga. Fale com o admin!
              </div>
            ) : (
              <>
                {/* Seletor de liga */}
                {ligas.length > 1 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    {ligas.map((l) => (
                      <button key={l.id} onClick={() => setLigaAtiva(l.id)} style={{
                        background: ligaAtiva === l.id ? '#00a651' : '#0a0e1a',
                        border: `1px solid ${ligaAtiva === l.id ? '#00a651' : '#1e2d45'}`,
                        borderRadius: 8, color: ligaAtiva === l.id ? '#fff' : '#8b9bb4',
                        padding: '0.5rem 1.25rem', fontWeight: 700,
                        fontSize: '0.85rem', cursor: 'pointer',
                      }}>{l.nome}</button>
                    ))}
                  </div>
                )}

                {/* Legenda */}
                <div style={{
                  background: '#0a0e1a', border: '1px solid #1e2d45',
                  borderRadius: 8, padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>🎯 Placar exato <strong style={{ color: '#f5d000' }}>+3pts</strong></span>
                  <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>🏆 Vencedor certo <strong style={{ color: '#f5d000' }}>+1pt</strong></span>
                  <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>⚽ Goleador certo <strong style={{ color: '#8b9bb4' }}>—</strong></span>
                </div>

                {loadingBolao ? (
                  <div style={{ textAlign: 'center', color: '#8b9bb4', padding: '2rem' }}>Carregando...</div>
                ) : rankingBolao.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#8b9bb4', padding: '2rem' }}>
                    Nenhuma aposta registrada ainda.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {rankingBolao.map((user, index) => (
                      <CardRanking key={user.id} user={user} index={index} extra={
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: user.placaresExatos > 0 ? '#00a651' : '#8b9bb4' }}>
                            🎯 {user.placaresExatos} exato{user.placaresExatos !== 1 ? 's' : ''}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: user.vencedoresAcertados > 0 ? '#3b82f6' : '#8b9bb4' }}>
                            🏆 {user.vencedoresAcertados} vencedor{user.vencedoresAcertados !== 1 ? 'es' : ''}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: user.goleadoresAcertados > 0 ? '#f5d000' : '#8b9bb4' }}>
                            ⚽ {user.goleadoresAcertados} goleador{user.goleadoresAcertados !== 1 ? 'es' : ''}
                          </span>
                        </div>
                      } />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ABA FANTASY */}
        {abaAtiva === 'fantasy' && (
          <div style={{ padding: '1.5rem' }}>
            {/* Seletor de rodada */}
            {rodadas.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {rodadas.map((r) => (
                  <button key={r.id} onClick={() => setRodadaAtiva(r.id)} style={{
                    background: rodadaAtiva === r.id ? '#00a651' : '#0a0e1a',
                    border: `1px solid ${rodadaAtiva === r.id ? '#00a651' : '#1e2d45'}`,
                    borderRadius: 8, color: rodadaAtiva === r.id ? '#fff' : '#8b9bb4',
                    padding: '0.5rem 1.25rem', fontWeight: 700,
                    fontSize: '0.85rem', cursor: 'pointer',
                  }}>Rodada {r.numero}</button>
                ))}
              </div>
            )}

            {/* Legenda */}
            <div style={{
              background: '#0a0e1a', border: '1px solid #1e2d45',
              borderRadius: 8, padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>⚽ Gol <strong style={{ color: '#f5d000' }}>+8pts</strong></span>
              <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>🎯 Assistência <strong style={{ color: '#f5d000' }}>+5pts</strong></span>
              <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>🟨 Amarelo <strong style={{ color: '#e8192c' }}>-1pt</strong></span>
              <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>🟥 Vermelho <strong style={{ color: '#e8192c' }}>-3pts</strong></span>
              <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>© Capitão <strong style={{ color: '#f5d000' }}>x2</strong></span>
            </div>

            {loadingFantasy ? (
              <div style={{ textAlign: 'center', color: '#8b9bb4', padding: '2rem' }}>Carregando...</div>
            ) : rankingFantasy.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#8b9bb4', padding: '2rem' }}>
                Nenhum time escalado ainda nessa rodada.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {rankingFantasy.map((time, index) => (
                  <CardRanking key={time.id} user={{ ...time.usuario, pontos: time.pontos }} index={index} extra={
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: '#8b9bb4' }}>
                        🛡️ {time.formacao}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#f5d000' }}>
                        💰 {time.patrimonio?.toFixed(1)}cr
                      </span>
                    </div>
                  } />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}