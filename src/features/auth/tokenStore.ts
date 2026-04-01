import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { localStg } from '@/utils/storage';

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: TokenState = {
  accessToken: localStg.get('token') || null,
  refreshToken: localStg.get('refreshToken') || null
};

export const tokenSlice = createSlice({
  initialState,
  name: 'token',
  reducers: {
    resetToken: () => {
      localStg.remove('token');
      localStg.remove('refreshToken');
      return { accessToken: null, refreshToken: null };
    },
    setTokens: (state, { payload }: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      localStg.set('token', payload.accessToken);
      localStg.set('refreshToken', payload.refreshToken);
    }
  },
  selectors: {
    selectAccessToken: s => s.accessToken,
    selectIsLogin: s => Boolean(s.accessToken),
    selectRefreshToken: s => s.refreshToken
  }
});

export const { resetToken, setTokens } = tokenSlice.actions;
export const { selectAccessToken, selectIsLogin, selectRefreshToken } = tokenSlice.selectors;
