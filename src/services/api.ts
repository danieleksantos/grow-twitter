import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { Store } from 'redux'
import { logout } from '../store/slices/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

let storeRef: Store

export const setupAxiosInterceptors = (store: Store) => {
  storeRef = store
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('growtwitter_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Sessão expirada ou Token inválido. Forçando logout.')

      if (storeRef) {
        storeRef.dispatch(logout())
      }
    }

    return Promise.reject(error)
  },
)

export default api
