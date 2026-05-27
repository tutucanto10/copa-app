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

  async function login(nome) {
    const res = await api.post('/auth/login', { nome })
    const { token, usuario } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUsuario(usuario)
    subscribePush(usuario.id)
    return usuario
  }

  async function cadastro(nome, foto_url) {
    const res = await api.post('/auth/cadastro', { nome, foto_url })
    const { token, usuario } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUsuario(usuario)
    subscribePush(usuario.id)
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
    <AuthContext.Provider value={{ usuario, login, cadastro, logout, atualizarUsuario, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}