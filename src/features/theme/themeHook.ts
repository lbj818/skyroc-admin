import { useThemeStore } from '@/store/themeStore'

export function useThemeSettings() {
  return useThemeStore(s => s.settings)
}
