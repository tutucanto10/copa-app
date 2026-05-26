// Registrar Service Worker
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `/service-worker.js`
 
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration)
 
          // Verificar atualizações a cada 1 hora
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000)
 
          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            if (installingWorker == null) {
              return
            }
 
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Nova versão disponível
                  console.log('🔄 Nova versão disponível! Recarregue a página.')
                  
                  // Mostrar notificação para o usuário
                  if (window.confirm('Nova versão disponível! Deseja atualizar agora?')) {
                    installingWorker.postMessage({ type: 'SKIP_WAITING' })
                    window.location.reload()
                  }
                } else {
                  // Conteúdo cacheado para uso offline
                  console.log('✅ Conteúdo cacheado para uso offline.')
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error('❌ Erro ao registrar Service Worker:', error)
        })
    })
  }
}
 
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}