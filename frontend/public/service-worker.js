const CACHE_NAME = 'copa-bolao-v2'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => n !== CACHE_NAME && caches.delete(n)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})

// Push notification recebida
self.addEventListener('push', (event) => {
  let data = { titulo: 'Bolão Copa 2026', corpo: 'Você tem uma notificação!', url: '/' }
  try { data = JSON.parse(event.data.text()) } catch (_) {}

  event.waitUntil(
    self.registration.showNotification(data.titulo, {
      body: data.corpo,
      icon: '/favicon.png',
      badge: '/favicon.png',
      data: { url: data.url },
      vibrate: [200, 100, 200],
    })
  )
})

// Clique na notificação abre o app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const client = windowClients.find((c) => c.url.includes(self.location.origin))
      if (client) { client.focus(); client.navigate(url) }
      else clients.openWindow(url)
    })
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
