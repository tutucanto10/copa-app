import { useEffect, useState, useRef } from 'react'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

const MEDALHAS = ['🥇', '🥈', '🥉']

export default function ModalPerfil({ onClose }) {
  const { usuario, logout, atualizarUsuario } = useAuth()
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [nomeEdit, setNomeEdit] = useState('')
  const [fotoEdit, setFotoEdit] = useState('')
  const [salvando, setSalvando] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    if (!usuario) return
    api.get(`/perfil/${usuario.id}`)
      .then((r) => setPerfil(r.data))
      .finally(() => setLoading(false))
  }, [usuario])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setFotoEdit(ev.target.result)
    reader.readAsDataURL(file)
  }

  async function handleSalvar() {
    setSalvando(true)
    try {
      await api.put(`/perfil/${usuario.id}`, {
        nome: nomeEdit || undefined,
        foto_url: fotoEdit || undefined,
      })
      const r = await api.get(`/perfil/${usuario.id}`)
      setPerfil(r.data)
      setEditando(false)
      atualizarUsuario({
        nome: nomeEdit || usuario.nome,
        foto_url: fotoEdit || usuario.foto_url,
      })
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setSalvando(false)
    }
  }

  const iniciais = perfil?.nome?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '?'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={modalRef}
        style={{
          background: '#111827',
          border: '1px solid #1e2d45',
          borderRadius: 16,
          width: '100%',
          maxWidth: 500,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0a1a10, #001a3d)',
          borderRadius: '16px 16px 0 0',
          padding: '2rem',
          textAlign: 'center',
          position: 'relative',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            background: 'none', border: 'none',
            color: '#8b9bb4', fontSize: '1.2rem', cursor: 'pointer',
          }}>✕</button>

          {/* Avatar */}
          {editando ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <label htmlFor="foto-perfil" style={{ cursor: 'pointer' }}>
                {fotoEdit || perfil?.foto_url ? (
                  <img src={fotoEdit || perfil?.foto_url} alt="preview" style={{
                    width: 90, height: 90, borderRadius: '50%',
                    objectFit: 'cover', border: '3px solid #00a651',
                    boxShadow: '0 0 20px #00a65155',
                  }} />
                ) : (
                  <div style={{
                    width: 90, height: 90, borderRadius: '50%',
                    background: '#0a1a10', border: '2px dashed #1e2d45',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', color: '#8b9bb4',
                  }}>📷</div>
                )}
              </label>
              <input id="foto-perfil" type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
              <span style={{ fontSize: '0.75rem', color: '#8b9bb4' }}>Clique para trocar foto</span>
            </div>
          ) : (
            perfil?.foto_url ? (
              <img src={perfil.foto_url} alt={perfil.nome} style={{
                width: 90, height: 90, borderRadius: '50%',
                objectFit: 'cover', border: '3px solid #00a651',
                boxShadow: '0 0 20px #00a65155',
              }} />
            ) : (
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                background: '#0a1a10', border: '3px solid #00a651',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 700, color: '#00a651',
                margin: '0 auto',
                boxShadow: '0 0 20px #00a65155',
              }}>{iniciais}</div>
            )
          )}

          {/* Nome */}
          {editando ? (
            <input
              value={nomeEdit}
              onChange={(e) => setNomeEdit(e.target.value)}
              style={{
                marginTop: '1rem',
                background: '#0a0e1a', border: '1px solid #1e2d45',
                borderRadius: 8, color: '#f0f4ff',
                padding: '0.5rem 1rem', fontSize: '1rem',
                outline: 'none', textAlign: 'center', width: '100%',
              }}
            />
          ) : (
            <div style={{
              fontFamily: 'var(--fonte-display)', fontSize: '1.8rem',
              letterSpacing: '2px', color: '#f0f4ff', marginTop: '0.75rem',
            }}>
              {loading ? '...' : perfil?.nome}
              {perfil?.isAdmin && (
                <span style={{
                  marginLeft: 8, fontSize: '0.7rem',
                  background: '#1a1500', border: '1px solid #f5d000',
                  borderRadius: 6, padding: '0.1rem 0.5rem', color: '#f5d000',
                  verticalAlign: 'middle',
                }}>ADMIN</span>
              )}
            </div>
          )}
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8b9bb4' }}>Carregando...</div>
        ) : (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Stats do bolão */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 700 }}>
                📊 Estatísticas do Bolão
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'PONTOS', valor: perfil.pontos, cor: '#00a651' },
                  { label: 'PLACARES EXATOS', valor: perfil.placaresExatos, cor: '#f5d000' },
                  { label: 'VENCEDORES', valor: perfil.vencedoresAcertados, cor: '#3b82f6' },
                  { label: 'GOLEADORES', valor: perfil.goleadoresAcertados, cor: '#8b9bb4' },
                  { label: 'SEQUÊNCIA 🔥', valor: perfil.streak ?? 0, cor: '#f97316' },
                ].map((s) => (
                  <div key={s.label} style={{
                    flex: 1, minWidth: 80,
                    background: '#0a0e1a', border: '1px solid #1e2d45',
                    borderRadius: 10, padding: '0.75rem',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.8rem', color: s.cor }}>
                      {s.valor}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#8b9bb4', letterSpacing: 1, marginTop: 2 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conquistas / Badges */}
            {perfil.badges?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 700 }}>
                  🏅 Conquistas
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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

            {/* Ligas e posição */}
            {perfil.ligas?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 700 }}>
                  🏆 Ranking nas Ligas
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {perfil.ligas.map(({ liga, posicao, total }) => (
                    <div key={liga.id} style={{
                      background: '#0a0e1a', border: '1px solid #1e2d45',
                      borderRadius: 8, padding: '0.75rem 1rem',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {posicao <= 3 ? MEDALHAS[posicao - 1] : `${posicao}º`}
                      </span>
                      <span style={{ flex: 1, fontWeight: 600, color: '#f0f4ff' }}>{liga.nome}</span>
                      <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>de {total} participantes</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botões */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {editando ? (
                <>
                  <button onClick={handleSalvar} disabled={salvando} style={{
                    flex: 1, background: '#00a651', color: '#fff',
                    border: 'none', borderRadius: 8, padding: '0.75rem',
                    fontWeight: 700, cursor: 'pointer',
                    opacity: salvando ? 0.6 : 1,
                  }}>
                    {salvando ? 'Salvando...' : '💾 SALVAR'}
                  </button>
                  <button onClick={() => setEditando(false)} style={{
                    background: 'none', border: '1px solid #1e2d45',
                    borderRadius: 8, color: '#8b9bb4', padding: '0.75rem 1.25rem',
                    cursor: 'pointer',
                  }}>Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setNomeEdit(perfil.nome); setFotoEdit(''); setEditando(true) }} style={{
                    flex: 1, background: '#1e2d45', color: '#f0f4ff',
                    border: 'none', borderRadius: 8, padding: '0.75rem',
                    fontWeight: 700, cursor: 'pointer',
                  }}>✏️ Editar Perfil</button>
                  <button onClick={() => { logout(); onClose() }} style={{
                    background: '#1a0000', border: '1px solid #e8192c',
                    borderRadius: 8, color: '#e8192c', padding: '0.75rem 1.25rem',
                    fontWeight: 700, cursor: 'pointer',
                  }}>Sair</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}