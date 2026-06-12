import { useState, useRef, useEffect } from 'react'

export default function BadgePill({ badge }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef(null)

  // Fecha ao clicar fora (mobile)
  useEffect(() => {
    if (!aberto) return
    function fechar(e) {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false)
    }
    document.addEventListener('pointerdown', fechar)
    return () => document.removeEventListener('pointerdown', fechar)
  }, [aberto])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <div
        onClick={() => setAberto((v) => !v)}
        onMouseEnter={() => setAberto(true)}
        onMouseLeave={() => setAberto(false)}
        style={{
          background: '#0a0e1a',
          border: `1px solid ${aberto ? '#3b82f6' : '#1e2d45'}`,
          borderRadius: 20,
          padding: '0.4rem 0.85rem',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          cursor: 'pointer', userSelect: 'none',
          transition: 'border-color 0.15s',
        }}
      >
        <span style={{ fontSize: '1rem' }}>{badge.emoji}</span>
        <span style={{ fontSize: '0.75rem', color: '#f0f4ff', fontWeight: 600 }}>{badge.nome}</span>
      </div>

      {aberto && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 8,
          padding: '0.45rem 0.7rem',
          width: 170,
          fontSize: '0.72rem',
          color: '#e2e8f0',
          lineHeight: 1.4,
          textAlign: 'center',
          zIndex: 50,
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}>
          <span style={{ fontWeight: 700, color: '#f0f4ff' }}>{badge.emoji} {badge.nome}</span>
          <br />
          <span style={{ color: '#94a3b8' }}>{badge.desc}</span>
          {/* setinha */}
          <div style={{
            position: 'absolute',
            top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #1e293b',
          }} />
        </div>
      )}
    </div>
  )
}
