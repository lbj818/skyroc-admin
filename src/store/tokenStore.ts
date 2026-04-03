import { create } from 'zustand'

import { sessionStg } from '@/utils/storage'

interface TokenState {
  accessToken: string | null
  isLogin: boolean
  refreshToken: string | null
  resetToken: () => void
  setTokens: (accessToken: string, refreshToken: string) => void
}

export const useTokenStore = create<TokenState>((set) => ({
  accessToken: sessionStg.get('Authorization') || null,
  isLogin: Boolean(sessionStg.get('Authorization')),
  refreshToken: sessionStg.get('RefreshToken') || null,
  resetToken: () => {
    sessionStg.remove('Authorization')
    sessionStg.remove('RefreshToken')
    set({ accessToken: null, isLogin: false, refreshToken: null })
  },
  setTokens: (accessToken, refreshToken) => {
    sessionStg.set('Authorization', accessToken)
    sessionStg.set('RefreshToken', refreshToken)
    set({ accessToken, isLogin: true, refreshToken })
  }
}))
