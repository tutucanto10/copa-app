import { createContext, useContext, useState, useEffect } from 'react'

const THEMES = [
  { id: 'dark',    label: 'Escuro',  icon: '🌙' },
  { id: 'light',   label: 'Claro',   icon: '☀️' },
  { id: 'brasil',  label: 'Brasil',  icon: '🇧🇷' },
  { id: 'retro',   label: 'Retrô',   icon: '📰' },
  { id: 'estadio', label: 'Estádio Anos 80', icon: '🏟' },
  { id: 'ouro',    label: 'Ouro',    icon: '🏆' },
]

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [themeIndex, setThemeIndex] = useState(() => {
    const saved = localStorage.getItem('tema_copa')
    const idx = THEMES.findIndex((t) => t.id === saved)
    return idx >= 0 ? idx : 0
  })

  const theme = THEMES[themeIndex]

  useEffect(() => {
    const id = theme.id
    document.documentElement.setAttribute('data-theme', id === 'dark' ? '' : id)
    localStorage.setItem('tema_copa', id)
  }, [theme])

  function cycleTheme() {
    setThemeIndex((i) => (i + 1) % THEMES.length)
  }

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
