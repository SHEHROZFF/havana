import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token
      state.isAuthenticated = true
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', action.payload.token)
      }
    },
    logOut: (state) => {
      state.token = null
      state.isAuthenticated = false
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token')
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    // Initialize auth state from localStorage
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token')
        if (token) {
          state.token = token
          state.isAuthenticated = true
        }
      }
    },
  },
})

export const { setCredentials, logOut, setLoading, initializeAuth } = authSlice.actions
export default authSlice.reducer