import { useThemeSettings } from '@/features/theme'
import { useAppStore } from '@/store/appStore'

export function useReloadPage(duration = 300) {
  const isReload = useAppStore(s => s.reloadFlag)
  const { setReloadFlag } = useAppStore.getState()
  const themeSettings = useThemeSettings()

  async function reloadPage() {
    setReloadFlag(true)
    const d = themeSettings.page.animate ? duration : 40
    await new Promise(resolve => { setTimeout(resolve, d) })
    setReloadFlag(false)
  }

  return { isReload, reloadPage }
}
