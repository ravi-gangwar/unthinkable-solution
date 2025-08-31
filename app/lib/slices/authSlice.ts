import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../api/apiSlice'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token?: string }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      if (action.payload.token) {
        state.token = action.payload.token
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    initializeAuth: (state) => {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')
      if (savedUser && savedToken) {
        state.user = JSON.parse(savedUser)
        state.token = savedToken
        state.isAuthenticated = true
      }
    },
  },
})

export const { setCredentials, logout, initializeAuth } = authSlice.actions
export default authSlice.reducer
