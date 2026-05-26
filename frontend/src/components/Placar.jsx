export default function Placar({ partida, grande = false }) {
  const tamanho = grande ? '3.5rem' : '2rem'
  const padding = grande ? '1.5rem 2.5rem' : '0.75rem 1.5rem'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: grande ? '1.5rem' : '1rem',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        {partida.selecaoCasa?.escudo_url && (
          <img src={partida.selecaoCasa.escudo_url} alt={partida.selecaoCasa.nome}
            style={{ width: grande ? 48 : 32, height: grande ? 48 : 32, objectFit: 'contain', marginBottom: 4 }} />
        )}
        <div style={{
          fontFamily: 'var(--fonte-display)',
          fontSize: grande ? '1rem' : '0.75rem',
          letterSpacing: '2px',
          color: '#00a651',
        }}>
          {partida.selecaoCasa?.nome}
        </div>
      </div>

      <div style={{
        background: '#0d1321',
        border: '1px solid #1e2d45',
        borderRadius: 8,
        padding,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <span style={{ fontFamily: 'var(--fonte-display)', fontSize: tamanho, color: '#f0f4ff' }}>
          {partida.placarCasa}
        </span>
        <span style={{ color: '#8b9bb4', fontSize: grande ? '1.5rem' : '1rem' }}>×</span>
        <span style={{ fontFamily: 'var(--fonte-display)', fontSize: tamanho, color: '#f0f4ff' }}>
          {partida.placarFora}
        </span>
      </div>

      <div style={{ textAlign: 'center' }}>
        {partida.selecaoFora?.escudo_url && (
          <img src={partida.selecaoFora.escudo_url} alt={partida.selecaoFora.nome}
            style={{ width: grande ? 48 : 32, height: grande ? 48 : 32, objectFit: 'contain', marginBottom: 4 }} />
        )}
        <div style={{
          fontFamily: 'var(--fonte-display)',
          fontSize: grande ? '1rem' : '0.75rem',
          letterSpacing: '2px',
          color: '#002395',
        }}>
          {partida.selecaoFora?.nome}
        </div>
      </div>
    </div>
  )
}