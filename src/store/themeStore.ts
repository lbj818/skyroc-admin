import { getPaletteColorByNumber } from '@sa/color'
import { create } from 'zustand'

import { globalConfig } from '@/config'
import { initThemeSettings } from '@/features/theme/shared'
import { localStg } from '@/utils/storage'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
}

interface ThemeState {
  cacheThemeSettings: () => void
  changeReverseHorizontalMix: (v: boolean) => void
  resetTheme: () => void
  setColourWeakness: (v: boolean) => void
  setFixedHeaderAndTab: (v: boolean) => void
  setFooter: (v: Partial<App.Theme.ThemeSetting['footer']>) => void
  setGrayscale: (v: boolean) => void
  setHeader: (v: DeepPartial<App.Theme.ThemeSetting['header']>) => void
  setIsInfoFollowPrimary: (v: boolean) => void
  setIsOnlyExpandCurrentParentMenu: (v: boolean) => void
  setLayoutMode: (v: UnionKey.ThemeLayoutMode) => void
  setLayoutScrollMode: (v: UnionKey.ThemeScrollMode) => void
  setPage: (v: Partial<App.Theme.ThemeSetting['page']>) => void
  setRecommendColor: (v: boolean) => void
  setSider: (v: Partial<App.Theme.ThemeSetting['sider']>) => void
  setSiderInverted: (v: boolean) => void
  setTab: (v: Partial<App.Theme.ThemeSetting['tab']>) => void
  settings: App.Theme.ThemeSetting
  setWatermark: (v: Partial<App.Theme.ThemeSetting['watermark']>) => void
  updateThemeColors: (key: App.Theme.ThemeColorKey, color: string) => void
}

const initialSettings = initThemeSettings()

export const useThemeStore = create<ThemeState>((set, get) => ({
  settings: initialSettings,
  cacheThemeSettings: () => {
    if (globalConfig.isDev) return
    localStg.set('themeSettings', get().settings)
  },
  changeReverseHorizontalMix: (v) =>
    set((s) => ({ settings: { ...s.settings, layout: { ...s.settings.layout, reverseHorizontalMix: v } } })),
  resetTheme: () => set({ settings: initialSettings }),
  setColourWeakness: (v) => set((s) => ({ settings: { ...s.settings, colourWeakness: v } })),
  setFixedHeaderAndTab: (v) => set((s) => ({ settings: { ...s.settings, fixedHeaderAndTab: v } })),
  setFooter: (v) => set((s) => ({ settings: { ...s.settings, footer: { ...s.settings.footer, ...v } } })),
  setGrayscale: (v) => set((s) => ({ settings: { ...s.settings, grayscale: v } })),
  setHeader: (v) =>
    set((s) => ({ settings: { ...s.settings, header: { ...s.settings.header, ...(v as any) } } })),
  setIsInfoFollowPrimary: (v) => set((s) => ({ settings: { ...s.settings, isInfoFollowPrimary: v } })),
  setIsOnlyExpandCurrentParentMenu: (v) =>
    set((s) => ({ settings: { ...s.settings, isOnlyExpandCurrentParentMenu: v } })),
  setLayoutMode: (v) =>
    set((s) => ({ settings: { ...s.settings, layout: { ...s.settings.layout, mode: v } } })),
  setLayoutScrollMode: (v) =>
    set((s) => ({ settings: { ...s.settings, layout: { ...s.settings.layout, scrollMode: v } } })),
  setPage: (v) => set((s) => ({ settings: { ...s.settings, page: { ...s.settings.page, ...v } } })),
  setRecommendColor: (v) => set((s) => ({ settings: { ...s.settings, recommendColor: v } })),
  setSider: (v) => set((s) => ({ settings: { ...s.settings, sider: { ...s.settings.sider, ...v } } })),
  setSiderInverted: (v) =>
    set((s) => ({ settings: { ...s.settings, sider: { ...s.settings.sider, inverted: v } } })),
  setTab: (v) => set((s) => ({ settings: { ...s.settings, tab: { ...s.settings.tab, ...v } } })),
  setWatermark: (v) =>
    set((s) => ({ settings: { ...s.settings, watermark: { ...s.settings.watermark, ...v } } })),
  updateThemeColors: (key, color) =>
    set((s) => {
      const colorValue = s.settings.recommendColor ? getPaletteColorByNumber(color, 500, true) : color
      if (key === 'primary') {
        return { settings: { ...s.settings, themeColor: colorValue } }
      }
      return {
        settings: {
          ...s.settings,
          otherColor: { ...s.settings.otherColor, [key]: colorValue }
        }
      }
    })
}))
