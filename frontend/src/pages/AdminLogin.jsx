import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

export default function AdminLogin() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const response = await api.post('/admin/login', { senha })
      
      // Salvar token no localStorage
      localStorage.setItem('admin_token', response.data.token)
      
      // Configurar header padrão do axios
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      
      // Redirecionar para admin
      navigate('/admin')
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao fazer login')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2332 100%)',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--color-background-primary)',
        borderRadius: 16,
        padding: '3rem 2rem',
        width: '100%',
        maxWidth: 400,
        border: '1px solid var(--color-border-tertiary)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}>
        {/* Logo/Título */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '0.5rem',
          }}>🔒</div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: '0 0 0.5rem',
          }}>
            Admin Copa 2026
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}>
            Área restrita - Digite a senha
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem',
            }}>
              Senha do Admin
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite a senha..."
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 8,
                border: erro ? '2px solid #ef4444' : '1px solid var(--color-border-tertiary)',
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                if (!erro) e.target.style.borderColor = '#00a651'
              }}
              onBlur={(e) => {
                if (!erro) e.target.style.borderColor = 'var(--color-border-tertiary)'
              }}
            />
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div style={{
              background: '#7f1d1d',
              border: '1px solid #ef4444',
              borderRadius: 8,
              padding: '0.75rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{ fontSize: '1.25rem' }}>⚠️</span>
              <span style={{
                fontSize: '0.875rem',
                color: '#fca5a5',
              }}>{erro}</span>
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={!senha || carregando}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: 8,
              border: 'none',
              background: !senha || carregando ? '#374151' : '#00a651',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: !senha || carregando ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: carregando ? 0.6 : 1,
            }}
          >
            {carregando ? 'Verificando...' : '🔓 Entrar no Admin'}
          </button>
        </form>

        {/* Rodapé */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border-tertiary)',
          textAlign: 'center',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            ← Voltar para página inicial
          </button>
        </div>
      </div>
    </div>
  )
}
