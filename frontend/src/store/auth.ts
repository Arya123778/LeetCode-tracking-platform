import { create } from 'zustand'

export type User = {
  id: number
  username: string
  email: string
  leetcode_username?: string | null
  created_at: string
}

type AuthState = {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

const TOKEN_KEY = 'lc_token'

function loadToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const token = loadToken()
  return {
    token,
    user: null,
    setAuth: (t, u) => {
      localStorage.setItem(TOKEN_KEY, t)
      set({ token: t, user: u })
    },
    logout: () => {
      try {
        localStorage.removeItem(TOKEN_KEY)
      } catch {}
      set({ token: null, user: null })
    },
  }
})

