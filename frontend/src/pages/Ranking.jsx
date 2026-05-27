import { useEffect, useState } from 'react'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import ModalPerfilPublico from '../components/ModalPerfilPublico'

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
  const [ligas, setLigas] = useState([])
  const [ligaAtiva, setLigaAtiva] = useState(null)
  const [rankingBolao, setRankingBolao] = useState([])
  const [loading, setLoading] = useState(true)
  const [perfilAberto, setPerfilAberto] = useState(null)

  useEffect(() => {
    if (!usuario) return
    api.get('/ligas').then((r) => {
      const todas = r.data
      if (usuario.isAdmin) {
        setLigas(todas)
        if (todas.length > 0) setLigaAtiva(todas[0].id)
      } else {
        api.get('/ligas/usuarios').then((u) => {
          const eu = u.data.find((usr) => usr.id === usuario.id)
          const minhasLigas = eu?.ligas?.map((ml) => ml.liga) || []
          setLigas(minhasLigas)
          if (minhasLigas.length > 0) setLigaAtiva(minhasLigas[0].id)
        })
      }
    }).finally(() => setLoading(false))
  }, [usuario])

  useEffect(() => {
    if (!ligaAtiva) return
    setLoading(true)
    api.get(`/ligas/${ligaAtiva}/ranking`)
      .then((r) => setRankingBolao(r.data.ranking))
      .finally(() => setLoading(false))
  }, [ligaAtiva])

  function CardRanking({ user, index }) {
    return (
      <div
        onClick={() => setPerfilAberto(user.id)}
        style={{
          background: index === 0 ? '#1a1500' : '#111827',
          border: `1px solid ${index === 0 ? '#f5d000' : index === 1 ? '#9ca3af' : index === 2 ? '#92400e' : '#1e2d45'}`,
          borderRadius: 12, padding: '1.25rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
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
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f0f4ff', marginBottom: 4 }}>
            {user.nome}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: user.placaresExatos > 0 ? '#00a651' : '#8b9bb4' }}>
              🎯 {user.placaresExatos} exato{user.placaresExatos !== 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: '0.75rem', color: user.vencedoresAcertados > 0 ? '#3b82f6' : '#8b9bb4' }}>
              🏆 {user.vencedoresAcertados} vencedor{user.vencedoresAcertados !== 1 ? 'es' : ''}
            </span>
          </div>
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
                      padding: '0.5rem 1.25rem', fontWeight: 700,
                      fontSize: '0.85rem', cursor: 'pointer',
                    }}>{l.nome}</button>
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

              {loading ? (
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
