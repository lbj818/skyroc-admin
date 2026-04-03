import { create } from 'zustand'

const SESSION_TOKEN_KEY = 'Authorization'
const SESSION_REFRESH_KEY = 'RefreshToken'

interface TokenState {
  accessToken: string | null
  isLogin: boolean
  refreshToken: string | null
  resetToken: () => void
  setTokens: (accessToken: string, refreshToken: string) => void
}

export const useTokenStore = create<TokenState>((set) => ({
  accessToken: window.sessionStorage.getItem(SESSION_TOKEN_KEY) || null,
  isLogin: Boolean(window.sessionStorage.getItem(SESSION_TOKEN_KEY)),
  refreshToken: window.sessionStorage.getItem(SESSION_REFRESH_KEY) || null,
  resetToken: () => {
    window.sessionStorage.removeItem(SESSION_TOKEN_KEY)
    window.sessionStorage.removeItem(SESSION_REFRESH_KEY)
    set({ accessToken: null, isLogin: false, refreshToken: null })
  },
  setTokens: (accessToken, refreshToken) => {
    window.sessionStorage.setItem(SESSION_TOKEN_KEY, accessToken)
    window.sessionStorage.setItem(SESSION_REFRESH_KEY, refreshToken)
    set({ accessToken, isLogin: true, refreshToken })
  }
}))
