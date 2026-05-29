import { useEffect, useState } from 'react'
import api from '../api/api'

const RESULTADO_CONFIG = {
  placar_exato: { cor: '#00a651', icone: '🎯', label: 'Placar exato', pts: '+3pts' },
  vencedor_certo: { cor: '#3b82f6', icone: '🏆', label: 'Vencedor certo', pts: '+1pt' },
  errou: { cor: '#e8192c', icone: '❌', label: 'Errou', pts: '0pts' },
  pendente: { cor: '#8b9bb4', icone: '⏳', label: 'Aguardando', pts: '' },
}

export default function ModalPerfilPublico({ usuarioId, onClose }) {
  const [perfil, setPerfil] = useState(null)
  const [apostas, setApostas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroRodada, setFiltroRodada] = useState('todas')

  useEffect(() => {
    Promise.all([
      api.get(`/perfil/${usuarioId}`),
      api.get(`/perfil/${usuarioId}/apostas`),
    ]).then(([rPerfil, rApostas]) => {
      setPerfil(rPerfil.data)
      setApostas(rApostas.data)
    }).finally(() => setLoading(false))
  }, [usuarioId])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const iniciais = perfil?.nome?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '?'

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div style={{
        background: '#111827', border: '1px solid #1e2d45',
        borderRadius: 16, width: '100%', maxWidth: 500,
        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0a1a10, #001a3d)',
          borderRadius: '16px 16px 0 0', padding: '2rem', textAlign: 'center',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            background: 'none', border: 'none', color: '#8b9bb4',
            fontSize: '1.2rem', cursor: 'pointer',
          }}>✕</button>

          {perfil?.foto_url ? (
            <img src={perfil.foto_url} alt={perfil.nome} style={{
              width: 80, height: 80, borderRadius: '50%',
              objectFit: 'cover', border: '3px solid #00a651',
              boxShadow: '0 0 20px #00a65155',
            }} />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#0a1a10', border: '3px solid #00a651',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 700, color: '#00a651',
              margin: '0 auto', boxShadow: '0 0 20px #00a65155',
            }}>{iniciais}</div>
          )}

          <div style={{
            fontFamily: 'var(--fonte-display)', fontSize: '1.8rem',
            letterSpacing: '2px', color: '#f0f4ff', marginTop: '0.75rem',
          }}>
            {loading ? '...' : perfil?.nome}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8b9bb4' }}>Carregando...</div>
        ) : (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: 'PONTOS', valor: perfil.pontos, cor: '#00a651' },
                { label: 'EXATOS', valor: perfil.placaresExatos, cor: '#f5d000' },
                { label: 'VENCEDORES', valor: perfil.vencedoresAcertados, cor: '#3b82f6' },
              ].map((s) => (
                <div key={s.label} style={{
                  flex: 1, minWidth: 80, background: '#0a0e1a',
                  border: '1px solid #1e2d45', borderRadius: 10,
                  padding: '0.75rem', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.8rem', color: s.cor }}>{s.valor}</div>
                  <div style={{ fontSize: '0.6rem', color: '#8b9bb4', letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Conquistas / Badges */}
            {(perfil.badges?.length > 0 || perfil.palpiteCampeao) && (
              <div>
                <div style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 700 }}>
                  🏅 Conquistas
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {perfil.palpiteCampeao && (
                    <div title="Palpite do Campeão" style={{
                      background: 'linear-gradient(135deg, #1a1200, #0d1321)',
                      border: '1px solid #f5d000',
                      borderRadius: 20, padding: '0.4rem 0.85rem',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      {perfil.palpiteCampeao.escudo_url && (
                        <img src={perfil.palpiteCampeao.escudo_url} alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                      )}
                      <span style={{ fontSize: '0.75rem', color: '#f5d000', fontWeight: 600 }}>
                        {perfil.palpiteCampeao.nome}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#8b9bb4' }}>🏆</span>
                    </div>
                  )}
                  {perfil.badges.map((b) => (
                    <div key={b.id} title={b.desc} style={{
                      background: '#0a0e1a', border: '1px solid #1e2d45',
                      borderRadius: 20, padding: '0.4rem 0.85rem',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      cursor: 'default',
                    }}>
                      <span style={{ fontSize: '1rem' }}>{b.emoji}</span>
                      <span style={{ fontSize: '0.75rem', color: '#f0f4ff', fontWeight: 600 }}>{b.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Histórico de apostas */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 700 }}>
                📋 Histórico de Apostas
              </div>

              {/* Filtros de rodada */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {['todas', 1, 2, 3].map((r) => (
                  <button key={r} onClick={() => setFiltroRodada(r)} style={{
                    background: filtroRodada === r ? '#00a651' : '#0a0e1a',
                    color: filtroRodada === r ? '#fff' : '#8b9bb4',
                    border: `1px solid ${filtroRodada === r ? '#00a651' : '#1e2d45'}`,
                    borderRadius: 20, padding: '0.3rem 0.85rem',
                    fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                  }}>
                    {r === 'todas' ? 'Todos' : `Rodada ${r}`}
                  </button>
                ))}
              </div>

              {(() => {
                const lista = filtroRodada === 'todas'
                  ? apostas
                  : apostas.filter((a) => a.partida.rodada === filtroRodada)
                return lista.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#8b9bb4', padding: '1.5rem' }}>
                  {filtroRodada === 'todas' ? 'Nenhuma aposta ainda.' : `Nenhuma aposta na rodada ${filtroRodada}.`}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {lista.map((a) => {
                    const cfg = RESULTADO_CONFIG[a.resultado]
                    return (
                      <div key={a.id} style={{
                        background: '#0a0e1a',
                        border: `1px solid ${a.resultado === 'pendente' ? '#1e2d45' : cfg.cor + '55'}`,
                        borderRadius: 10, padding: '0.75rem 1rem',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                      }}>
                        {/* Escudos */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, minWidth: 0 }}>
                          {a.partida.selecaoCasa.escudo_url && (
                            <img src={a.partida.selecaoCasa.escudo_url} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                          )}
                          <span style={{ fontSize: '0.75rem', color: '#f0f4ff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {a.partida.selecaoCasa.nome.split(' ')[0]}
                          </span>
                          <span style={{ color: '#8b9bb4', fontSize: '0.7rem' }}>vs</span>
                          <span style={{ fontSize: '0.75rem', color: '#f0f4ff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {a.partida.selecaoFora.nome.split(' ')[0]}
                          </span>
                          {a.partida.selecaoFora.escudo_url && (
                            <img src={a.partida.selecaoFora.escudo_url} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                          )}
                        </div>

                        {/* Aposta do usuário */}
                        <div style={{ textAlign: 'center', minWidth: 50 }}>
                          <div style={{ fontSize: '0.8rem', color: '#8b9bb4', marginBottom: 2 }}>Apostei</div>
                          <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', color: '#f0f4ff' }}>
                            {a.placarCasa} × {a.placarFora}
                          </div>
                        </div>

                        {/* Resultado real */}
                        {a.partida.status === 'FINALIZADA' && (
                          <div style={{ textAlign: 'center', minWidth: 50 }}>
                            <div style={{ fontSize: '0.8rem', color: '#8b9bb4', marginBottom: 2 }}>Real</div>
                            <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', color: '#f0f4ff' }}>
                              {a.partida.placarCasa} × {a.partida.placarFora}
                            </div>
                          </div>
                        )}

                        {/* Resultado */}
                        <div style={{ textAlign: 'center', minWidth: 32 }}>
                          <div style={{ fontSize: '1.2rem' }}>{cfg.icone}</div>
                          {cfg.pts && <div style={{ fontSize: '0.6rem', color: cfg.cor, fontWeight: 700 }}>{cfg.pts}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
