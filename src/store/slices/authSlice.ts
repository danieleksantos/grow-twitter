import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  token: string | null
  username: string | null
  isLoggedIn: boolean
}

const initialState: AuthState = {
  token: localStorage.getItem('growtwitter_token') || null,
  username: localStorage.getItem('growtwitter_username') || null,
  isLoggedIn: !!localStorage.getItem('growtwitter_token'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ token: string; username: string }>,
    ) => {
      state.token = action.payload.token
      state.username = action.payload.username
      state.isLoggedIn = true

      localStorage.setItem('growtwitter_token', action.payload.token)
      localStorage.setItem('growtwitter_username', action.payload.username)
    },
    logout: (state) => {
      state.token = null
      state.username = null
      state.isLoggedIn = false

      localStorage.removeItem('growtwitter_token')
      localStorage.removeItem('growtwitter_username')
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
