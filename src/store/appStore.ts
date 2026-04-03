import { create } from 'zustand'

interface AppState {
  closeThemeDrawer: () => void
  contentXScrollable: boolean
  fullContent: boolean
  isMobile: boolean
  mixSiderFixed: boolean
  openThemeDrawer: () => void
  reloadFlag: boolean
  setContentXScrollable: (v: boolean) => void
  setIsMobile: (v: boolean) => void
  setMixSiderFixed: (v: boolean) => void
  setReloadFlag: (v: boolean) => void
  setSiderCollapse: (v: boolean) => void
  siderCollapse: boolean
  themeDrawerVisible: boolean
  toggleFullContent: () => void
  toggleMixSiderFixed: () => void
  toggleSiderCollapse: () => void
}

export const useAppStore = create<AppState>((set) => ({
  contentXScrollable: false,
  fullContent: false,
  isMobile: false,
  mixSiderFixed: false,
  reloadFlag: false,
  siderCollapse: false,
  themeDrawerVisible: false,
  closeThemeDrawer: () => set({ themeDrawerVisible: false }),
  openThemeDrawer: () => set({ themeDrawerVisible: true }),
  setContentXScrollable: (v) => set({ contentXScrollable: v }),
  setIsMobile: (v) => set({ isMobile: v }),
  setMixSiderFixed: (v) => set({ mixSiderFixed: v }),
  setReloadFlag: (v) => set({ reloadFlag: v }),
  setSiderCollapse: (v) => set({ siderCollapse: v }),
  toggleFullContent: () => set((s) => ({ fullContent: !s.fullContent })),
  toggleMixSiderFixed: () => set((s) => ({ mixSiderFixed: !s.mixSiderFixed })),
  toggleSiderCollapse: () => set((s) => ({ siderCollapse: !s.siderCollapse }))
}))
