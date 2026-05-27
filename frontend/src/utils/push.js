import api from '../api/api'

export async function subscribePush(usuarioId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  try {
    const permissao = await Notification.requestPermission()
    if (permissao !== 'granted') return

    const reg = await navigator.serviceWorker.ready
    const { data } = await api.get('/push/public-key')

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    })

    await api.post('/push/subscribe', { usuarioId, subscription })
  } catch (err) {
    console.warn('Push não disponível:', err.message)
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}
