import type { PayloadAction } from '@reduxjs/toolkit'

import { createAppSlice } from '../../store/createAppSlice'

interface RouteState {
  cacheRoutes: string[];
  removeCacheKey: string[] | string | null;
}

const initialState: RouteState = {
  cacheRoutes: [],
  removeCacheKey: null
}

export const routeSlice = createAppSlice({
  initialState,
  name: 'route',
  reducers: create => ({
    resetRouteStore: create.reducer(() => initialState),
    setCacheRoutes: create.reducer((state, { payload }: PayloadAction<string[]>) => {
      state.cacheRoutes = payload
    }),
    setRemoveCacheKey: create.reducer((state, { payload }: PayloadAction<RouteState['removeCacheKey']>) => {
      state.removeCacheKey = payload
    })
  }),
  selectors: {
    selectCacheRoutes: route => route.cacheRoutes,
    selectRemoveCacheKey: route => route.removeCacheKey
  }
})

export const { resetRouteStore, setCacheRoutes, setRemoveCacheKey } = routeSlice.actions
export const { selectCacheRoutes, selectRemoveCacheKey } = routeSlice.selectors
