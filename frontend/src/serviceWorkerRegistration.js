export function register() {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    const swUrl = '/service-worker.js'

    navigator.serviceWorker.register(swUrl).then((registration) => {

      // Checa atualização a cada 5 minutos
      setInterval(() => registration.update(), 5 * 60 * 1000)

      // Checa quando o usuário volta pro app
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update()
      })

      registration.onupdatefound = () => {
        const sw = registration.installing
        if (!sw) return

        sw.onstatechange = () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            // Nova versão pronta — ativa e recarrega silenciosamente
            sw.postMessage({ type: 'SKIP_WAITING' })
          }
        }
      }
    }).catch((err) => console.error('SW erro:', err))

    // Quando o SW assume o controle, recarrega a página
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })
  })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((r) => r.unregister())
      .catch((e) => console.error(e.message))
  }
}
