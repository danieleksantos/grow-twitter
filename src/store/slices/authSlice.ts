import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  token: string | null
  id: string | null
  username: string | null
  isLoggedIn: boolean
  name: string | null
  imageUrl: string | null
}

const initialState: AuthState = {
  token: null,
  id: null,
  username: null,
  name: null,
  imageUrl: null,
  isLoggedIn: false,
}

interface LoginPayload {
  token: string
  id: string
  username: string
  name: string
  imageUrl?: string | null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { token, id, username, name, imageUrl } = action.payload

      state.token = token
      state.id = id
      state.username = username
      state.name = name
      state.imageUrl = imageUrl || null
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.token = null
      state.id = null
      state.username = null
      state.name = null
      state.imageUrl = null
      state.isLoggedIn = false
    },
    updateUserInfo: (
      state,
      action: PayloadAction<{ name: string; imageUrl: string | null }>,
    ) => {
      state.name = action.payload.name
      state.imageUrl = action.payload.imageUrl
    },
  },
})

export const { login, logout, updateUserInfo } = authSlice.actions
export default authSlice.reducer
