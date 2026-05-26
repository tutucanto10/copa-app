const ICONES = {
  GOL:        { icon: '⚽', label: 'Gol',           cor: '#00a651' },
  ASSISTENCIA:{ icon: '🎯', label: 'Assistência',   cor: '#f5d000' },
  AMARELO:    { icon: '🟨', label: 'Cartão Amarelo', cor: '#f5d000' },
  VERMELHO:   { icon: '🟥', label: 'Cartão Vermelho',cor: '#e8192c' },
}

export default function Timeline({ eventos }) {
  if (!eventos || eventos.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#8b9bb4', padding: '2rem' }}>
        Nenhum evento registrado ainda.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {eventos.map((ev) => {
        const cfg = ICONES[ev.tipo] || { icon: '📌', label: ev.tipo, cor: '#8b9bb4' }
        return (
          <div key={ev.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: '#111827',
            border: '1px solid #1e2d45',
            borderLeft: `3px solid ${cfg.cor}`,
            borderRadius: 8,
            padding: '0.75rem 1rem',
          }}>
            <span style={{ fontSize: '1.25rem' }}>{cfg.icon}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, color: '#f0f4ff' }}>
                {ev.jogador?.nome}
              </span>
              <span style={{ color: '#8b9bb4', fontSize: '0.8rem', marginLeft: 8 }}>
                {ev.jogador?.selecao?.nome}
              </span>
            </div>
            <span style={{
              fontFamily: 'var(--fonte-display)',
              fontSize: '1.1rem',
              color: cfg.cor,
              minWidth: 40,
              textAlign: 'right',
            }}>
              {ev.minuto}'
            </span>
          </div>
        )
      })}
    </div>
  )
}