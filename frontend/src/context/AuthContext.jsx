import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/api'
import { subscribePush } from '../utils/push'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('usuario')
    if (token && user) {
      setUsuario(JSON.parse(user))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setCarregando(false)
  }, [])

  function completarLogin(token, usuario) {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUsuario(usuario)
    subscribePush(usuario.id)
  }

  async function login(nome, senha) {
    const res = await api.post('/auth/login', { nome, senha })
    const { token, usuario, precisaCriarSenha } = res.data
    if (!precisaCriarSenha) completarLogin(token, usuario)
    return { usuario, token, precisaCriarSenha }
  }

  async function cadastro(nome, foto_url, senha) {
    const res = await api.post('/auth/cadastro', { nome, foto_url, senha })
    const { token, usuario } = res.data
    completarLogin(token, usuario)
    return usuario
  }

  function atualizarUsuario(dados) {
    const atualizado = { ...usuario, ...dados }
    localStorage.setItem('usuario', JSON.stringify(atualizado))
    setUsuario(atualizado)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    delete api.defaults.headers.common['Authorization']
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, cadastro, completarLogin, logout, atualizarUsuario, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}