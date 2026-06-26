import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import Placar from '../components/Placar'
import Timeline from '../components/Timeline'
import confetti from 'canvas-confetti'
import html2canvas from 'html2canvas'

export default function Partida() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const USUARIO_ID = usuario?.id
  const navigate = useNavigate()
  const [partida, setPartida] = useState(null)
  const [eventos, setEventos] = useState([])
  const [jogadores, setJogadores] = useState([])
  const [aposta, setAposta] = useState({ placarCasa: '', placarFora: '' })
  const [apostaFeita, setApostaFeita] = useState(null)
  const [vencedorAposta, setVencedorAposta] = useState(null)
  const [vencedorFeito, setVencedorFeito] = useState(null)
  const [goleadoresSelecionados, setGoleadoresSelecionados] = useState([])
  const [goleadoresFeitos, setGoleadoresFeitos] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [enviandoVencedor, setEnviandoVencedor] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState('vencedor')
  const [rodadaAberta, setRodadaAberta] = useState(true)
  const [feedApostas, setFeedApostas] = useState([])
  const [compartilhando, setCompartilhando] = useState(false)
  const [todasPartidas, setTodasPartidas] = useState([])
  const shareCardRef = useRef(null)
  const confettiFired = useRef(false)

  useEffect(() => {
    api.get('/partidas').then((r) => {
      const copa = r.data
        .filter((p) => p.rodada >= 1 && p.rodada <= 3)
        .sort((a, b) => new Date(a.data) - new Date(b.data))
      setTodasPartidas(copa)
    })
    api.get(`/partidas/${id}`).then((r) => setPartida(r.data))
    api.get(`/eventos/${id}`).then((r) => setEventos(r.data))
    api.get(`/partidas/${id}/jogadores`).then((r) => setJogadores(r.data))
    api.get(`/apostas/${id}`).then((r) => setFeedApostas(r.data)).catch(() => {})

    if (USUARIO_ID) {
      api.get(`/apostas/usuario/${USUARIO_ID}/${id}`)
        .then((r) => {
          if (r.data) {
            setApostaFeita({
              placarCasa: r.data.placarCasa,
              placarFora: r.data.placarFora,
            })
            // DB é fonte de verdade — sincroniza localStorage
            if (r.data.vencedor) {
              setVencedorFeito(r.data.vencedor)
              localStorage.setItem(`vencedor_${id}`, r.data.vencedor)
            }
          }
        })
        .catch(() => {})
    }

    const vencedorSalvo = localStorage.getItem(`vencedor_${id}`)
    if (vencedorSalvo) setVencedorFeito(vencedorSalvo)

    const goleadoresSalvos = localStorage.getItem(`goleadores_${id}`)
    if (goleadoresSalvos) setGoleadoresFeitos(JSON.parse(goleadoresSalvos))
  }, [id, USUARIO_ID])

  useEffect(() => {
    if (!partida) return
    api.get('/rodadas').then((r) => {
      const rodada = r.data.find((rd) => rd.numero === partida.rodada)
      if (rodada) setRodadaAberta(rodada.apostasAbertas)
    })
  }, [partida])

  // Confetti quando acertou placar exato
  useEffect(() => {
    if (!partida || confettiFired.current) return
    if (partida.status === 'FINALIZADA' && apostaFeita &&
      apostaFeita.placarCasa === partida.placarCasa &&
      apostaFeita.placarFora === partida.placarFora) {
      confettiFired.current = true
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#00a651', '#f5d000', '#e8192c', '#fff'] })
      }, 600)
    }
  }, [partida, apostaFeita])

  const finalizada = partida?.status === 'FINALIZADA'
  const aoVivo = partida?.status === 'AO_VIVO'
  const podeApostar = !finalizada && !aoVivo

  const idxAtual = todasPartidas.findIndex((p) => p.id === Number(id))
  const partidaAnterior = idxAtual > 0 ? todasPartidas[idxAtual - 1] : null
  const proximaPartida = idxAtual >= 0 && idxAtual < todasPartidas.length - 1 ? todasPartidas[idxAtual + 1] : null

  const acertouPlacar = apostaFeita && finalizada &&
    apostaFeita.placarCasa === partida?.placarCasa &&
    apostaFeita.placarFora === partida?.placarFora

  const vencedorReal = partida
    ? partida.placarCasa > partida.placarFora ? 'casa'
    : partida.placarFora > partida.placarCasa ? 'fora' : 'empate'
    : null

  const acertouVencedor = vencedorFeito && finalizada && vencedorFeito === vencedorReal

  async function handleVencedor(opcao) {
    if (vencedorFeito || !podeApostar || enviandoVencedor) return
    setVencedorAposta(opcao)
    setEnviandoVencedor(true)
    try {
      await api.post('/apostas/vencedor', {
        usuarioId: USUARIO_ID,
        partidaId: Number(id),
        vencedor: opcao,
      })
      localStorage.setItem(`vencedor_${id}`, opcao)
      setVencedorFeito(opcao)
    } catch (err) {
      alert('Erro ao registrar aposta de vencedor: ' + err.message)
      setVencedorAposta(null)
    } finally {
      setEnviandoVencedor(false)
    }
  }

  async function handleAposta(e) {
    e.preventDefault()
    if (aposta.placarCasa === '' || aposta.placarFora === '') return
    const placarCasa = Math.max(0, Number(aposta.placarCasa))
    const placarFora = Math.max(0, Number(aposta.placarFora))
    const vencedor = placarCasa > placarFora ? 'casa' : placarFora > placarCasa ? 'fora' : 'empate'
    setEnviando(true)
    try {
      await api.post('/aposta', {
        usuarioId: USUARIO_ID,
        partidaId: Number(id),
        placarCasa,
        placarFora,
      })
      const feita = {
        placarCasa: Number(aposta.placarCasa),
        placarFora: Number(aposta.placarFora),
      }
      setApostaFeita(feita)
      setVencedorFeito(vencedor)
      localStorage.setItem(`vencedor_${id}`, vencedor)
    } catch (err) {
      alert('Erro ao registrar aposta: ' + err.message)
    } finally {
      setEnviando(false)
    }
  }

  async function handleGoleadores(e) {
    e.preventDefault()
    if (goleadoresSelecionados.length === 0) return
    setEnviando(true)
    try {
      await api.post('/aposta-goleador', {
        usuarioId: USUARIO_ID,
        partidaId: Number(id),
        jogadorIds: goleadoresSelecionados,
      })
      const nomes = jogadores
        .filter((j) => goleadoresSelecionados.includes(j.id))
        .map((j) => j.nome)
      localStorage.setItem(`goleadores_${id}`, JSON.stringify(nomes))
      setGoleadoresFeitos(nomes)
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setEnviando(false)
    }
  }

  function toggleGoleador(jogadorId) {
    setGoleadoresSelecionados((prev) =>
      prev.includes(jogadorId) ? prev.filter((i) => i !== jogadorId) : [...prev, jogadorId]
    )
  }

  async function toDataURL(url) {
    if (!url) return null
    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const proxied = `${API_URL}/proxy-image?url=${encodeURIComponent(url)}`
      const res = await fetch(proxied)
      if (!res.ok) return null
      const blob = await res.blob()
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(blob)
      })
    } catch { return null }
  }

  async function handleCompartilhar() {
    if (!shareCardRef.current) return
    setCompartilhando(true)
    try {
      // Converte todas as imagens do card para base64 antes do html2canvas
      // (evita bloqueio de CORS para imagens externas — Supabase, Wikimedia etc.)
      const imgs = shareCardRef.current.querySelectorAll('img')
      const origSrcs = Array.from(imgs).map((img) => img.src)
      await Promise.all(Array.from(imgs).map(async (img) => {
        const b64 = await toDataURL(img.src)
        if (b64) img.src = b64
      }))

      const canvas = await html2canvas(shareCardRef.current, { backgroundColor: null, scale: 2 })

      // Restaura os srcs originais para não sujar o DOM
      Array.from(imgs).forEach((img, i) => { img.src = origSrcs[i] })

      canvas.toBlob(async (blob) => {
        if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'palpite.png', { type: 'image/png' })] })) {
          await navigator.share({ files: [new File([blob], 'palpite.png', { type: 'image/png' })], title: 'Meu palpite — Bolão Copa 2026' })
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url; a.download = 'meu-palpite.png'; a.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } catch (err) {
      console.error('Erro ao compartilhar:', err)
    } finally {
      setCompartilhando(false)
    }
  }

  if (!partida) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#8b9bb4' }}>Carregando...</div>
  )

  const inputStyle = {
    width: 70, background: '#0a0e1a', border: '1px solid #1e2d45',
    borderRadius: 8, color: '#f0f4ff', fontSize: '1.5rem',
    fontFamily: 'var(--fonte-display)', textAlign: 'center',
    padding: '0.5rem', outline: 'none',
  }

  const abaStyle = (a) => ({
    background: 'none', border: 'none',
    borderBottom: abaAtiva === a ? '2px solid #00a651' : '2px solid transparent',
    color: abaAtiva === a ? '#f0f4ff' : '#8b9bb4',
    fontFamily: 'var(--fonte-display)', fontSize: '0.95rem',
    letterSpacing: '1.5px', padding: '0.5rem 1rem', cursor: 'pointer',
  })

  const msgBloqueio = (
    <div style={{
      background: '#1a0a0a', border: '1px solid #e8192c',
      borderRadius: 8, padding: '0.75rem 1rem',
      color: '#e8192c', fontWeight: 600, fontSize: '0.9rem',
    }}>
      🔒 {finalizada
        ? 'Partida finalizada — apostas encerradas'
        : aoVivo
        ? 'Jogo em andamento — apostas encerradas'
        : 'Apostas encerradas'}
    </div>
  )

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/', { state: { rodada: partida?.rodada } })} style={{
          background: 'none', border: '1px solid #1e2d45', color: '#8b9bb4',
          fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4,
          cursor: 'pointer', borderRadius: 8, padding: '0.4rem 0.75rem',
        }}>← Início</button>

        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
          {partidaAnterior && (
            <button onClick={() => navigate(`/partida/${partidaAnterior.id}`)} style={{
              background: '#0a0e1a', border: '1px solid #1e2d45', color: '#8b9bb4',
              fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4,
              cursor: 'pointer', borderRadius: 8, padding: '0.4rem 0.75rem',
              whiteSpace: 'nowrap',
            }}>
              ← {partidaAnterior.selecaoCasa?.nome?.split(' ')[0]} × {partidaAnterior.selecaoFora?.nome?.split(' ')[0]}
            </button>
          )}
          {proximaPartida && (
            <button onClick={() => navigate(`/partida/${proximaPartida.id}`)} style={{
              background: '#00a651', border: 'none', color: '#fff',
              fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4,
              cursor: 'pointer', borderRadius: 8, padding: '0.4rem 0.75rem',
              fontWeight: 700, whiteSpace: 'nowrap',
            }}>
              {proximaPartida.selecaoCasa?.nome?.split(' ')[0]} × {proximaPartida.selecaoFora?.nome?.split(' ')[0]} →
            </button>
          )}
        </div>
      </div>

      {/* Placar */}
      <div style={{
        background: '#111827', border: '1px solid #1e2d45',
        borderRadius: 12, padding: '2rem', marginBottom: '1.5rem', textAlign: 'center',
      }}>
        <Placar partida={partida} grande />
      </div>

      {/* Resultado das apostas */}
      {finalizada && (apostaFeita || vencedorFeito) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {vencedorFeito && (
            <div style={{
              background: acertouVencedor ? '#022c1a' : '#1f0a0a',
              border: `1px solid ${acertouVencedor ? '#00a651' : '#e8192c'}`,
              borderRadius: 12, padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{acertouVencedor ? '✅' : '❌'}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--fonte-display)', fontSize: '1.1rem',
                  letterSpacing: '2px', color: acertouVencedor ? '#00a651' : '#e8192c',
                }}>
                  {acertouVencedor ? 'VENCEDOR CERTO!' : 'VENCEDOR ERRADO!'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#8b9bb4', marginTop: 2 }}>
                  Você apostou: {vencedorFeito === 'casa' ? partida.selecaoCasa?.nome : vencedorFeito === 'fora' ? partida.selecaoFora?.nome : 'Empate'}
                  {' · '}
                  Resultado: {vencedorReal === 'casa' ? partida.selecaoCasa?.nome : vencedorReal === 'fora' ? partida.selecaoFora?.nome : 'Empate'}
                </div>
              </div>
              {acertouVencedor && (
                <div style={{
                  background: '#00a651', borderRadius: 8,
                  padding: '0.4rem 0.75rem', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.4rem', color: '#fff' }}>+1</div>
                  <div style={{ fontSize: '0.65rem', color: '#d4f5e9', letterSpacing: 1 }}>PTS</div>
                </div>
              )}
            </div>
          )}

          {apostaFeita && apostaFeita.placarCasa >= 0 && apostaFeita.placarFora >= 0 && (
            <div style={{
              background: acertouPlacar ? '#022c1a' : '#1f0a0a',
              border: `1px solid ${acertouPlacar ? '#00a651' : '#e8192c'}`,
              borderRadius: 12, padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{acertouPlacar ? '✅' : '❌'}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--fonte-display)', fontSize: '1.1rem',
                  letterSpacing: '2px', color: acertouPlacar ? '#00a651' : '#e8192c',
                }}>
                  {acertouPlacar ? 'PLACAR EXATO!' : 'PLACAR ERRADO!'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#8b9bb4', marginTop: 2 }}>
                  {acertouPlacar
                    ? `Placar correto: ${partida.placarCasa} × ${partida.placarFora}`
                    : `Você apostou: ${apostaFeita.placarCasa} × ${apostaFeita.placarFora} · Resultado: ${partida.placarCasa} × ${partida.placarFora}`
                  }
                </div>
              </div>
              {acertouPlacar && (
                <div style={{
                  background: '#00a651', borderRadius: 8,
                  padding: '0.4rem 0.75rem', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--fonte-display)', fontSize: '1.4rem', color: '#fff' }}>+3</div>
                  <div style={{ fontSize: '0.65rem', color: '#d4f5e9', letterSpacing: 1 }}>PTS</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Share card (invisível, usado pelo html2canvas) */}
      {apostaFeita && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}>
          <div ref={shareCardRef} style={{
            width: 400, background: 'linear-gradient(160deg, #0d1f14 0%, #050d1f 100%)',
            fontFamily: 'Inter, sans-serif', overflow: 'hidden',
          }}>
            <div style={{ background: '#00a651', height: 6 }} />

            <div style={{ padding: '1.75rem 1.75rem 1.5rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#00a651', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1.25rem', fontWeight: 700 }}>
                🏆 Bolão Copa 2026
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {usuario?.foto_url ? (
                  <img src={usuario.foto_url} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #00a651' }} />
                ) : (
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#0a1a10', border: '2px solid #00a651', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00a651', fontWeight: 700, fontSize: '1.2rem' }}>
                    {usuario?.nome?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1.05rem' }}>{usuario?.nome}</div>
                  <div style={{ color: '#8b9bb4', fontSize: '0.72rem', marginTop: 2 }}>meu palpite</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                  {partida.selecaoCasa?.escudo_url && <img src={partida.selecaoCasa.escudo_url} alt="" style={{ width: 52, height: 52, objectFit: 'contain' }} />}
                  <span style={{ color: '#f0f4ff', fontSize: '0.78rem', fontWeight: 600, textAlign: 'center' }}>{partida.selecaoCasa?.nome}</span>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ color: '#f0f4ff', fontSize: '2.4rem', fontWeight: 800, lineHeight: 1 }}>
                    {apostaFeita.placarCasa >= 0 ? `${apostaFeita.placarCasa} × ${apostaFeita.placarFora}` : '– × –'}
                  </div>
                  <div style={{ color: '#8b9bb4', fontSize: '0.6rem', letterSpacing: 2, marginTop: 4 }}>
                    {finalizada ? 'RESULTADO FINAL' : 'MEU PALPITE'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                  {partida.selecaoFora?.escudo_url && <img src={partida.selecaoFora.escudo_url} alt="" style={{ width: 52, height: 52, objectFit: 'contain' }} />}
                  <span style={{ color: '#f0f4ff', fontSize: '0.78rem', fontWeight: 600, textAlign: 'center' }}>{partida.selecaoFora?.nome}</span>
                </div>
              </div>

              {finalizada ? (
                <div style={{
                  background: acertouPlacar ? '#022c1a' : acertouVencedor ? '#05153d' : '#1f0a0a',
                  border: `1.5px solid ${acertouPlacar ? '#00a651' : acertouVencedor ? '#3b82f6' : '#e8192c'}`,
                  borderRadius: 14, padding: '1rem', textAlign: 'center',
                }}>
                  <div style={{ color: acertouPlacar ? '#00a651' : acertouVencedor ? '#60a5fa' : '#e8192c', fontWeight: 800, fontSize: '1.15rem', letterSpacing: 1 }}>
                    {acertouPlacar ? '🎯 PLACAR EXATO!' : acertouVencedor ? '✅ VENCEDOR CERTO!' : '❌ DESSA VEZ NÃO...'}
                  </div>
                  <div style={{ color: '#8b9bb4', fontSize: '0.8rem', marginTop: 6 }}>
                    Resultado: <strong style={{ color: '#f0f4ff' }}>{partida.placarCasa} × {partida.placarFora}</strong>
                    {acertouPlacar && <span style={{ color: '#00a651', marginLeft: 8, fontWeight: 700 }}>+3 pts</span>}
                    {acertouVencedor && <span style={{ color: '#60a5fa', marginLeft: 8, fontWeight: 700 }}>+1 pt</span>}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: '#05153d', border: '1.5px solid #3b82f6',
                  borderRadius: 14, padding: '1rem', textAlign: 'center',
                }}>
                  <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: '1.15rem', letterSpacing: 1 }}>⏳ AGUARDANDO O JOGO</div>
                  <div style={{ color: '#8b9bb4', fontSize: '0.8rem', marginTop: 6 }}>Esse é o meu palpite — e o seu?</div>
                </div>
              )}
            </div>

            <div style={{ background: 'linear-gradient(90deg, #f5d000, #f59e0b)', height: 4 }} />
          </div>
        </div>
      )}

      {/* Abas de aposta */}
      <div style={{
        background: '#111827', border: '1px solid #1e2d45',
        borderRadius: 12, marginBottom: '1.5rem', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #1e2d45', padding: '0 1rem' }}>
          <button style={abaStyle('vencedor')} onClick={() => setAbaAtiva('vencedor')}>🏆 QUEM VENCE?</button>
          <button style={abaStyle('placar')} onClick={() => setAbaAtiva('placar')}>🎯 PLACAR EXATO</button>
          <button style={abaStyle('goleadores')} onClick={() => setAbaAtiva('goleadores')}>⚽ GOLEADORES</button>
        </div>

        <div style={{ padding: '1.5rem' }}>

          {/* ABA VENCEDOR */}
          {abaAtiva === 'vencedor' && (
            <>
              <p style={{ color: '#8b9bb4', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Quem você acha que vai vencer? Acerte e ganhe <strong style={{ color: '#f5d000' }}>+1pts</strong>
              </p>

              {vencedorFeito ? (
                <div style={{
                  background: '#0a1a10', border: '1px solid #00a651',
                  borderRadius: 8, padding: '0.75rem 1rem',
                  color: '#00a651', fontWeight: 600,
                }}>
                  ✅ Você apostou em: <strong>
                    {vencedorFeito === 'casa' ? partida.selecaoCasa?.nome
                      : vencedorFeito === 'fora' ? partida.selecaoFora?.nome
                      : 'Empate'}
                  </strong>
                  {podeApostar && (
                    <button onClick={() => { setVencedorFeito(null); localStorage.removeItem(`vencedor_${id}`) }}
                      style={{
                        marginLeft: '1rem', background: 'none',
                        border: '1px solid #1e2d45', borderRadius: 6,
                        color: '#8b9bb4', padding: '0.2rem 0.6rem',
                        fontSize: '0.75rem', cursor: 'pointer',
                      }}>Alterar</button>
                  )}
                </div>
              ) : !podeApostar ? msgBloqueio : (
                <>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {[
                      { key: 'casa', label: partida.selecaoCasa?.nome, flag: partida.selecaoCasa?.escudo_url },
                      { key: 'empate', label: 'Empate', flag: null },
                      { key: 'fora', label: partida.selecaoFora?.nome, flag: partida.selecaoFora?.escudo_url },
                    ].map((op) => (
                      <button key={op.key} onClick={() => handleVencedor(op.key)}
                        disabled={enviandoVencedor}
                        style={{
                          flex: 1, minWidth: 100,
                          background: vencedorAposta === op.key ? '#0a1a10' : '#0a0e1a',
                          border: `2px solid ${vencedorAposta === op.key ? '#00a651' : '#1e2d45'}`,
                          borderRadius: 12, padding: '1rem',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: '0.5rem',
                          cursor: enviandoVencedor ? 'not-allowed' : 'pointer',
                          opacity: enviandoVencedor && vencedorAposta !== op.key ? 0.4 : 1,
                          transition: 'all 0.15s',
                        }}>
                        {op.flag ? (
                          <img src={op.flag} alt={op.label} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontSize: '1.5rem' }}>🤝</span>
                        )}
                        <span style={{
                          fontFamily: 'var(--fonte-display)', fontSize: '0.95rem',
                          letterSpacing: 1, color: '#f0f4ff',
                        }}>
                          {enviandoVencedor && vencedorAposta === op.key ? 'Registrando...' : op.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Consenso do bolão */}
              {(() => {
                const comVoto = feedApostas.filter(a => a.vencedor)
                if (comVoto.length < 2) return null
                const total = comVoto.length
                const nCasa   = comVoto.filter(a => a.vencedor === 'casa').length
                const nEmpate = comVoto.filter(a => a.vencedor === 'empate').length
                const nFora   = comVoto.filter(a => a.vencedor === 'fora').length
                const pCasa   = Math.round(nCasa   / total * 100)
                const pEmpate = Math.round(nEmpate / total * 100)
                const pFora   = 100 - pCasa - pEmpate

                const opcoes = [
                  { key: 'casa',   label: partida.selecaoCasa?.nome,  pct: pCasa,   flag: partida.selecaoCasa?.escudo_url,  cor: '#00a651' },
                  { key: 'empate', label: 'Empate',                   pct: pEmpate, flag: null,                             cor: '#6b7280' },
                  { key: 'fora',   label: partida.selecaoFora?.nome,  pct: pFora,   flag: partida.selecaoFora?.escudo_url,  cor: '#3b82f6' },
                ]
                const lider = opcoes.reduce((a, b) => a.pct >= b.pct ? a : b)

                return (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid #1e2d45', paddingTop: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#8b9bb4', letterSpacing: 2, textTransform: 'uppercase' }}>
                        O que o bolão acha
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#8b9bb4' }}>{total} votos</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      {opcoes.map(op => (
                        <div key={op.key} style={{
                          flex: 1, textAlign: 'center',
                          background: op.key === lider.key ? op.cor + '15' : 'transparent',
                          border: `1px solid ${op.key === lider.key ? op.cor + '50' : '#1e2d45'}`,
                          borderRadius: 10, padding: '0.75rem 0.25rem',
                          transition: 'all 0.2s',
                        }}>
                          {op.flag
                            ? <img src={op.flag} alt={op.label} style={{ width: 30, height: 30, objectFit: 'contain' }} />
                            : <span style={{ fontSize: '1.4rem' }}>🤝</span>
                          }
                          <div style={{
                            fontFamily: 'var(--fonte-display)',
                            fontSize: op.key === lider.key ? '1.6rem' : '1.3rem',
                            color: op.pct > 0 ? op.cor : '#3a4a5a',
                            lineHeight: 1, marginTop: 6,
                          }}>{op.pct}%</div>
                          <div style={{
                            fontSize: '0.68rem', color: '#8b9bb4',
                            marginTop: 4, whiteSpace: 'nowrap',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            maxWidth: '100%', padding: '0 4px',
                          }}>{op.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Barra segmentada */}
                    <div style={{ display: 'flex', height: 5, borderRadius: 99, overflow: 'hidden', gap: 2 }}>
                      {opcoes.map(op => op.pct > 0 && (
                        <div key={op.key} style={{
                          width: `${op.pct}%`, background: op.cor,
                          borderRadius: 99, transition: 'width 0.6s ease',
                        }} />
                      ))}
                    </div>
                  </div>
                )
              })()}
            </>
          )}

          {/* ABA PLACAR */}
          {abaAtiva === 'placar' && (
            <>
              <p style={{ color: '#8b9bb4', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Acerte o placar exato e ganhe <strong style={{ color: '#f5d000' }}>+3pts</strong>
              </p>

              {apostaFeita ? (
                <div>
                  <div style={{
                    background: '#0a1a10', border: '1px solid #00a651',
                    borderRadius: 8, padding: '0.75rem 1rem',
                    color: '#00a651', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
                  }}>
                    <span>✅ {apostaFeita.placarCasa >= 0 ? `Aposta: ${apostaFeita.placarCasa} × ${apostaFeita.placarFora}` : 'Vencedor apostado'}
                    {!finalizada && podeApostar && ' — aguardando resultado'}</span>
                    <button
                      onClick={handleCompartilhar}
                      disabled={compartilhando}
                      title="Compartilhar palpite"
                      style={{
                        background: 'none', border: '1px solid #1e4d30', borderRadius: 8,
                        color: '#00a651', padding: '0.3rem 0.65rem',
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                        opacity: compartilhando ? 0.5 : 1, flexShrink: 0,
                        transition: 'all 0.15s',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16 6 12 2 8 6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                      {compartilhando ? 'Gerando...' : 'Compartilhar'}
                    </button>
                  </div>
                  {podeApostar && (
                    <form onSubmit={handleAposta} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#8b9bb4' }}>{partida.selecaoCasa?.nome}</span>
                        <input type="number" min={0} value={aposta.placarCasa}
                          onChange={(e) => setAposta({ ...aposta, placarCasa: Math.max(0, Number(e.target.value)) })}
                          style={inputStyle} />
                        <span style={{ color: '#8b9bb4' }}>×</span>
                        <input type="number" min={0} value={aposta.placarFora}
                          onChange={(e) => setAposta({ ...aposta, placarFora: Math.max(0, Number(e.target.value)) })}
                          style={inputStyle} />
                        <span style={{ fontSize: '0.85rem', color: '#8b9bb4' }}>{partida.selecaoFora?.nome}</span>
                      </div>
                      <button type="submit" disabled={enviando} style={{
                        background: '#1e2d45', color: '#f0f4ff', border: 'none',
                        borderRadius: 8, padding: '0.6rem 1.5rem',
                        fontWeight: 700, fontSize: '0.9rem', letterSpacing: 1,
                        opacity: enviando ? 0.6 : 1, cursor: 'pointer',
                      }}>
                        {enviando ? 'Enviando...' : 'ALTERAR'}
                      </button>
                    </form>
                  )}
                </div>
              ) : !podeApostar ? msgBloqueio : (
                <form onSubmit={handleAposta} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#8b9bb4' }}>{partida.selecaoCasa?.nome}</span>
                    <input type="number" min={0} value={aposta.placarCasa}
                      onChange={(e) => setAposta({ ...aposta, placarCasa: Math.max(0, Number(e.target.value)) })}
                      style={inputStyle} />
                    <span style={{ color: '#8b9bb4' }}>×</span>
                    <input type="number" min={0} value={aposta.placarFora}
                      onChange={(e) => setAposta({ ...aposta, placarFora: Math.max(0, Number(e.target.value)) })}
                      style={inputStyle} />
                    <span style={{ fontSize: '0.85rem', color: '#8b9bb4' }}>{partida.selecaoFora?.nome}</span>
                  </div>
                  <button type="submit" disabled={enviando} style={{
                    background: '#00a651', color: '#fff', border: 'none',
                    borderRadius: 8, padding: '0.6rem 1.5rem',
                    fontWeight: 700, fontSize: '0.9rem', letterSpacing: 1,
                    opacity: enviando ? 0.6 : 1, cursor: 'pointer',
                  }}>
                    {enviando ? 'Enviando...' : 'APOSTAR'}
                  </button>
                </form>
              )}
            </>
          )}

          {/* ABA GOLEADORES */}
          {abaAtiva === 'goleadores' && (
            <>
              <p style={{ color: '#8b9bb4', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Selecione os jogadores que você acha que vão marcar gol
              </p>

              {goleadoresFeitos ? (
                <div>
                  <div style={{ color: '#00a651', fontWeight: 600, marginBottom: '0.75rem' }}>
                    ✅ Goleadores apostados:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {goleadoresFeitos.map((nome) => (
                      <span key={nome} style={{
                        background: '#0a1a10', border: '1px solid #00a651',
                        borderRadius: 20, padding: '0.3rem 0.75rem',
                        fontSize: '0.85rem', color: '#00a651',
                      }}>⚽ {nome}</span>
                    ))}
                  </div>
                  {podeApostar && (
                    <button onClick={() => { setGoleadoresFeitos(null); localStorage.removeItem(`goleadores_${id}`) }}
                      style={{
                        marginTop: '1rem', background: 'none',
                        border: '1px solid #1e2d45', borderRadius: 8,
                        color: '#8b9bb4', padding: '0.4rem 1rem',
                        fontSize: '0.8rem', cursor: 'pointer',
                      }}>Alterar apostas</button>
                  )}
                </div>
              ) : !podeApostar ? msgBloqueio : (
                <form onSubmit={handleGoleadores}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {jogadores.map((j) => {
                      const sel = goleadoresSelecionados.includes(j.id)
                      return (
                        <div key={j.id} onClick={() => toggleGoleador(j.id)} style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          background: sel ? '#0a1a10' : '#0a0e1a',
                          border: `1px solid ${sel ? '#00a651' : '#1e2d45'}`,
                          borderRadius: 8, padding: '0.6rem 1rem', cursor: 'pointer',
                        }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%',
                            border: `2px solid ${sel ? '#00a651' : '#1e2d45'}`,
                            background: sel ? '#00a651' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', color: '#fff', flexShrink: 0,
                          }}>{sel ? '✓' : ''}</div>
                          <span style={{ fontWeight: 600, color: '#f0f4ff' }}>{j.nome}</span>
                          <span style={{ color: '#8b9bb4', fontSize: '0.8rem', marginLeft: 'auto' }}>{j.selecao?.nome}</span>
                        </div>
                      )
                    })}
                  </div>
                  <button type="submit" disabled={enviando || goleadoresSelecionados.length === 0} style={{
                    background: goleadoresSelecionados.length > 0 ? '#00a651' : '#1e2d45',
                    color: '#fff', border: 'none', borderRadius: 8,
                    padding: '0.6rem 1.5rem', fontWeight: 700,
                    fontSize: '0.9rem', letterSpacing: 1,
                    cursor: goleadoresSelecionados.length > 0 ? 'pointer' : 'not-allowed',
                  }}>
                    {enviando ? 'Salvando...' : `CONFIRMAR (${goleadoresSelecionados.length})`}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: '#111827', border: '1px solid #1e2d45',
        borderRadius: 12, padding: '1.5rem',
      }}>
        <h2 style={{
          fontFamily: 'var(--fonte-display)', fontSize: '1.4rem',
          letterSpacing: '2px', marginBottom: '1rem', color: '#f0f4ff',
        }}>
          📋 TIMELINE DE EVENTOS
        </h2>
        <Timeline eventos={eventos} />
      </div>

      {/* Feed de apostas reveladas */}
      {!podeApostar && feedApostas.length > 0 && (
        <div style={{
          background: '#111827', border: '1px solid #1e2d45',
          borderRadius: 12, padding: '1.5rem', marginTop: '1.5rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--fonte-display)', fontSize: '1.4rem',
            letterSpacing: '2px', marginBottom: '1rem', color: '#f0f4ff',
          }}>
            👥 PALPITES DE TODOS
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {feedApostas.map((a) => {
              const vencedorR = finalizada
                ? partida.placarCasa > partida.placarFora ? 'casa'
                : partida.placarFora > partida.placarCasa ? 'fora' : 'empate'
                : null
              const acertouP = finalizada &&
                a.placarCasa === partida.placarCasa &&
                a.placarFora === partida.placarFora
              const vencedorAp = a.placarCasa > a.placarFora ? 'casa'
                : a.placarFora > a.placarCasa ? 'fora' : 'empate'
              const acertouV = finalizada && !acertouP && a.vencedor && a.vencedor === vencedorR
              const errou = finalizada && !acertouP && !acertouV

              const cor = finalizada
                ? acertouP ? '#00a651' : acertouV ? '#3b82f6' : '#e8192c'
                : '#f5a623'

              const iniciais = a.usuario.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

              return (
                <div key={a.id} style={{
                  background: '#0a0e1a',
                  border: `1px solid ${finalizada ? cor + '44' : '#1e2d45'}`,
                  borderRadius: 10, padding: '0.65rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  {/* Avatar */}
                  {a.usuario.foto_url ? (
                    <img src={a.usuario.foto_url} alt="" style={{
                      width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                    }} />
                  ) : (
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: '#0a1a10', border: '2px solid #1e2d45',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, color: '#8b9bb4',
                    }}>{iniciais}</div>
                  )}

                  {/* Nome */}
                  <span style={{ fontSize: '0.85rem', color: '#f0f4ff', fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.usuario.nome}
                  </span>

                  {/* Placar apostado */}
                  <span style={{ fontFamily: 'var(--fonte-display)', fontSize: '1rem', color: cor, whiteSpace: 'nowrap' }}>
                    {a.placarCasa} × {a.placarFora}
                  </span>

                  {/* Badge resultado */}
                  {finalizada && (
                    <span style={{ fontSize: '1rem' }}>
                      {acertouP ? '🎯' : acertouV ? '✅' : '❌'}
                    </span>
                  )}
                  {!finalizada && <span style={{ fontSize: '0.8rem' }}>⏳</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}