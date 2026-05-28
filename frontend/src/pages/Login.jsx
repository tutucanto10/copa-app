import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'

export default function Login() {
  const { login, cadastro, completarLogin } = useAuth()
  const navigate = useNavigate()
  const [modo, setModo] = useState('login') // 'login' | 'cadastro' | 'esqueci'
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirm, setSenhaConfirm] = useState('')
  const [fotoPreview, setFotoPreview] = useState(null)
  const [fotoBase64, setFotoBase64] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [emailEsqueci, setEmailEsqueci] = useState('')
  const [nomeEsqueci, setNomeEsqueci] = useState('')
  const [esqueciSucesso, setEsqueciSucesso] = useState(false)

  // Estado para criação de senha obrigatória (usuários sem senha)
  const [criarSenhaData, setCriarSenhaData] = useState(null) // { token, usuario }
  const [novaSenha, setNovaSenha] = useState('')
  const [novaSenhaConfirm, setNovaSenhaConfirm] = useState('')

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

  async function handleEsqueci(e) {
    e.preventDefault()
    if (!nomeEsqueci.trim() || !emailEsqueci.trim()) return setErro('Preencha nome e email')
    setErro('')
    setCarregando(true)
    try {
      await api.post('/auth/esqueci-senha', { nome: nomeEsqueci.trim(), email: emailEsqueci.trim() })
      setEsqueciSucesso(true)
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao enviar senha')
    } finally {
      setCarregando(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim()) return setErro('Digite seu nome')
    if (modo === 'cadastro') {
      if (!senha) return setErro('Crie uma senha')
      if (senha !== senhaConfirm) return setErro('As senhas não coincidem')
      if (senha.length < 6) return setErro('Senha deve ter ao menos 6 caracteres')
    }
    setErro('')
    setCarregando(true)
    try {
      if (modo === 'login') {
        const { precisaCriarSenha, token, usuario } = await login(nome.trim(), senha || undefined)
        if (precisaCriarSenha) {
          setCriarSenhaData({ token, usuario })
        } else {
          navigate('/')
        }
      } else {
        await cadastro(nome.trim(), fotoBase64 || null, senha)
        navigate('/')
      }
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao entrar')
    } finally {
      setCarregando(false)
    }
  }

  async function handleDefinirSenha(e) {
    e.preventDefault()
    if (!novaSenha) return setErro('Digite uma senha')
    if (novaSenha.length < 6) return setErro('Senha deve ter ao menos 6 caracteres')
    if (novaSenha !== novaSenhaConfirm) return setErro('As senhas não coincidem')
    setErro('')
    setCarregando(true)
    try {
      await api.post('/auth/definir-senha', { senha: novaSenha }, {
        headers: { Authorization: `Bearer ${criarSenhaData.token}` },
      })
      completarLogin(criarSenhaData.token, criarSenhaData.usuario)
      navigate('/')
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao definir senha')
    } finally {
      setCarregando(false)
    }
  }

  const inputStyle = {
    width: '100%', background: '#0a0e1a', border: '1px solid #1e2d45',
    borderRadius: 8, color: '#f0f4ff', padding: '0.75rem 1rem',
    fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
  }

  // Tela de criação de senha obrigatória
  if (criarSenhaData) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0e1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}>
        <div style={{
          background: '#111827', border: '1px solid #1e2d45',
          borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 420,
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <h2 style={{
              fontFamily: 'var(--fonte-display)', fontSize: '1.6rem',
              letterSpacing: '3px', color: '#f5d000', margin: '0 0 0.5rem',
            }}>CRIE SUA SENHA</h2>
            <p style={{ color: '#8b9bb4', fontSize: '0.9rem', margin: 0 }}>
              Olá, <strong style={{ color: '#f0f4ff' }}>{criarSenhaData.usuario.nome}</strong>!<br />
              Para continuar, defina uma senha para sua conta.
            </p>
          </div>

          <form onSubmit={handleDefinirSenha} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Nova senha
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                style={inputStyle}
                autoFocus
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Confirmar senha
              </label>
              <input
                type="password"
                placeholder="Repita a senha"
                value={novaSenhaConfirm}
                onChange={(e) => setNovaSenhaConfirm(e.target.value)}
                style={inputStyle}
              />
            </div>

            {erro && (
              <div style={{
                background: '#1f0a0a', border: '1px solid #e8192c',
                borderRadius: 8, padding: '0.6rem 1rem',
                color: '#e8192c', fontSize: '0.85rem',
              }}>{erro}</div>
            )}

            <button type="submit" disabled={carregando} style={{
              background: '#f5d000', color: '#0a0e1a', border: 'none',
              borderRadius: 8, padding: '0.85rem', fontWeight: 700,
              fontSize: '1rem', letterSpacing: 1,
              cursor: carregando ? 'not-allowed' : 'pointer',
              opacity: carregando ? 0.7 : 1, marginTop: 4,
            }}>
              {carregando ? 'Salvando...' : 'CONFIRMAR SENHA'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (modo === 'esqueci') {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0e1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}>
        <div style={{
          background: '#111827', border: '1px solid #1e2d45',
          borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 420,
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
            <h2 style={{
              fontFamily: 'var(--fonte-display)', fontSize: '1.6rem',
              letterSpacing: '3px', color: '#00a651', margin: '0 0 0.5rem',
            }}>ESQUECI MINHA SENHA</h2>
            <p style={{ color: '#8b9bb4', fontSize: '0.9rem', margin: 0 }}>
              Digite seu nome e o email cadastrado na conta. Enviaremos uma senha temporária por email.
            </p>
          </div>

          {esqueciSucesso ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✅</div>
              <div style={{ color: '#00a651', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
                Email enviado!
              </div>
              <div style={{ color: '#8b9bb4', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Verifique sua caixa de entrada e use a senha temporária para entrar.
              </div>
              <button onClick={() => { setModo('login'); setEsqueciSucesso(false); setTelefoneEsqueci('') }} style={{
                background: '#00a651', color: '#fff', border: 'none',
                borderRadius: 8, padding: '0.75rem 2rem',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
              }}>IR PARA O LOGIN</button>
            </div>
          ) : (
            <form onSubmit={handleEsqueci} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Seu nome (como cadastrado)
                </label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={nomeEsqueci}
                  onChange={(e) => setNomeEsqueci(e.target.value)}
                  style={{
                    width: '100%', background: '#0a0e1a', border: '1px solid #1e2d45',
                    borderRadius: 8, color: '#f0f4ff', padding: '0.75rem 1rem',
                    fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
                  }}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Email cadastrado
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={emailEsqueci}
                  onChange={(e) => setEmailEsqueci(e.target.value)}
                  style={{
                    width: '100%', background: '#0a0e1a', border: '1px solid #1e2d45',
                    borderRadius: 8, color: '#f0f4ff', padding: '0.75rem 1rem',
                    fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
                  }}
                  autoFocus
                />
              </div>

              {erro && (
                <div style={{
                  background: '#1f0a0a', border: '1px solid #e8192c',
                  borderRadius: 8, padding: '0.6rem 1rem',
                  color: '#e8192c', fontSize: '0.85rem',
                }}>{erro}</div>
              )}

              <button type="submit" disabled={carregando} style={{
                background: '#00a651', color: '#fff', border: 'none',
                borderRadius: 8, padding: '0.85rem', fontWeight: 700,
                fontSize: '1rem', letterSpacing: 1,
                cursor: carregando ? 'not-allowed' : 'pointer',
                opacity: carregando ? 0.7 : 1,
              }}>
                {carregando ? 'Enviando...' : 'ENVIAR SENHA'}
              </button>

              <button type="button" onClick={() => { setModo('login'); setErro('') }} style={{
                background: 'none', border: 'none', color: '#8b9bb4',
                fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline',
              }}>← Voltar para o login</button>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: '#111827', border: '1px solid #1e2d45',
        borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 420,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/bola-copa.png" alt="Bola Copa 2026" style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: '0.5rem' }} />
          <h1 style={{
            fontFamily: 'var(--fonte-display)', fontSize: '2.5rem',
            letterSpacing: '4px', color: '#00a651', margin: 0,
          }}>BOLÃO</h1>
        </div>

        {/* Abas */}
        <div style={{
          display: 'flex', background: '#0a0e1a',
          borderRadius: 8, padding: 4, marginBottom: '1.5rem',
        }}>
          {['login', 'cadastro'].map((m) => (
            <button key={m} onClick={() => { setModo(m); setErro(''); setSenha(''); setSenhaConfirm('') }} style={{
              flex: 1, background: modo === m ? '#1e2d45' : 'transparent',
              border: 'none', borderRadius: 6,
              color: modo === m ? '#f0f4ff' : '#8b9bb4',
              padding: '0.5rem', fontWeight: 700, fontSize: '0.85rem',
              letterSpacing: 1, textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {m === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Foto (só no cadastro) */}
          {modo === 'cadastro' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <label htmlFor="foto" style={{ cursor: 'pointer' }}>
                {fotoPreview ? (
                  <img src={fotoPreview} alt="preview" style={{
                    width: 90, height: 90, borderRadius: '50%',
                    objectFit: 'cover', border: '3px solid #00a651',
                    boxShadow: '0 0 16px #00a65155',
                  }} />
                ) : (
                  <div style={{
                    width: 90, height: 90, borderRadius: '50%',
                    background: '#0a0e1a', border: '2px dashed #1e2d45',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 4, color: '#8b9bb4',
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>📷</span>
                    <span style={{ fontSize: '0.65rem', letterSpacing: 1 }}>FOTO</span>
                  </div>
                )}
              </label>
              <input id="foto" type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
              <span style={{ fontSize: '0.75rem', color: '#8b9bb4' }}>
                {fotoPreview ? 'Clique para trocar' : 'Clique para adicionar foto'}
              </span>
            </div>
          )}

          {/* Nome */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Seu nome
            </label>
            <input
              type="text"
              placeholder={modo === 'login' ? 'Como você se cadastrou' : 'Como quer ser chamado?'}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={inputStyle}
              autoFocus
            />
          </div>

          {/* Senha */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Senha
            </label>
            <input
              type="password"
              placeholder={modo === 'login' ? 'Sua senha' : 'Mínimo 6 caracteres'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Confirmar senha (só no cadastro) */}
          {modo === 'cadastro' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: '#8b9bb4', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Confirmar senha
              </label>
              <input
                type="password"
                placeholder="Repita a senha"
                value={senhaConfirm}
                onChange={(e) => setSenhaConfirm(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          {modo === 'login' && (
            <button type="button" onClick={() => { setModo('esqueci'); setErro('') }} style={{
              background: 'none', border: 'none', color: '#8b9bb4',
              fontSize: '0.8rem', cursor: 'pointer', textAlign: 'right',
              padding: 0, textDecoration: 'underline', alignSelf: 'flex-end',
            }}>
              Esqueci minha senha
            </button>
          )}

          {erro && (
            <div style={{
              background: '#1f0a0a', border: '1px solid #e8192c',
              borderRadius: 8, padding: '0.6rem 1rem',
              color: '#e8192c', fontSize: '0.85rem',
            }}>{erro}</div>
          )}

          <button type="submit" disabled={carregando} style={{
            background: '#00a651', color: '#fff', border: 'none',
            borderRadius: 8, padding: '0.85rem', fontWeight: 700,
            fontSize: '1rem', letterSpacing: 1,
            cursor: carregando ? 'not-allowed' : 'pointer',
            opacity: carregando ? 0.7 : 1, marginTop: 4,
          }}>
            {carregando ? 'Aguarde...' : modo === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
          </button>

          {modo === 'login' && (
            <div style={{
              marginTop: '1.25rem',
              background: '#0a1a10',
              border: '1px solid #1e2d4588',
              borderRadius: 10,
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span>🔑</span>
                <span style={{ fontSize: '0.78rem', color: '#8b9bb4', lineHeight: 1.5 }}>
                  <strong style={{ color: '#f0f4ff' }}>Primeira vez com senha?</strong>{' '}
                  Se você já tinha conta antes desta atualização, deixe o campo senha em branco e clique em Entrar — você será redirecionado para criar uma senha nova.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span>💡</span>
                <span style={{ fontSize: '0.78rem', color: '#8b9bb4', lineHeight: 1.5 }}>
                  <strong style={{ color: '#f0f4ff' }}>Dica:</strong>{' '}
                  Cadastre seu email no perfil para poder recuperar a senha caso esqueça.
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
