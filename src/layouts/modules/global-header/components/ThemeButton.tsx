import { useAppStore } from '@/store/appStore'

const ThemeButton = memo(() => {
  const { openThemeDrawer } = useAppStore.getState()

  return (
    <ButtonIcon
      triggerParent
      className="px-12px"
      icon="majesticons:color-swatch-line"
      tooltipContent="主题配置"
      onClick={openThemeDrawer}
    />
  )
})

export default ThemeButton
