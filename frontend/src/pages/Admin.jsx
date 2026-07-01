import { useEffect, useState } from 'react'
import api from '../api/api'

const TIPOS = [
  { value: 'GOL',         label: '⚽ Gol',            cor: '#00a651' },
  { value: 'ASSISTENCIA', label: '🎯 Assistência',    cor: '#f5d000' },
  { value: 'AMARELO',     label: '🟨 Amarelo',        cor: '#f5d000' },
  { value: 'VERMELHO',    label: '🟥 Vermelho',       cor: '#e8192c' },
]

const STATUS_OPCOES = ['AGENDADA', 'AO_VIVO', 'FINALIZADA']
const STATUS_COR = {
  AGENDADA:   '#8b9bb4',
  AO_VIVO:    '#00a651',
  FINALIZADA: '#f5d000',
}

const COR_POSICAO = { GOL: '#f5a000', DEF: '#00e85a', MEI: '#60aaff', ATA: '#ff3347' }

export default function Admin() {
  const [abaAtiva, setAbaAtiva] = useState('partidas')
  const [rodadaAdminAtiva, setRodadaAdminAtiva] = useState(4)

  // Eventos
  const [partidas, setPartidas]   = useState([])
  const [partidaId, setPartidaId] = useState('')
  const [jogadores, setJogadores] = useState([])
  const [jogadorId, setJogadorId] = useState('')
  const [tipo, setTipo]           = useState('GOL')
  const [minuto, setMinuto]       = useState('')
  const [enviando, setEnviando]   = useState(false)
  const [sucesso, setSucesso]     = useState('')
  const [eventos, setEventos]     = useState([])

  // Config partidas
  const [editandoPartida, setEditandoPartida] = useState(null)
  const [novoStatus, setNovoStatus]           = useState('')
  const [novoPlacarCasa, setNovoPlacarCasa]   = useState('')
  const [novoPlacarFora, setNovoPlacarFora]   = useState('')

  // Nova partida
  const [selecoes, setSelecoes]             = useState([])
  const [novaPartida, setNovaPartida]       = useState({ selecaoCasaId: '', selecaoForaId: '', data: '', rodada: 1 })
  const [criandoPartida, setCriandoPartida] = useState(false)

  // Seleções
  const [editandoSelecao, setEditandoSelecao] = useState(null)
  const [novoEscudo, setNovoEscudo]           = useState('')
  const [novoNomeSelecao, setNovoNomeSelecao] = useState('')

  // Usuários e ligas
  const [usuarios, setUsuarios]               = useState([])
  const [ligas, setLigas]                     = useState([])
  const [editandoUsuario, setEditandoUsuario] = useState(null)
  const [nomeUsuario, setNomeUsuario]         = useState('')
  const [fotoUsuario, setFotoUsuario]         = useState('')

  // Jogadores
  const [jogadoresList, setJogadoresList]     = useState([])
  const [novoJogador, setNovoJogador]         = useState({ nome: '', posicao: 'ATA', selecaoId: '', foto_url: '' })
  const [editandoJogador, setEditandoJogador] = useState(null)
  const [jogadorEdit, setJogadorEdit]         = useState({ nome: '', posicao: '', foto_url: '' })
  const [filtroSelecao, setFiltroSelecao]     = useState('')

  useEffect(() => {
    api.get('/partidas').then((r) => setPartidas(r.data))
    api.get('/partidas/selecoes').then((r) => setSelecoes(r.data))
    api.get('/jogadores').then((r) => setJogadoresList(r.data))
  }, [])

  useEffect(() => {
    if (!partidaId) return
    api.get(`/partidas/${partidaId}/jogadores`).then((r) => setJogadores(r.data))
    api.get(`/eventos/${partidaId}`).then((r) => setEventos(r.data))
    setJogadorId('')
  }, [partidaId])

  async function carregarUsuarios() {
    const [u, l] = await Promise.all([
      api.get('/ligas/usuarios'),
      api.get('/ligas'),
    ])
    setUsuarios(u.data)
    setLigas(l.data)
  }

  async function handleEvento(e) {
    e.preventDefault()
    if (!partidaId || !jogadorId || !minuto) return alert('Preencha todos os campos')
    setEnviando(true)
    try {
      await api.post('/evento', {
        partidaId: Number(partidaId),
        jogadorId: Number(jogadorId),
        tipo,
        minuto: Number(minuto),
      })
      setSucesso('Evento registrado!')
      setTimeout(() => setSucesso(''), 3000)
      setMinuto('')
      api.get(`/eventos/${partidaId}`).then((r) => setEventos(r.data))
      api.get('/partidas').then((r) => setPartidas(r.data))
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setEnviando(false)
    }
  }

  async function handleAtualizarPartida(id) {
    try {
      const body = {}
      if (novoStatus) body.status = novoStatus
      if (novoPlacarCasa !== '') body.placarCasa = Number(novoPlacarCasa)
      if (novoPlacarFora !== '') body.placarFora = Number(novoPlacarFora)
      await api.put(`/partidas/${id}`, body)
      setSucesso('Partida atualizada!')
      setTimeout(() => setSucesso(''), 3000)
      setEditandoPartida(null)
      api.get('/partidas').then((r) => setPartidas(r.data))
    } catch (err) {
      alert('Erro: ' + err.message)
    }
  }

  async function handleCriarPartida(e) {
    e.preventDefault()
    setCriandoPartida(true)
    try {
      await api.post('/partidas', novaPartida)
      setSucesso('Partida criada!')
      setTimeout(() => setSucesso(''), 3000)
      setNovaPartida({ selecaoCasaId: '', selecaoForaId: '', data: '', rodada: 1 })
      api.get('/partidas').then((r) => setPartidas(r.data))
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setCriandoPartida(false)
    }
  }

  async function handleAtualizarSelecao(id) {
    try {
      await api.put(`/partidas/selecoes/${id}`, {
        nome: novoNomeSelecao || undefined,
        escudo_url: novoEscudo || undefined,
      })
      setSucesso('Seleção atualizada!')
      setTimeout(() => setSucesso(''), 3000)
      setEditandoSelecao(null)
      api.get('/partidas/selecoes').then((r) => setSelecoes(r.data))
    } catch (err) {
      alert('Erro: ' + err.message)
    }
  }

  async function handleAtualizarUsuario(id) {
    try {
      await api.put(`/ligas/usuarios/${id}`, {
        nome: nomeUsuario || undefined,
        foto_url: fotoUsuario || undefined,
      })
      setSucesso('Usuário atualizado!')
      setTimeout(() => setSucesso(''), 3000)
      setEditandoUsuario(null)
      carregarUsuarios()
    } catch (err) {
      alert('Erro: ' + err.message)
    }
  }

  async function handleToggleLiga(usuarioId, ligaId, jaMembro) {
    try {
      if (jaMembro) {
        await api.delete(`/ligas/${ligaId}/membro`, { data: { usuarioId } })
      } else {
        await api.post(`/ligas/${ligaId}/membro`, { usuarioId })
      }
      carregarUsuarios()
    } catch (err) {
      alert('Erro: ' + err.message)
    }
  }

  async function handleCriarJogador(e) {
    e.preventDefault()
    try {
      await api.post('/jogadores', novoJogador)
      setSucesso('Jogador criado!')
      setTimeout(() => setSucesso(''), 3000)
      setNovoJogador({ nome: '', posicao: 'ATA', selecaoId: '', foto_url: '' })
      api.get('/jogadores').then((r) => setJogadoresList(r.data))
    } catch (err) {
      alert('Erro: ' + err.message)
    }
  }

  async function handleAtualizarJogador(id) {
    try {
      await api.put(`/jogadores/${id}`, jogadorEdit)
      setSucesso('Jogador atualizado!')
      setTimeout(() => setSucesso(''), 3000)
      setEditandoJogador(null)
      api.get('/jogadores').then((r) => setJogadoresList(r.data))
    } catch (err) {
      alert('Erro: ' + err.message)
    }
  }

  async function handleRemoverJogador(id, nome) {
    if (!window.confirm(`Remover ${nome}?`)) return
    try {
      await api.delete(`/jogadores/${id}`)
      setSucesso('Jogador removido!')
      setTimeout(() => setSucesso(''), 3000)
      api.get('/jogadores').then((r) => setJogadoresList(r.data))
    } catch (err) {
      alert('Erro: ' + err.message)
    }
  }

  const selectStyle = {
    background: '#0a0e1a', border: '1px solid #1e2d45',
    borderRadius: 8, color: '#f0f4ff',
    padding: '0.6rem 1rem', fontSize: '0.9rem', width: '100%', outline: 'none',
  }

  const inputStyle = {
    background: '#0a0e1a', border: '1px solid #1e2d45',
    borderRadius: 8, color: '#f0f4ff',
    padding: '0.6rem 1rem', fontSize: '0.9rem', outline: 'none',
  }

  const labelStyle = {
    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px',
    textTransform: 'uppercase', color: '#8b9bb4',
    marginBottom: '0.4rem', display: 'block',
  }

  const abaStyle = (a) => ({
    background: 'none', border: 'none',
    borderBottom: abaAtiva === a ? '2px solid #00a651' : '2px solid transparent',
    color: abaAtiva === a ? '#f0f4ff' : '#8b9bb4',
    fontFamily: 'var(--fonte-display)', fontSize: '0.95rem',
    letterSpacing: '1.5px', padding: '0.5rem 1rem', cursor: 'pointer',
  })

  const partidaSelecionada = partidas.find((p) => p.id === Number(partidaId))

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{
        fontFamily: 'var(--fonte-display)', fontSize: '2.5rem',
        letterSpacing: '3px', marginBottom: '0.25rem',
      }}>PAINEL ADMIN</h1>
      <p style={{ color: '#8b9bb4', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Gerencie partidas, eventos e seleções
      </p>

      {sucesso && (
        <div style={{
          background: '#022c1a', border: '1px solid #00a651',
          borderRadius: 8, padding: '0.75rem 1rem',
          color: '#00a651', fontWeight: 600, marginBottom: '1rem',
        }}>✅ {sucesso}</div>
      )}

      <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 12, overflow: 'hidden' }}>
        {/* Abas */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1e2d45', padding: '0 1rem', flexWrap: 'wrap' }}>
          <button style={abaStyle('partidas')}  onClick={() => setAbaAtiva('partidas')}>📅 PARTIDAS</button>
          <button style={abaStyle('eventos')}   onClick={() => setAbaAtiva('eventos')}>⚡ EVENTOS</button>
          <button style={abaStyle('jogadores')} onClick={() => setAbaAtiva('jogadores')}>👟 JOGADORES</button>
          <button style={abaStyle('selecoes')}  onClick={() => setAbaAtiva('selecoes')}>🛡️ SELEÇÕES</button>
          <button style={abaStyle('usuarios')}  onClick={() => { setAbaAtiva('usuarios'); carregarUsuarios() }}>👥 USUÁRIOS</button>
        </div>

        {/* ABA PARTIDAS */}
        {abaAtiva === 'partidas' && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Partidas cadastradas</label>
              
              {/* Mini-abas de Rodadas */}
              <div style={{ display: 'flex', gap: 8, marginTop: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {[
                  { num: 1, label: 'Rodada 1' },
                  { num: 2, label: 'Rodada 2' },
                  { num: 3, label: 'Rodada 3' },
                  { num: 4, label: '16avos' },
                ].map(({ num, label }) => (
                  <button
                    key={num}
                    onClick={() => setRodadaAdminAtiva(num)}
                    style={{
                      background: rodadaAdminAtiva === num ? '#00a651' : '#1e2d45',
                      color: rodadaAdminAtiva === num ? '#fff' : '#8b9bb4',
                      border: 'none',
                      borderRadius: 20, padding: '6px 16px',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {partidas
                  .filter(p => p.rodada === rodadaAdminAtiva)
                  .map((p) => (
                  <div key={p.id} style={{
                    background: '#0a0e1a', border: '1px solid #1e2d45',
                    borderRadius: 10, padding: '1rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                        {p.selecaoCasa?.escudo_url && (
                          <img src={p.selecaoCasa.escudo_url} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                        )}
                        <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1rem', color: '#f0f4ff' }}>
                          {p.selecaoCasa?.nome}
                        </span>
                        <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.2rem', color: '#f5d000', margin: '0 0.25rem' }}>
                          {p.placarCasa} × {p.placarFora}
                        </span>
                        <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1rem', color: '#f0f4ff' }}>
                          {p.selecaoFora?.nome}
                        </span>
                        {p.selecaoFora?.escudo_url && (
                          <img src={p.selecaoFora.escudo_url} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: STATUS_COR[p.status], letterSpacing: 1 }}>
                        {p.status}
                      </span>
                      <button onClick={() => {
                        setEditandoPartida(p.id)
                        setNovoStatus(p.status)
                        setNovoPlacarCasa(p.placarCasa)
                        setNovoPlacarFora(p.placarFora)
                      }} style={{
                        background: '#1e2d45', border: 'none', borderRadius: 8,
                        color: '#f0f4ff', padding: '0.4rem 0.75rem',
                        fontSize: '0.8rem', cursor: 'pointer',
                      }}>✏️ Editar</button>
                    </div>

                    {editandoPartida === p.id && (
                      <div style={{
                        marginTop: '1rem', paddingTop: '1rem',
                        borderTop: '1px solid #1e2d45',
                        display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end',
                      }}>
                        <div>
                          <label style={labelStyle}>Status</label>
                          <select value={novoStatus} onChange={(e) => {
                            const s = e.target.value
                            setNovoStatus(s)
                            if (s === 'AGENDADA') { setNovoPlacarCasa(0); setNovoPlacarFora(0) }
                          }}
                            style={{ ...selectStyle, width: 'auto' }}>
                            {STATUS_OPCOES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Placar Casa</label>
                          <input type="number" min={0} value={novoPlacarCasa}
                            onChange={(e) => setNovoPlacarCasa(e.target.value)}
                            style={{ ...inputStyle, width: 70, textAlign: 'center' }} />
                        </div>
                        <div>
                          <label style={labelStyle}>Placar Fora</label>
                          <input type="number" min={0} value={novoPlacarFora}
                            onChange={(e) => setNovoPlacarFora(e.target.value)}
                            style={{ ...inputStyle, width: 70, textAlign: 'center' }} />
                        </div>
                        <button onClick={() => handleAtualizarPartida(p.id)} style={{
                          background: '#00a651', color: '#fff', border: 'none',
                          borderRadius: 8, padding: '0.6rem 1.25rem', fontWeight: 700, cursor: 'pointer',
                        }}>SALVAR</button>
                        <button onClick={() => setEditandoPartida(null)} style={{
                          background: 'none', border: '1px solid #1e2d45',
                          borderRadius: 8, color: '#8b9bb4', padding: '0.6rem 1rem', cursor: 'pointer',
                        }}>Cancelar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nova partida */}
            <div style={{ borderTop: '1px solid #1e2d45', paddingTop: '1.5rem' }}>
              <label style={{ ...labelStyle, fontSize: '0.9rem', color: '#f0f4ff', marginBottom: '1rem' }}>
                ➕ Nova Partida
              </label>
              <form onSubmit={handleCriarPartida} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Seleção Casa</label>
                    <select value={novaPartida.selecaoCasaId}
                      onChange={(e) => setNovaPartida({ ...novaPartida, selecaoCasaId: e.target.value })}
                      style={selectStyle}>
                      <option value="">Selecione...</option>
                      {selecoes.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Seleção Fora</label>
                    <select value={novaPartida.selecaoForaId}
                      onChange={(e) => setNovaPartida({ ...novaPartida, selecaoForaId: e.target.value })}
                      style={selectStyle}>
                      <option value="">Selecione...</option>
                      {selecoes.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Data e Hora</label>
                    <input type="datetime-local" value={novaPartida.data}
                      onChange={(e) => setNovaPartida({ ...novaPartida, data: e.target.value })}
                      style={{ ...inputStyle, width: '100%' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Rodada</label>
                    <input type="number" min={1} value={novaPartida.rodada}
                      onChange={(e) => setNovaPartida({ ...novaPartida, rodada: e.target.value })}
                      style={{ ...inputStyle, width: 80 }} />
                  </div>
                </div>
                <button type="submit" disabled={criandoPartida} style={{
                  background: '#00a651', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '0.75rem', fontWeight: 700,
                  fontSize: '0.95rem', cursor: 'pointer', alignSelf: 'flex-start', minWidth: 160,
                }}>
                  {criandoPartida ? 'Criando...' : '➕ CRIAR PARTIDA'}
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ABA EVENTOS */}
        {abaAtiva === 'eventos' && (
          <div style={{ padding: '1.5rem' }}>
            <form onSubmit={handleEvento} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Partida</label>
                <select value={partidaId} onChange={(e) => setPartidaId(e.target.value)} style={selectStyle}>
                  <option value="">Selecione uma partida...</option>
                  {partidas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.selecaoCasa?.nome} {p.placarCasa} × {p.placarFora} {p.selecaoFora?.nome} — {p.status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Jogador</label>
                <select value={jogadorId} onChange={(e) => setJogadorId(e.target.value)}
                  style={selectStyle} disabled={!partidaId}>
                  <option value="">Selecione um jogador...</option>
                  {jogadores.map((j) => (
                    <option key={j.id} value={j.id}>{j.nome} — {j.selecao?.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tipo de Evento</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {TIPOS.map((t) => (
                    <button key={t.value} type="button" onClick={() => setTipo(t.value)} style={{
                      background: tipo === t.value ? t.cor : '#0a0e1a',
                      border: `1px solid ${tipo === t.value ? t.cor : '#1e2d45'}`,
                      borderRadius: 8, color: tipo === t.value ? '#000' : '#f0f4ff',
                      padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                    }}>{t.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Minuto</label>
                <input type="number" min={1} max={120} value={minuto}
                  onChange={(e) => setMinuto(e.target.value)}
                  placeholder="Ex: 45" style={{ ...inputStyle, width: 120 }} />
              </div>
              <button type="submit" disabled={enviando} style={{
                background: '#00a651', color: '#fff', border: 'none',
                borderRadius: 8, padding: '0.75rem', fontWeight: 700,
                fontSize: '1rem', letterSpacing: 1, opacity: enviando ? 0.6 : 1,
                alignSelf: 'flex-start', minWidth: 200, cursor: 'pointer',
              }}>
                {enviando ? 'Registrando...' : '✔ REGISTRAR EVENTO'}
              </button>
            </form>

            {eventos.length > 0 && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #1e2d45', paddingTop: '1.5rem' }}>
                <label style={labelStyle}>Eventos da partida</label>
                {partidaSelecionada && (
                  <div style={{ color: '#8b9bb4', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    {partidaSelecionada.selecaoCasa?.nome} {partidaSelecionada.placarCasa} × {partidaSelecionada.placarFora} {partidaSelecionada.selecaoFora?.nome}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {eventos.map((ev) => {
                    const ICONES = {
                      GOL: { icon: '⚽', cor: '#00a651' },
                      ASSISTENCIA: { icon: '🎯', cor: '#f5d000' },
                      AMARELO: { icon: '🟨', cor: '#f5d000' },
                      VERMELHO: { icon: '🟥', cor: '#e8192c' },
                    }
                    const cfg = ICONES[ev.tipo] || { icon: '📌', cor: '#8b9bb4' }
                    return (
                      <div key={ev.id} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        background: '#0a0e1a', border: '1px solid #1e2d45',
                        borderLeft: `3px solid ${cfg.cor}`,
                        borderRadius: 8, padding: '0.5rem 1rem',
                      }}>
                        <span>{cfg.icon}</span>
                        <span style={{ flex: 1, fontWeight: 600 }}>{ev.jogador?.nome}</span>
                        <span style={{ color: '#8b9bb4', fontSize: '0.8rem' }}>{ev.jogador?.selecao?.nome}</span>
                        <span style={{ fontFamily: 'var(--fonte-display)', color: cfg.cor }}>{ev.minuto}'</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABA JOGADORES */}
        {abaAtiva === 'jogadores' && (
          <div style={{ padding: '1.5rem' }}>
            {/* Formulário novo jogador */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ ...labelStyle, fontSize: '0.9rem', color: '#f0f4ff', marginBottom: '1rem', display: 'block' }}>
                ➕ Novo Jogador
              </label>
              <form onSubmit={handleCriarJogador} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 2, minWidth: 150 }}>
                  <label style={labelStyle}>Nome</label>
                  <input value={novoJogador.nome}
                    onChange={(e) => setNovoJogador({ ...novoJogador, nome: e.target.value })}
                    placeholder="Ex: Vinicius Jr"
                    style={{ ...inputStyle, width: '100%' }} />
                </div>
                <div>
                  <label style={labelStyle}>Posição</label>
                  <select value={novoJogador.posicao}
                    onChange={(e) => setNovoJogador({ ...novoJogador, posicao: e.target.value })}
                    style={{ ...selectStyle, width: 'auto' }}>
                    <option value="GOL">GOL</option>
                    <option value="DEF">DEF</option>
                    <option value="MEI">MEI</option>
                    <option value="ATA">ATA</option>
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <label style={labelStyle}>Seleção</label>
                  <select value={novoJogador.selecaoId}
                    onChange={(e) => setNovoJogador({ ...novoJogador, selecaoId: e.target.value })}
                    style={selectStyle}>
                    <option value="">Selecione...</option>
                    {selecoes.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
                  </select>
                </div>
                <div style={{ flex: 2, minWidth: 150 }}>
                  <label style={labelStyle}>URL da Foto (opcional)</label>
                  <input value={novoJogador.foto_url}
                    onChange={(e) => setNovoJogador({ ...novoJogador, foto_url: e.target.value })}
                    placeholder="https://..."
                    style={{ ...inputStyle, width: '100%' }} />
                </div>
                <button type="submit" style={{
                  background: '#00a651', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '0.6rem 1.25rem',
                  fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>➕ ADICIONAR</button>
              </form>
            </div>

            {/* Filtro por seleção */}
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={labelStyle}>Filtrar:</label>
              <select value={filtroSelecao} onChange={(e) => setFiltroSelecao(e.target.value)}
                style={{ ...selectStyle, width: 'auto' }}>
                <option value="">Todas as seleções</option>
                {selecoes.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
              <span style={{ fontSize: '0.8rem', color: '#8b9bb4' }}>
                {jogadoresList.filter((j) => !filtroSelecao || j.selecaoId === Number(filtroSelecao)).length} jogadores
              </span>
            </div>

            {/* Lista de jogadores */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 500, overflowY: 'auto' }}>
              {jogadoresList
                .filter((j) => !filtroSelecao || j.selecaoId === Number(filtroSelecao))
                .map((j) => (
                  <div key={j.id} style={{
                    background: '#0a0e1a', border: '1px solid #1e2d45',
                    borderRadius: 8, padding: '0.75rem 1rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {j.foto_url ? (
                        <img src={j.foto_url} alt={j.nome} style={{
                          width: 36, height: 36, borderRadius: '50%',
                          objectFit: 'cover', border: `2px solid ${COR_POSICAO[j.posicao]}`,
                        }} />
                      ) : (
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: '#1e2d45', border: `2px solid ${COR_POSICAO[j.posicao]}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700, color: COR_POSICAO[j.posicao],
                        }}>
                          {j.nome.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 700, color: '#f0f4ff' }}>{j.nome}</span>
                        <span style={{ marginLeft: 8, fontSize: '0.8rem', color: '#8b9bb4' }}>{j.selecao?.nome}</span>
                      </div>
                      <span style={{
                        background: '#1e2d45', borderRadius: 4,
                        padding: '0.15rem 0.5rem', fontSize: '0.75rem',
                        fontWeight: 700, color: COR_POSICAO[j.posicao],
                      }}>{j.posicao}</span>
                      <span style={{
                        fontFamily: 'var(--fonte-display)', fontSize: '1rem',
                        color: '#f5d000', minWidth: 40, textAlign: 'right',
                      }}>{j.preco}cr</span>
                      <button onClick={() => {
                        setEditandoJogador(j.id)
                        setJogadorEdit({ nome: j.nome, posicao: j.posicao, foto_url: j.foto_url || '' })
                      }} style={{
                        background: '#1e2d45', border: 'none', borderRadius: 6,
                        color: '#f0f4ff', padding: '0.3rem 0.6rem',
                        fontSize: '0.75rem', cursor: 'pointer',
                      }}>✏️</button>
                      <button onClick={() => handleRemoverJogador(j.id, j.nome)} style={{
                        background: '#1a0000', border: '1px solid #e8192c', borderRadius: 6,
                        color: '#e8192c', padding: '0.3rem 0.6rem',
                        fontSize: '0.75rem', cursor: 'pointer',
                      }}>🗑️</button>
                    </div>

                    {editandoJogador === j.id && (
                      <div style={{
                        marginTop: '0.75rem', paddingTop: '0.75rem',
                        borderTop: '1px solid #1e2d45',
                        display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end',
                      }}>
                        <div style={{ flex: 2 }}>
                          <label style={labelStyle}>Nome</label>
                          <input value={jogadorEdit.nome}
                            onChange={(e) => setJogadorEdit({ ...jogadorEdit, nome: e.target.value })}
                            style={{ ...inputStyle, width: '100%' }} />
                        </div>
                        <div>
                          <label style={labelStyle}>Posição</label>
                          <select value={jogadorEdit.posicao}
                            onChange={(e) => setJogadorEdit({ ...jogadorEdit, posicao: e.target.value })}
                            style={{ ...selectStyle, width: 'auto' }}>
                            <option value="GOL">GOL</option>
                            <option value="DEF">DEF</option>
                            <option value="MEI">MEI</option>
                            <option value="ATA">ATA</option>
                          </select>
                        </div>
                        <div style={{ flex: 2 }}>
                          <label style={labelStyle}>URL da Foto</label>
                          <input value={jogadorEdit.foto_url}
                            onChange={(e) => setJogadorEdit({ ...jogadorEdit, foto_url: e.target.value })}
                            placeholder="https://..."
                            style={{ ...inputStyle, width: '100%' }} />
                        </div>
                        <button onClick={() => handleAtualizarJogador(j.id)} style={{
                          background: '#00a651', color: '#fff', border: 'none',
                          borderRadius: 8, padding: '0.6rem 1rem', fontWeight: 700, cursor: 'pointer',
                        }}>SALVAR</button>
                        <button onClick={() => setEditandoJogador(null)} style={{
                          background: 'none', border: '1px solid #1e2d45',
                          borderRadius: 8, color: '#8b9bb4', padding: '0.6rem 1rem', cursor: 'pointer',
                        }}>Cancelar</button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ABA SELEÇÕES */}
        {abaAtiva === 'selecoes' && (
          <div style={{ padding: '1.5rem' }}>
            <label style={labelStyle}>Editar seleções</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 600, overflowY: 'auto' }}>
              {selecoes.map((s) => (
                <div key={s.id} style={{
                  background: '#0a0e1a', border: '1px solid #1e2d45',
                  borderRadius: 10, padding: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {s.escudo_url ? (
                      <img src={s.escudo_url} alt={s.nome} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                    ) : (
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: '#1e2d45', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#8b9bb4', fontSize: '1.2rem',
                      }}>🛡️</div>
                    )}
                    <span style={{ flex: 1, fontWeight: 700, color: '#f0f4ff' }}>{s.nome}</span>
                    <button onClick={() => {
                      setEditandoSelecao(s.id)
                      setNovoEscudo(s.escudo_url || '')
                      setNovoNomeSelecao(s.nome)
                    }} style={{
                      background: '#1e2d45', border: 'none', borderRadius: 8,
                      color: '#f0f4ff', padding: '0.4rem 0.75rem',
                      fontSize: '0.8rem', cursor: 'pointer',
                    }}>✏️ Editar</button>
                  </div>

                  {editandoSelecao === s.id && (
                    <div style={{
                      marginTop: '1rem', paddingTop: '1rem',
                      borderTop: '1px solid #1e2d45',
                      display: 'flex', flexDirection: 'column', gap: '0.75rem',
                    }}>
                      <div>
                        <label style={labelStyle}>Nome</label>
                        <input value={novoNomeSelecao} onChange={(e) => setNovoNomeSelecao(e.target.value)}
                          style={{ ...inputStyle, width: '100%' }} />
                      </div>
                      <div>
                        <label style={labelStyle}>URL do escudo/logo</label>
                        <input value={novoEscudo} onChange={(e) => setNovoEscudo(e.target.value)}
                          placeholder="https://..." style={{ ...inputStyle, width: '100%' }} />
                      </div>
                      {novoEscudo && (
                        <img src={novoEscudo} alt="preview"
                          onError={(e) => e.target.style.display = 'none'}
                          style={{ width: 60, height: 60, objectFit: 'contain', border: '1px solid #1e2d45', borderRadius: 8, padding: 4 }} />
                      )}
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => handleAtualizarSelecao(s.id)} style={{
                          background: '#00a651', color: '#fff', border: 'none',
                          borderRadius: 8, padding: '0.6rem 1.25rem', fontWeight: 700, cursor: 'pointer',
                        }}>SALVAR</button>
                        <button onClick={() => setEditandoSelecao(null)} style={{
                          background: 'none', border: '1px solid #1e2d45',
                          borderRadius: 8, color: '#8b9bb4', padding: '0.6rem 1rem', cursor: 'pointer',
                        }}>Cancelar</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA USUÁRIOS */}
        {abaAtiva === 'usuarios' && (
          <div style={{ padding: '1.5rem' }}>
            <label style={labelStyle}>Usuários cadastrados</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {usuarios.map((u) => {
                const iniciais = u.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
                return (
                  <div key={u.id} style={{
                    background: '#0a0e1a', border: '1px solid #1e2d45',
                    borderRadius: 10, padding: '1rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {u.foto_url ? (
                        <img src={u.foto_url} alt={u.nome} style={{
                          width: 44, height: 44, borderRadius: '50%',
                          objectFit: 'cover', border: '2px solid #1e2d45',
                        }} />
                      ) : (
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: '#0a1a10', border: '2px solid #00a651',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '1rem', color: '#00a651',
                        }}>{iniciais}</div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#f0f4ff' }}>{u.nome}</div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 4, flexWrap: 'wrap' }}>
                          {u.ligas.map((ml) => (
                            <span key={ml.liga.id} style={{
                              background: '#001a0e', border: '1px solid #00a651',
                              borderRadius: 20, padding: '0.1rem 0.6rem',
                              fontSize: '0.75rem', color: '#00a651',
                            }}>{ml.liga.nome}</span>
                          ))}
                          {u.ligas.length === 0 && (
                            <span style={{ fontSize: '0.75rem', color: '#8b9bb4' }}>Sem liga</span>
                          )}
                        </div>
                      </div>
                      {u.isAdmin && (
                        <span style={{
                          background: '#1a1500', border: '1px solid #f5d000',
                          borderRadius: 6, padding: '0.2rem 0.6rem',
                          fontSize: '0.7rem', color: '#f5d000', fontWeight: 700,
                        }}>ADMIN</span>
                      )}
                      <button onClick={() => {
                        setEditandoUsuario(u.id)
                        setNomeUsuario(u.nome)
                        setFotoUsuario(u.foto_url || '')
                      }} style={{
                        background: '#1e2d45', border: 'none', borderRadius: 8,
                        color: '#f0f4ff', padding: '0.4rem 0.75rem',
                        fontSize: '0.8rem', cursor: 'pointer',
                      }}>✏️ Editar</button>
                    </div>

                    {editandoUsuario === u.id && (
                      <div style={{
                        marginTop: '1rem', paddingTop: '1rem',
                        borderTop: '1px solid #1e2d45',
                        display: 'flex', flexDirection: 'column', gap: '1rem',
                      }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Nome</label>
                            <input value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)}
                              style={{ ...inputStyle, width: '100%' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>URL da foto</label>
                            <input value={fotoUsuario} onChange={(e) => setFotoUsuario(e.target.value)}
                              placeholder="https://..." style={{ ...inputStyle, width: '100%' }} />
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>Ligas</label>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {ligas.map((liga) => {
                              const jaMembro = u.ligas.some((ml) => ml.liga.id === liga.id)
                              return (
                                <button key={liga.id}
                                  onClick={() => handleToggleLiga(u.id, liga.id, jaMembro)}
                                  style={{
                                    background: jaMembro ? '#00a651' : '#0a0e1a',
                                    border: `1px solid ${jaMembro ? '#00a651' : '#1e2d45'}`,
                                    borderRadius: 8, color: jaMembro ? '#fff' : '#8b9bb4',
                                    padding: '0.4rem 1rem', cursor: 'pointer',
                                    fontWeight: 700, fontSize: '0.85rem',
                                  }}>
                                  {jaMembro ? '✓ ' : '+ '}{liga.nome}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button onClick={() => handleAtualizarUsuario(u.id)} style={{
                            background: '#00a651', color: '#fff', border: 'none',
                            borderRadius: 8, padding: '0.6rem 1.25rem', fontWeight: 700, cursor: 'pointer',
                          }}>SALVAR</button>
                          <button onClick={() => setEditandoUsuario(null)} style={{
                            background: 'none', border: '1px solid #1e2d45',
                            borderRadius: 8, color: '#8b9bb4', padding: '0.6rem 1rem', cursor: 'pointer',
                          }}>Cancelar</button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
