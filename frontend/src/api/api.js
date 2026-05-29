import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
})

let pendingCount = 0
let slowTimer = null

function dispararEvento(nome) {
  window.dispatchEvent(new CustomEvent(nome))
}

api.interceptors.request.use((config) => {
  pendingCount++
  if (!slowTimer) {
    slowTimer = setTimeout(() => {
      if (pendingCount > 0) dispararEvento('api-lenta')
    }, 6000)
  }
  return config
})

function onResposta() {
  pendingCount = Math.max(0, pendingCount - 1)
  if (pendingCount === 0) {
    clearTimeout(slowTimer)
    slowTimer = null
    dispararEvento('api-ok')
  }
}

api.interceptors.response.use(
  (response) => { onResposta(); return response },
  (error)    => { onResposta(); return Promise.reject(error) }
)

export default api
