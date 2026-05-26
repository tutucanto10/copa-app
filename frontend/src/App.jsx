import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Partida from './pages/Partida'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import Ranking from './pages/Ranking'
import Copa from './pages/Copa'
import Login from './pages/Login'
import ModalPerfil from './components/ModalPerfil'
import api from './api/api'

function Nav() {
  const { pathname } = useLocation()
  const { usuario, logout } = useAuth()
  const [modalAberto, setModalAberto] = useState(false)

  const navStyle = {
    background: '#0d1321',
    borderBottom: '1px solid #1e2d45',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    height: '60px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  }

  const logoStyle = {
    fontFamily: 'var(--fonte-display)',
    fontSize: '1.6rem',
    letterSpacing: '2px',
    color: '#00a651',
    marginRight: 'auto',
  }

  const linkStyle = (path) => ({
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: pathname === path ? '#00a651' : '#8b9bb4',
    borderBottom: pathname === path ? '2px solid #00a651' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'color 0.2s',
  })

  const iniciais = usuario?.nome?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '?'

  return (
    <>
      <nav style={navStyle}>
        <span style={logoStyle}>⚽ BOLÃO</span>
        <Link to="/" style={linkStyle('/')}>Partidas</Link>
        <Link to="/copa" style={linkStyle('/copa')}>Copa</Link>
        <Link to="/ranking" style={linkStyle('/ranking')}>Ranking</Link>
        {usuario?.isAdmin && (
          <Link to="/admin" style={linkStyle('/admin')}>Admin</Link>
        )}

        {/* Perfil clicável + Sair */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          <button
            onClick={() => setModalAberto(true)}
            style={{
              background: 'none', border: 'none',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              cursor: 'pointer',
            }}
          >
            {usuario?.foto_url ? (
              <img src={usuario.foto_url} alt={usuario.nome} style={{
                width: 34, height: 34, borderRadius: '50%',
                objectFit: 'cover', border: '2px solid #00a651',
              }} />
            ) : (
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: '#0a1a10', border: '2px solid #00a651',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem', color: '#00a651',
              }}>{iniciais}</div>
            )}
            <span style={{ fontSize: '0.85rem', color: '#8b9bb4' }}>{usuario?.nome}</span>
          </button>

          <button onClick={logout} style={{
            background: 'none', border: '1px solid #1e2d45',
            borderRadius: 8, color: '#8b9bb4',
            padding: '0.3rem 0.75rem', fontSize: '0.8rem',
            cursor: 'pointer',
          }}>Sair</button>
        </div>
      </nav>

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/*" element={
          <RotaProtegida>
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/partida/:id" element={<Partida />} />
              <Route path="/copa" element={<Copa />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/admin" element={<RotaAdmin><Admin /></RotaAdmin>} />
            </Routes>
          </RotaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  )
}
