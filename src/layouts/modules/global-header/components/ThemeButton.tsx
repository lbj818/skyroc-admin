import { openThemeDrawer } from '@/layouts/appStore'

const ThemeButton = memo(() => {
  const dispatch = useAppDispatch()

  function handleClick() {
    dispatch(openThemeDrawer())
  }

  return (
    <ButtonIcon
      triggerParent
      className="px-12px"
      icon="majesticons:color-swatch-line"
      tooltipContent="主题配置"
      onClick={handleClick}
    />
  )
})

export default ThemeButton
