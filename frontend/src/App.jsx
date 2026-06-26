import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Home from './pages/Home'
import Partida from './pages/Partida'
import { useParams } from 'react-router-dom'

function PartidaWrapper() {
  const { id } = useParams()
  return <Partida key={id} />
}
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import Ranking from './pages/Ranking'
import Comparativo from './pages/Comparativo'
import Copa from './pages/Copa'
import Login from './pages/Login'
import ModalPerfil from './components/ModalPerfil'
import api from './api/api'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function Nav() {
  const { pathname } = useLocation()
  const { usuario, logout } = useAuth()
  const { theme, cycleTheme } = useTheme()
  const [modalAberto, setModalAberto] = useState(false)
  const isMobile = useIsMobile()

  const iniciais = usuario?.nome?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '?'

  const linkStyle = (path) => ({
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: pathname === path ? 'var(--color-accent)' : 'var(--color-text-muted)',
    borderBottom: pathname === path ? '2px solid var(--color-accent)' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'color 0.2s',
  })

  const navItems = [
    { path: '/', label: 'Partidas', icon: '🏟' },
    { path: '/copa', label: 'Copa', icon: '🏆' },
    { path: '/ranking', label: 'Ranking', icon: '📊' },
    ...(usuario?.isAdmin ? [{ path: '/admin', label: 'Admin', icon: '⚙️' }] : []),
  ]

  const Avatar = ({ size = 34 }) => usuario?.foto_url ? (
    <img src={usuario.foto_url} alt={usuario.nome} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)' }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--color-accent-dark)', border: '2px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.35, color: 'var(--color-accent)' }}>{iniciais}</div>
  )

  return (
    <>
      {/* Top navbar */}
      <nav style={{
        background: 'var(--color-bg-nav)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 1.5rem',
        height: '60px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div className="nav-inner">
          <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.6rem', letterSpacing: '2px', color: '#00a651', marginRight: !isMobile ? 'auto' : undefined }}>
            <img src="/bola-copa.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain', verticalAlign: 'middle', marginRight: 6 }} />
            BOLÃO
          </span>

          {!isMobile && <>
            {navItems.map(({ path, label }) => (
              <Link key={path} to={path} style={linkStyle(path)}>{label}</Link>
            ))}
          </>}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
            <button
              onClick={cycleTheme}
              title={`Tema: ${theme.label}`}
              style={{
                background: 'none', border: '1px solid var(--color-border)',
                borderRadius: 8, padding: '0.3rem 0.55rem',
                fontSize: '1rem', cursor: 'pointer', lineHeight: 1,
                color: 'var(--color-text-muted)',
              }}
            >{theme.icon}</button>
            <button onClick={() => setModalAberto(true)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
              <Avatar />
              {!isMobile && <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{usuario?.nome}</span>}
            </button>
            {!isMobile && (
              <button onClick={logout} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text-muted)', padding: '0.3rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}>Sair</button>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom navbar — mobile only */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--color-bg-nav)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          zIndex: 100,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {navItems.map(({ path, label, icon }) => (
            <Link key={path} to={path} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '0.5rem 0',
              color: pathname === path ? 'var(--color-accent)' : 'var(--color-text-muted)',
              fontSize: '0.6rem', fontWeight: 600,
              letterSpacing: '0.5px', textTransform: 'uppercase', gap: '0.2rem',
            }}>
              <span style={{ fontSize: '1.3rem' }}>{icon}</span>
              {label}
            </Link>
          ))}
          <button onClick={() => setModalAberto(true)} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none',
            padding: '0.5rem 0', color: '#8b9bb4',
            fontSize: '0.6rem', fontWeight: 600,
            letterSpacing: '0.5px', textTransform: 'uppercase', gap: '0.2rem',
            cursor: 'pointer',
          }}>
            <Avatar size={24} />
            Perfil
          </button>
        </nav>
      )}

      {modalAberto && <ModalPerfil onClose={() => setModalAberto(false)} />}
    </>
  )
}

function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return null
  if (!usuario) return <Navigate to="/login" />
  return children
}

function RotaAdmin({ children }) {
  const { usuario, carregando } = useAuth()
  
  // Verificar se tem token admin no localStorage
  const adminToken = localStorage.getItem('admin_token')
  
  if (carregando) return null
  if (!usuario) return <Navigate to="/login" />
  
  // Verificar se é o usuário admin (Artur) - apenas ele pode acessar
  const isAdminUser = usuario.email === 'artur@admin.com' || usuario.nome === 'Artur' || usuario.id === 1
  
  if (!isAdminUser) {
    return (
      <div style={{ 
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h1 style={{ 
          fontFamily: 'var(--fonte-display)', 
          fontSize: '2rem', 
          letterSpacing: 2,
          color: '#e8192c',
          margin: '0 0 0.5rem'
        }}>
          ACESSO NEGADO
        </h1>
        <p style={{ color: '#8b9bb4', fontSize: '1.1rem' }}>
          Apenas o administrador pode acessar essa página.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            background: '#00a651',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ← Voltar para Home
        </button>
      </div>
    )
  }
  
  // Se é admin mas não tem token, pede senha
  if (!adminToken) {
    return <Navigate to="/admin/login" />
  }
  
  // Configurar token no header
  if (adminToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`
  }
  
  return children
}

function BannerLentidao() {
  const [estado, setEstado] = useState(null) // null | 'lenta' | 'refresh'

  useEffect(() => {
    const onLenta   = () => setEstado('lenta')
    const onRefresh = () => setEstado('refresh')
    const onOk      = () => setEstado(null)
    window.addEventListener('api-lenta',   onLenta)
    window.addEventListener('api-refresh', onRefresh)
    window.addEventListener('api-ok',      onOk)
    return () => {
      window.removeEventListener('api-lenta',   onLenta)
      window.removeEventListener('api-refresh', onRefresh)
      window.removeEventListener('api-ok',      onOk)
    }
  }, [])

  if (!estado) return null

  const isRefresh = estado === 'refresh'

  return (
    <div style={{
      position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, width: 'calc(100% - 2rem)', maxWidth: 440,
      background: isRefresh ? '#1f0a0a' : '#1a1200',
      border: `1px solid ${isRefresh ? '#e8192c' : '#f5a623'}`,
      borderRadius: 10, padding: '0.65rem 1.1rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      <span style={{ fontSize: '1.3rem' }}>{isRefresh ? '😵' : '⏳'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isRefresh ? '#e8192c' : '#f5a623' }}>
          {isRefresh ? 'Algo deu errado...' : 'Aguenta aí, carregando...'}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#8b9bb4', marginTop: 1 }}>
          {isRefresh
            ? 'Está demorando mais que o esperado.'
            : 'O servidor pode estar saindo do modo de espera.'}
        </div>
      </div>
      {isRefresh && (
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#e8192c', color: '#fff', border: 'none',
            borderRadius: 8, padding: '0.4rem 0.85rem',
            fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          Recarregar
        </button>
      )}
    </div>
  )
}

function BannerInstalar() {
  const [prompt, setPrompt] = useState(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    function handler(e) {
      e.preventDefault()
      setPrompt(e)
      setVisivel(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!visivel) return null

  async function instalar() {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setVisivel(false)
  }

  return (
    <div style={{
      position: 'fixed', bottom: 72, left: '50%', transform: 'translateX(-50%)',
      zIndex: 500, width: 'calc(100% - 2rem)', maxWidth: 400,
      background: '#111827', border: '1px solid #00a651',
      borderRadius: 14, padding: '0.9rem 1.1rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 4px 24px #00a65133',
    }}>
      <img src="/icon-192.png" alt="" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f0f4ff' }}>Instalar o Bolão</div>
        <div style={{ fontSize: '0.72rem', color: '#8b9bb4' }}>Adicione à tela inicial para acesso rápido</div>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
        <button onClick={instalar} style={{
          background: '#00a651', color: '#fff', border: 'none',
          borderRadius: 8, padding: '0.45rem 0.85rem',
          fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
        }}>Instalar</button>
        <button onClick={() => setVisivel(false)} style={{
          background: 'none', border: '1px solid #1e2d45',
          borderRadius: 8, color: '#8b9bb4', padding: '0.45rem 0.6rem',
          fontSize: '0.8rem', cursor: 'pointer',
        }}>✕</button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<><BannerLentidao /><Login /></>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/*" element={
          <RotaProtegida>
            <Nav />
            <BannerLentidao />
            <BannerInstalar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/partida/:id" element={<PartidaWrapper />} />
                <Route path="/copa" element={<Copa />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/comparativo/:id1/:id2" element={<Comparativo />} />
                <Route path="/admin" element={<RotaAdmin><Admin /></RotaAdmin>} />
              </Routes>
            </div>
          </RotaProtegida>
        } />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}
