import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

function Avatar({ fotoUrl, nome, size = 56 }) {
  const iniciais = (nome || '?').split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
  if (fotoUrl) {
    return (
      <img src={fotoUrl} alt={nome} style={{
        width: size, height: size, borderRadius: '50%',
        objectFit: 'cover', border: '3px solid #1e2d45', flexShrink: 0,
      }} />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#0a1a10', border: '3px solid #00a651',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.32, color: '#00a651', flexShrink: 0,
    }}>{iniciais}</div>
  )
}

function InfoModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)', padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111827', border: '1px solid #1e2d45',
          borderRadius: 16, padding: '1.5rem', maxWidth: 340, width: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', letterSpacing: 2, color: '#f0f4ff' }}>
            COMO LER O DUELO
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b9bb4', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {[
            { cor: '#022c1a', borda: '#00a651', label: 'Verde', desc: 'Ganhou o duelo nessa partida (mais pontos que o rival)' },
            { cor: '#1f0a0a', borda: '#e8192c', label: 'Vermelho', desc: 'Perdeu o duelo nessa partida' },
            { cor: '#0d1321', borda: '#1e2d45', label: 'Cinza', desc: 'Empate no duelo (mesmos pontos)' },
          ].map(({ cor, borda, label, desc }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: cor, border: `2px solid ${borda}`, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f0f4ff' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: '#8b9bb4' }}>{desc}</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #1e2d45', paddingTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { icon: '✅ +3', desc: 'Placar exato acertado' },
              { icon: '✅ +1', desc: 'Vencedor certo acertado' },
              { icon: '❌', desc: 'Errou a aposta' },
              { icon: '—', desc: 'Não apostou nessa partida' },
              { icon: '⏳', desc: 'Jogo ainda não finalizado' },
            ].map(({ icon, desc }) => (
              <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ minWidth: 52, fontSize: '0.85rem', color: '#f0f4ff', fontWeight: 700 }}>{icon}</span>
                <span style={{ fontSize: '0.75rem', color: '#8b9bb4' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function renderAposta(aposta, status) {
  if (status !== 'FINALIZADA') {
    if (!aposta) return { texto: '—', cor: '#8b9bb4' }
    const temPlacar = aposta.placarCasa >= 0 && aposta.placarFora >= 0
    const texto = temPlacar ? `${aposta.placarCasa}×${aposta.placarFora}` : (aposta.vencedor || '—')
    return { texto, cor: '#8b9bb4' }
  }
  if (!aposta) return { texto: '—', cor: '#4b5563', badge: null }
  const temPlacar = aposta.placarCasa >= 0 && aposta.placarFora >= 0
  const texto = temPlacar ? `${aposta.placarCasa}×${aposta.placarFora}` : (aposta.vencedor || '—')
  const badge = aposta.pontos === 3 ? '✅ +3' : aposta.pontos === 1 ? '✅ +1' : '❌'
  return { texto, badge }
}

function cellStyle(aposta1, aposta2, status, lado) {
  if (status !== 'FINALIZADA') return { background: '#0a0e1a', border: '1px solid #1e2d45', opacity: 0.55 }
  const pts1 = aposta1?.pontos ?? 0
  const pts2 = aposta2?.pontos ?? 0
  if (pts1 === pts2) return { background: '#0d1321', border: '1px solid #1e2d45' }
  const venceu = lado === 1 ? pts1 > pts2 : pts2 > pts1
  return venceu
    ? { background: '#022c1a', border: '1px solid #00a651' }
    : { background: '#1f0a0a', border: '1px solid #e8192c' }
}

export default function Comparativo() {
  const { id1, id2 } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rodada, setRodada] = useState(0)
  const [infoAberta, setInfoAberta] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/comparativo/${id1}/${id2}`)
      .then((r) => setDados(r.data))
      .catch(() => navigate('/ranking'))
      .finally(() => setLoading(false))
  }, [id1, id2])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#8b9bb4' }}>Carregando...</div>
  )
  if (!dados) return null

  const { usuario1, usuario2, duelo, partidas } = dados
  const totalFinalizadas = duelo.vitorias1 + duelo.vitorias2 + duelo.empates
  const pct1 = totalFinalizadas === 0 ? 50 : Math.round((duelo.vitorias1 / totalFinalizadas) * 100)

  const partiasFiltradas = rodada === 0 ? partidas : partidas.filter((p) => p.rodada === rodada)

  const rodadas = [...new Set(partidas.map((p) => p.rodada))].sort()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      <button onClick={() => navigate('/ranking')} style={{
        background: 'none', border: 'none', color: '#8b9bb4',
        marginBottom: '1.5rem', fontSize: '0.85rem',
        display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      }}>← Voltar ao ranking</button>

      {/* Header card */}
      <div style={{
        background: '#111827', border: '1px solid #1e2d45',
        borderRadius: 16, padding: '1.75rem 1.5rem',
        marginBottom: '1.25rem', position: 'relative',
      }}>
        {/* Botão info */}
        <button
          onClick={() => setInfoAberta(true)}
          title="Como funciona o duelo"
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            width: 28, height: 28, borderRadius: '50%',
            background: '#0a0e1a', border: '1px solid #1e2d45',
            color: '#8b9bb4', fontSize: '0.85rem', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >ℹ</button>

        {/* Jogadores */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          {/* User 1 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
            <Avatar fotoUrl={usuario1.foto_url} nome={usuario1.nome} size={60} />
            <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1rem', letterSpacing: 1, color: '#f0f4ff', wordBreak: 'break-word' }}>
              {usuario1.nome}
              {String(usuario1.id) === String(usuario?.id) && (
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#00a651', letterSpacing: 1 }}>VOCÊ</span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '2rem', color: '#f0f4ff', lineHeight: 1 }}>
              {usuario1.pontos}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#8b9bb4', letterSpacing: 1 }}>PTS NO DUELO</div>
          </div>

          {/* Centro */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', color: '#8b9bb4', letterSpacing: 2 }}>⚔️</span>
            <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 2 }}>DUELO</span>
            <div style={{ fontSize: '0.8rem', color: '#8b9bb4', textAlign: 'center', marginTop: '0.25rem' }}>
              <span style={{ color: '#00a651', fontWeight: 700 }}>{duelo.vitorias1}V</span>
              {' · '}
              <span style={{ color: '#8b9bb4' }}>{duelo.empates}E</span>
              {' · '}
              <span style={{ color: '#00a651', fontWeight: 700 }}>{duelo.vitorias2}V</span>
            </div>
          </div>

          {/* User 2 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
            <Avatar fotoUrl={usuario2.foto_url} nome={usuario2.nome} size={60} />
            <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1rem', letterSpacing: 1, color: '#f0f4ff', wordBreak: 'break-word' }}>
              {usuario2.nome}
              {String(usuario2.id) === String(usuario?.id) && (
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#00a651', letterSpacing: 1 }}>VOCÊ</span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '2rem', color: '#f0f4ff', lineHeight: 1 }}>
              {usuario2.pontos}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#8b9bb4', letterSpacing: 1 }}>PTS NO DUELO</div>
          </div>
        </div>

        {/* Barra de progresso */}
        {totalFinalizadas > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ height: 10, borderRadius: 999, background: '#1f0a0a', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${pct1}%`, background: '#00a651', borderRadius: 999, transition: 'width 0.4s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#00a651' }}>{pct1}%</span>
              <span style={{ fontSize: '0.7rem', color: '#8b9bb4' }}>partidas disputadas</span>
              <span style={{ fontSize: '0.7rem', color: '#e8192c' }}>{100 - pct1}%</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.4rem', color: '#00a651' }}>{duelo.vitorias1}</div>
            <div style={{ fontSize: '0.65rem', color: '#8b9bb4', letterSpacing: 1 }}>VITÓRIAS</div>
            <div style={{ fontSize: '0.65rem', color: '#4b5563', letterSpacing: 1 }}>{usuario1.nome.split(' ')[0].toUpperCase()}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.4rem', color: '#8b9bb4' }}>{duelo.empates}</div>
            <div style={{ fontSize: '0.65rem', color: '#8b9bb4', letterSpacing: 1 }}>EMPATES</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.4rem', color: '#e8192c' }}>{duelo.vitorias2}</div>
            <div style={{ fontSize: '0.65rem', color: '#8b9bb4', letterSpacing: 1 }}>VITÓRIAS</div>
            <div style={{ fontSize: '0.65rem', color: '#4b5563', letterSpacing: 1 }}>{usuario2.nome.split(' ')[0].toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Filtro de rodadas */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => setRodada(0)} style={{
          background: rodada === 0 ? '#00a651' : '#0a0e1a',
          border: `1px solid ${rodada === 0 ? '#00a651' : '#1e2d45'}`,
          borderRadius: 8, color: rodada === 0 ? '#fff' : '#8b9bb4',
          padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
        }}>Todas</button>
        {rodadas.map((r) => (
          <button key={r} onClick={() => setRodada(r)} style={{
            background: rodada === r ? '#00a651' : '#0a0e1a',
            border: `1px solid ${rodada === r ? '#00a651' : '#1e2d45'}`,
            borderRadius: 8, color: rodada === r ? '#fff' : '#8b9bb4',
            padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
          }}>Rodada {r}</button>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 12, overflow: 'hidden' }}>
        {/* Cabeçalho */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          borderBottom: '1px solid #1e2d45',
          background: '#0a0e1a',
        }}>
          <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#8b9bb4', letterSpacing: 1, textAlign: 'center' }}>
            {usuario1.nome.split(' ')[0].toUpperCase()}
          </div>
          <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#8b9bb4', letterSpacing: 1, textAlign: 'center', borderLeft: '1px solid #1e2d45', borderRight: '1px solid #1e2d45', minWidth: 130 }}>
            PARTIDA
          </div>
          <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#8b9bb4', letterSpacing: 1, textAlign: 'center' }}>
            {usuario2.nome.split(' ')[0].toUpperCase()}
          </div>
        </div>

        {/* Linhas */}
        {partiasFiltradas.map((p) => {
          const ap1 = renderAposta(p.aposta1, p.status)
          const ap2 = renderAposta(p.aposta2, p.status)
          const cs1 = cellStyle(p.aposta1, p.aposta2, p.status, 1)
          const cs2 = cellStyle(p.aposta1, p.aposta2, p.status, 2)
          const pendente = p.status !== 'FINALIZADA'

          return (
            <div
              key={p.id}
              style={{
                display: 'grid', gridTemplateColumns: '1fr auto 1fr',
                borderBottom: '1px solid #1e2d45',
              }}
            >
              {/* Aposta user 1 */}
              <div style={{
                ...cs1,
                padding: '0.85rem 0.75rem',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '0.25rem', textAlign: 'center',
                opacity: pendente ? 0.6 : 1,
              }}>
                <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', color: '#f0f4ff', letterSpacing: 1 }}>
                  {ap1.texto}
                </span>
                {ap1.badge && (
                  <span style={{ fontSize: '0.7rem', color: ap1.badge.startsWith('✅') ? '#00a651' : '#e8192c', fontWeight: 600 }}>
                    {ap1.badge}
                  </span>
                )}
              </div>

              {/* Centro — partida */}
              <div style={{
                borderLeft: '1px solid #1e2d45', borderRight: '1px solid #1e2d45',
                padding: '0.75rem 0.75rem',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '0.2rem', minWidth: 130,
                opacity: pendente ? 0.75 : 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {p.selecaoCasa.escudo_url && (
                    <img src={p.selecaoCasa.escudo_url} alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                  )}
                  <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '0.75rem', color: '#f0f4ff', letterSpacing: 0.5 }}>
                    {p.selecaoCasa.nome.length > 6 ? p.selecaoCasa.nome.substring(0, 6) : p.selecaoCasa.nome}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '0.85rem', color: pendente ? '#8b9bb4' : '#f5d000', letterSpacing: 1 }}>
                  {pendente ? '⏳' : `${p.placarCasa} × ${p.placarFora}`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {p.selecaoFora.escudo_url && (
                    <img src={p.selecaoFora.escudo_url} alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                  )}
                  <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '0.75rem', color: '#f0f4ff', letterSpacing: 0.5 }}>
                    {p.selecaoFora.nome.length > 6 ? p.selecaoFora.nome.substring(0, 6) : p.selecaoFora.nome}
                  </span>
                </div>
              </div>

              {/* Aposta user 2 */}
              <div style={{
                ...cs2,
                padding: '0.85rem 0.75rem',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '0.25rem', textAlign: 'center',
                opacity: pendente ? 0.6 : 1,
              }}>
                <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', color: '#f0f4ff', letterSpacing: 1 }}>
                  {ap2.texto}
                </span>
                {ap2.badge && (
                  <span style={{ fontSize: '0.7rem', color: ap2.badge.startsWith('✅') ? '#00a651' : '#e8192c', fontWeight: 600 }}>
                    {ap2.badge}
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {/* Rodapé com totais do filtro */}
        {rodada !== 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto 1fr',
            background: '#0a0e1a', borderTop: '1px solid #1e2d45',
          }}>
            <div style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', color: '#00a651' }}>
                {partiasFiltradas.filter((p) => p.status === 'FINALIZADA').reduce((acc, p) => acc + (p.aposta1?.pontos ?? 0), 0)}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#8b9bb4', marginLeft: 4 }}>pts</span>
            </div>
            <div style={{ borderLeft: '1px solid #1e2d45', borderRight: '1px solid #1e2d45', padding: '0.75rem 1rem', textAlign: 'center', minWidth: 130 }}>
              <span style={{ fontSize: '0.7rem', color: '#8b9bb4', letterSpacing: 1 }}>RODADA {rodada}</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.1rem', color: '#e8192c' }}>
                {partiasFiltradas.filter((p) => p.status === 'FINALIZADA').reduce((acc, p) => acc + (p.aposta2?.pontos ?? 0), 0)}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#8b9bb4', marginLeft: 4 }}>pts</span>
            </div>
          </div>
        )}
      </div>

      {infoAberta && <InfoModal onClose={() => setInfoAberta(false)} />}
    </div>
  )
}
