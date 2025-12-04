import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  token: string | null
  username: string | null
  isLoggedIn: boolean
  name: string | null
  imageUrl: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('growtwitter_token') || null,
  username: localStorage.getItem('growtwitter_username') || null,
  name: localStorage.getItem('growtwitter_name') || null,
  imageUrl: localStorage.getItem('growtwitter_imageUrl') || null,
  isLoggedIn: !!localStorage.getItem('growtwitter_token'),
}

interface LoginPayload {
  token: string
  username: string
  name: string
  imageUrl?: string
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { token, username, name, imageUrl } = action.payload

      state.token = token
      state.username = username
      state.isLoggedIn = true

      state.name = name
      state.imageUrl = imageUrl || null

      localStorage.setItem('growtwitter_token', token)
      localStorage.setItem('growtwitter_username', username)
      localStorage.setItem('growtwitter_name', name)
      if (imageUrl) {
        localStorage.setItem('growtwitter_imageUrl', imageUrl)
      } else {
        localStorage.removeItem('growtwitter_imageUrl')
      }
    },
    logout: (state) => {
      state.token = null
      state.username = null
      state.isLoggedIn = false

      state.name = null
      state.imageUrl = null

      localStorage.removeItem('growtwitter_token')
      localStorage.removeItem('growtwitter_username')
      localStorage.removeItem('growtwitter_name')
      localStorage.removeItem('growtwitter_imageUrl')
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
