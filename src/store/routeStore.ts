import { create } from 'zustand'

interface RouteState {
  cacheRoutes: string[]
  removeCacheKey: string[] | string | null
  resetRouteStore: () => void
  setCacheRoutes: (routes: string[]) => void
  setRemoveCacheKey: (key: string[] | string | null) => void
}

export const useRouteStore = create<RouteState>((set) => ({
  cacheRoutes: [],
  removeCacheKey: null,
  resetRouteStore: () => set({ cacheRoutes: [], removeCacheKey: null }),
  setCacheRoutes: (routes) => set({ cacheRoutes: routes }),
  setRemoveCacheKey: (key) => set({ removeCacheKey: key })
}))
