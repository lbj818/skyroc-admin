import zhCN from 'antd/es/locale/zh_CN'
import type { PropsWithChildren } from 'react'

import { globalConfig } from '@/config'
import { info } from '@/constants/app'
import { getAntdTheme, setupThemeVarsToHtml, toggleAuxiliaryColorModes, toggleGrayscaleMode } from '@/features/theme/shared'
import { useThemeSettings } from '@/features/theme/themeHook'
import { useThemeStore } from '@/store/themeStore'
import { localStg } from '@/utils/storage'

import { useTheme } from '../theme'

function useAntdTheme() {
  const themeSettings = useThemeSettings()
  const { darkMode } = useTheme()

  const isInfoFollowPrimary = useThemeStore(s => s.settings.isInfoFollowPrimary)
  const themeColor = useThemeStore(s => s.settings.themeColor)
  const otherColor = useThemeStore(s => s.settings.otherColor)
  const colors = useMemo(() => ({
    error: otherColor.error,
    info: isInfoFollowPrimary ? themeColor : otherColor.info,
    primary: themeColor,
    success: otherColor.success,
    warning: otherColor.warning
  }), [isInfoFollowPrimary, otherColor, themeColor])

  const antdTheme = getAntdTheme(colors, darkMode, themeSettings.tokens)

  useEffect(() => {
    setupThemeVarsToHtml(colors, themeSettings.tokens, themeSettings.recommendColor)
    localStg.set('themeColor', colors.primary)
    toggleAuxiliaryColorModes(themeSettings.colourWeakness)
    toggleGrayscaleMode(themeSettings.grayscale)
  }, [colors, themeSettings])

  console.info(`%c${info}`, `color: ${colors.primary}`)

  return { antdTheme, watermarkText: themeSettings.watermark.text, watermarkVisible: themeSettings.watermark.visible }
}

function AntdConfig({ children }: PropsWithChildren) {
  const { antdTheme, watermarkText, watermarkVisible } = useAntdTheme()

  return (
    <AConfigProvider
      button={{ classNames: { icon: 'align-1px text-icon' } }}
      card={{ styles: { body: { flex: 1, overflow: 'hidden', padding: '12px 16px' } } }}
      locale={zhCN}
      theme={antdTheme}
    >
      <AWatermark
        className="h-full"
        content={watermarkVisible ? watermarkText || globalConfig.watermarkText : ''}
        {...globalConfig.watermarkConfig}
      >
        {children}
      </AWatermark>
    </AConfigProvider>
  )
}

export default AntdConfig
