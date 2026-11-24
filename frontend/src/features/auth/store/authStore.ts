
import { create } from 'zustand'
import api from '@/shared/api/api'
import type { UsuarioAuth } from '../types/auth.types'

interface AuthState {
  user: UsuarioAuth | null
  checking: boolean

  
  login: (username: string, password: string) => Promise<void>

  logout: () => Promise<void>
  checkAuth: () => Promise<void>

  setUser: (user: UsuarioAuth | null) => void
  setChecking: (checking: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  checking: true,

  setUser: (user) => set({ user }),

  setChecking: (checking) => set({ checking }),

  clearAuth: () =>
    set({
      user: null,
      checking: false,
    }),

  
  login: async (username, password) => {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    await api.post('/api/v1/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const response = await api.get<UsuarioAuth>('/api/v1/auth/me')

    set({
      user: response.data,
      checking: false,
    })
},


  logout: async () => {
    try {
      await api.post('/api/v1/auth/logout')
    } finally {
      set({
        user: null,
        checking: false,
      })
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get<UsuarioAuth>('/api/v1/auth/me')

      set({
        user: response.data,
        checking: false,
      })
    } catch {
      set({
        user: null,
        checking: false,
      })
    }
  },
}))
