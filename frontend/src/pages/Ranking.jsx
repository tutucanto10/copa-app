import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import ModalPerfilPublico from '../components/ModalPerfilPublico'

const MEDALHAS = ['🥇', '🥈', '🥉']

function Avatar({ user, size = 44 }) {
  const [fotoUrl, setFotoUrl] = useState(null)

  useEffect(() => {
    api.get(`/perfil/${user.id}/foto`)
      .then((r) => { if (r.data.foto_url) setFotoUrl(r.data.foto_url) })
      .catch(() => {})
  }, [user.id])

  const iniciais = (user.nome || '?').split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

  if (fotoUrl) {
    return (
      <img src={fotoUrl} alt={user.nome} style={{
        width: size, height: size, borderRadius: '50%',
        objectFit: 'cover', border: '2px solid #1e2d45', flexShrink: 0,
      }} />
    )
  }
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
  const navigate = useNavigate()
  const [ligas, setLigas] = useState([])
  const [buscaAberta, setBuscaAberta] = useState(false)
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const buscaRef = useRef(null)
  const debounceRef = useRef(null)
  const [ligaAtiva, setLigaAtiva] = useState(null)
  const [rankingBolao, setRankingBolao] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [perfilAberto, setPerfilAberto] = useState(null)

  useEffect(() => {
    if (!usuario) return
    setLoading(true)
    const req = usuario.isAdmin
      ? api.get('/ligas').then((r) => r.data)
      : api.get('/ligas/usuarios').then((u) => {
          const eu = u.data.find((usr) => usr.id === usuario.id)
          return eu?.ligas?.map((ml) => ml.liga) || []
        })
    req.then((ligas) => {
      setLigas(ligas)
      if (ligas.length > 0) setLigaAtiva(ligas[0].id)
    }).catch(() => setErro('Não foi possível carregar o ranking. Tente novamente.'))
      .finally(() => setLoading(false))
  }, [usuario])

  useEffect(() => {
    if (!ligaAtiva) return
    setLoading(true)
    setErro(null)
    setRankingBolao([])
    api.get(`/ligas/${ligaAtiva}/ranking`)
      .then((r) => setRankingBolao(r.data.ranking))
      .catch(() => setErro('Erro ao carregar ranking. Tente novamente.'))
      .finally(() => setLoading(false))
  }, [ligaAtiva])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (query.length < 2) { setResultados([]); return }
    setBuscando(true)
    debounceRef.current = setTimeout(() => {
      api.get(`/perfil/buscar?q=${encodeURIComponent(query)}`)
        .then((r) => setResultados(r.data.filter((u) => u.id !== usuario?.id)))
        .catch(() => setResultados([]))
        .finally(() => setBuscando(false))
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    function handleClick(e) {
      if (buscaRef.current && !buscaRef.current.contains(e.target)) {
        setBuscaAberta(false)
        setQuery('')
        setResultados([])
      }
    }
    if (buscaAberta) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [buscaAberta])

  function CardRanking({ user, index }) {
    return (
      <div
        onClick={() => setPerfilAberto(user.id)}
        style={{
          background: index === 0 ? '#1a1500' : '#111827',
          border: `1px solid ${index === 0 ? '#f5d000' : index === 1 ? '#9ca3af' : index === 2 ? '#92400e' : '#1e2d45'}`,
          borderRadius: 12, padding: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.65rem',
          cursor: 'pointer', transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <div style={{
          fontFamily: 'var(--fonte-display)',
          fontSize: index < 3 ? '1.8rem' : '1.2rem',
          minWidth: 40, textAlign: 'center',
          color: index === 0 ? '#f5d000' : index === 1 ? '#9ca3af' : index === 2 ? '#cd7c2f' : '#8b9bb4',
        }}>
          {index < 3 ? MEDALHAS[index] : `${index + 1}º`}
        </div>
        <Avatar user={user} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 700, fontSize: '1rem', color: '#f0f4ff', marginBottom: 4,
            wordBreak: 'break-word',
          }}>
            {user.nome}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: user.placaresExatos > 0 ? '#00a651' : '#8b9bb4' }}>
              🎯 {user.placaresExatos} exato{user.placaresExatos !== 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: '0.75rem', color: user.vencedoresAcertados > 0 ? '#3b82f6' : '#8b9bb4' }}>
              🏆 {user.vencedoresAcertados} vencedor{user.vencedoresAcertados !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--fonte-display)', fontSize: '1.8rem',
              color: index === 0 ? '#f5d000' : '#f0f4ff', lineHeight: 1,
            }}>{user.pontos}</div>
            <div style={{ fontSize: '0.65rem', color: '#8b9bb4', letterSpacing: 1, marginTop: 2 }}>PONTOS</div>
          </div>
          {user.id !== usuario?.id && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/comparativo/${usuario.id}/${user.id}`) }}
              title="Comparar comigo"
              style={{
                background: '#0a0e1a', border: '1px solid #1e2d45',
                borderRadius: 8, color: '#8b9bb4', padding: '0.3rem 0.6rem',
                fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >⚖️ vs mim</button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{
          fontFamily: 'var(--fonte-display)', fontSize: '2.5rem',
          letterSpacing: '3px', margin: 0, color: '#f0f4ff',
        }}>RANKING</h1>

        {/* Busca por usuário */}
        <div ref={buscaRef} style={{ position: 'relative' }}>
          {!buscaAberta ? (
            <button
              onClick={() => setBuscaAberta(true)}
              title="Buscar jogador para comparar"
              style={{
                background: '#111827', border: '1px solid #1e2d45',
                borderRadius: 10, width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '1.1rem', color: '#8b9bb4',
              }}
            >🔍</button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar jogador..."
                  style={{
                    background: '#111827', border: '1px solid #00a651',
                    borderRadius: 10, padding: '0.5rem 0.75rem',
                    color: '#f0f4ff', fontSize: '0.9rem', outline: 'none',
                    width: 200,
                  }}
                />
                {/* Dropdown resultados */}
                {(resultados.length > 0 || buscando) && (
                  <div style={{
                    position: 'absolute', top: '110%', left: 0, right: 0,
                    background: '#111827', border: '1px solid #1e2d45',
                    borderRadius: 10, zIndex: 50, overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}>
                    {buscando ? (
                      <div style={{ padding: '0.75rem 1rem', color: '#8b9bb4', fontSize: '0.85rem' }}>Buscando...</div>
                    ) : resultados.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          navigate(`/comparativo/${usuario.id}/${u.id}`)
                          setBuscaAberta(false)
                          setQuery('')
                          setResultados([])
                        }}
                        style={{
                          width: '100%', background: 'none',
                          border: 'none', borderBottom: '1px solid #1e2d45',
                          padding: '0.75rem 1rem', textAlign: 'left',
                          color: '#f0f4ff', fontSize: '0.9rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#0a1a10'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <span style={{ fontSize: '0.75rem', color: '#00a651' }}>⚖️</span>
                        {u.nome}
                      </button>
                    ))}
                    {!buscando && resultados.length === 0 && query.length >= 2 && (
                      <div style={{ padding: '0.75rem 1rem', color: '#8b9bb4', fontSize: '0.85rem' }}>Nenhum jogador encontrado</div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => { setBuscaAberta(false); setQuery(''); setResultados([]) }}
                style={{ background: 'none', border: 'none', color: '#8b9bb4', fontSize: '1.1rem', cursor: 'pointer' }}
              >✕</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 12 }}>
        <div style={{ padding: '1.5rem' }}>
          {ligas.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#8b9bb4', padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
              Você ainda não foi adicionado a nenhuma liga. Fale com o admin!
            </div>
          ) : (
            <>
              {ligas.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  {ligas.map((l) => (
                    <button key={l.id} onClick={() => setLigaAtiva(l.id)} style={{
                      background: ligaAtiva === l.id ? '#00a651' : '#0a0e1a',
                      border: `1px solid ${ligaAtiva === l.id ? '#00a651' : '#1e2d45'}`,
                      borderRadius: 8, color: ligaAtiva === l.id ? '#fff' : '#8b9bb4',
                      padding: '0.4rem 1rem', fontWeight: 700,
                      fontSize: '0.85rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      {l.logo_url && (
                        <img src={l.logo_url} alt="" style={{ height: 18, objectFit: 'contain', display: 'block' }} />
                      )}
                      {l.nome}
                    </button>
                  ))}
                </div>
              )}

              <div style={{
                background: '#0a0e1a', border: '1px solid #1e2d45',
                borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem',
                display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>🎯 Placar exato <strong style={{ color: '#f5d000' }}>+3pts</strong></span>
                <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>🏆 Vencedor certo <strong style={{ color: '#f5d000' }}>+1pt</strong></span>
                <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>Clique em alguém para ver o perfil</span>
              </div>

              {erro ? (
                <div style={{ textAlign: 'center', color: '#e8192c', padding: '2rem' }}>{erro}</div>
              ) : loading ? (
                <div style={{ textAlign: 'center', color: '#8b9bb4', padding: '2rem' }}>Carregando...</div>
              ) : rankingBolao.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#8b9bb4', padding: '2rem' }}>
                  Nenhuma aposta registrada ainda.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {rankingBolao.map((user, index) => (
                    <CardRanking key={user.id} user={user} index={index} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {perfilAberto && (
        <ModalPerfilPublico
          usuarioId={perfilAberto}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </div>
  )
}
