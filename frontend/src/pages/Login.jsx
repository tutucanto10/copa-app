import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, cadastro } = useAuth()
  const navigate = useNavigate()
  const [modo, setModo] = useState('login')
  const [nome, setNome] = useState('')
  const [fotoPreview, setFotoPreview] = useState(null)
  const [fotoBase64, setFotoBase64] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      setFotoPreview(ev.target.result)
      setFotoBase64(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim()) return setErro('Digite seu nome')
    setErro('')
    setCarregando(true)
    try {
      if (modo === 'login') {
        await login(nome.trim())
      } else {
        await cadastro(nome.trim(), fotoBase64 || null)
      }
      navigate('/')
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao entrar')
    } finally {
      setCarregando(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: '#0a0e1a',
    border: '1px solid #1e2d45',
    borderRadius: 8,
    color: '#f0f4ff',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#111827',
        border: '1px solid #1e2d45',
        borderRadius: 16,
        padding: '2.5rem',
        width: '100%',
        maxWidth: 420,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/bola-copa.png" alt="Bola Copa 2026" style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: '0.5rem' }} />
          <h1 style={{
            fontFamily: 'var(--fonte-display)',
            fontSize: '2.5rem',
            letterSpacing: '4px',
            color: '#00a651',
            margin: 0,
          }}>BOLÃO</h1>
        </div>

        {/* Abas */}
        <div style={{
          display: 'flex',
          background: '#0a0e1a',
          borderRadius: 8,
          padding: 4,
          marginBottom: '1.5rem',
        }}>
          {['login', 'cadastro'].map((m) => (
            <button key={m} onClick={() => { setModo(m); setErro('') }} style={{
              flex: 1,
              background: modo === m ? '#1e2d45' : 'transparent',
              border: 'none',
              borderRadius: 6,
              color: modo === m ? '#f0f4ff' : '#8b9bb4',
              padding: '0.5rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: 1,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              {m === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Foto (só no cadastro) */}
          {modo === 'cadastro' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <label htmlFor="foto" style={{ cursor: 'pointer' }}>
                {fotoPreview ? (
                  <img src={fotoPreview} alt="preview" style={{
                    width: 90, height: 90, borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #00a651',
                    boxShadow: '0 0 16px #00a65155',
                  }} />
                ) : (
                  <div style={{
                    width: 90, height: 90, borderRadius: '50%',
                    background: '#0a0e1a',
                    border: '2px dashed #1e2d45',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 4, color: '#8b9bb4',
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>📷</span>
                    <span style={{ fontSize: '0.65rem', letterSpacing: 1 }}>FOTO</span>
                  </div>
                )}
              </label>
              <input
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFoto}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#8b9bb4' }}>
                {fotoPreview ? 'Clique para trocar' : 'Clique para adicionar foto'}
              </span>
            </div>
          )}

          {/* Nome */}
          <div>
            <label style={{
              fontSize: '0.75rem', color: '#8b9bb4',
              letterSpacing: 1, textTransform: 'uppercase',
              display: 'block', marginBottom: 6,
            }}>
              Seu nome
            </label>
            <input
              type="text"
              placeholder={modo === 'login' ? 'Ex: Seu Nome' : 'Como quer ser chamado?'}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={inputStyle}
              autoFocus
            />
          </div>

          {/* Erro */}
          {erro && (
            <div style={{
              background: '#1f0a0a', border: '1px solid #e8192c',
              borderRadius: 8, padding: '0.6rem 1rem',
              color: '#e8192c', fontSize: '0.85rem',
            }}>
              {erro}
            </div>
          )}

          {/* Botão */}
          <button type="submit" disabled={carregando} style={{
            background: '#00a651',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.85rem',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: 1,
            cursor: carregando ? 'not-allowed' : 'pointer',
            opacity: carregando ? 0.7 : 1,
            marginTop: 4,
          }}>
            {carregando ? 'Aguarde...' : modo === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
          </button>
        </form>
      </div>
    </div>
  )
}