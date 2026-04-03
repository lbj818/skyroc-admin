import { useTheme } from '@/features/theme/themeContext'
import { useThemeStore } from '@/store/themeStore'

const ConfigOperation = () => {
  const settings = useThemeStore(s => s.settings)
  const { resetTheme } = useThemeStore.getState()
  const { setThemeScheme } = useTheme()
  const { copy } = useCopy()

  function formatConfigText() {
    return JSON.stringify(settings).replace(/"(\w+)":/g, '$1:')
  }

  async function handleCopy() {
    const success = await copy(formatConfigText())
    window.$message?.[success ? 'success' : 'error'](
      success ? '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings' : '复制失败'
    )
  }

  function handleReset() {
    setThemeScheme('light')
    resetTheme()
    setTimeout(() => window.$message?.success('重置成功'), 50)
  }

  return (
    <div className="flex justify-between">
      <AButton danger onClick={handleReset}>重置配置</AButton>
      <AButton type="primary" onClick={handleCopy}>复制配置</AButton>
    </div>
  )
}

export default ConfigOperation
