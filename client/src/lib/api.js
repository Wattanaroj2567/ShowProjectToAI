import axios from 'axios'
import { getToken, clearAuth } from './storage'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

export const api = axios.create({ baseURL })

// Attach token
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearAuth()
    }
    return Promise.reject(err)
  }
)

export default api

