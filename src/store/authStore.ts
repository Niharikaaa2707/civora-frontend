import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  role: string
  xp_points: number
  tier: string
  badges: string[]
}

interface AuthStore {
  user:    User | null
  token:   string | null
  setAuth: (user: User, token: string) => void
  logout:  () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user:  JSON.parse(localStorage.getItem('ch_user') || 'null'),
  token: localStorage.getItem('ch_token'),
  setAuth: (user, token) => {
  localStorage.setItem('ch_user', JSON.stringify(user))
  localStorage.setItem('ch_token', token)
  set({ user, token })
},
  logout: () => {
    localStorage.removeItem('ch_user')
    localStorage.removeItem('ch_token')
    set({ user: null, token: null })
  },
}))