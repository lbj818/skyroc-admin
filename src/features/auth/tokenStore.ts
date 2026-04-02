import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const SESSION_TOKEN_KEY = 'Authorization'
const SESSION_REFRESH_KEY = 'RefreshToken'

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: TokenState = {
  accessToken: window.sessionStorage.getItem(SESSION_TOKEN_KEY) || null,
  refreshToken: window.sessionStorage.getItem(SESSION_REFRESH_KEY) || null
}

export const tokenSlice = createSlice({
  initialState,
  name: 'token',
  reducers: {
    resetToken: () => {
      window.sessionStorage.removeItem(SESSION_TOKEN_KEY)
      window.sessionStorage.removeItem(SESSION_REFRESH_KEY)
      return { accessToken: null, refreshToken: null }
    },
    setTokens: (state, { payload }: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = payload.accessToken
      state.refreshToken = payload.refreshToken
      window.sessionStorage.setItem(SESSION_TOKEN_KEY, payload.accessToken)
      window.sessionStorage.setItem(SESSION_REFRESH_KEY, payload.refreshToken)
    }
  },
  selectors: {
    selectAccessToken: s => s.accessToken,
    selectIsLogin: s => Boolean(s.accessToken),
    selectRefreshToken: s => s.refreshToken
  }
})

export const { resetToken, setTokens } = tokenSlice.actions
export const { selectAccessToken, selectIsLogin, selectRefreshToken } = tokenSlice.selectors
