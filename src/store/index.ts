import { combineSlices, configureStore } from '@reduxjs/toolkit';
import type { Action, ThunkAction } from '@reduxjs/toolkit';

import { tokenSlice } from '../features/auth/tokenStore';
import { menuTreeSlice } from '../features/menu/menuTreeStore';
import { routeSlice } from '../features/router/routeStore';
import { tabSlice } from '../features/tab/tabStore';
import { themeSlice } from '../features/theme';
import { appSlice } from '../layouts/appStore';

const rootReducer = combineSlices(appSlice, tokenSlice, menuTreeSlice, themeSlice, routeSlice, tabSlice);

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer
});

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
