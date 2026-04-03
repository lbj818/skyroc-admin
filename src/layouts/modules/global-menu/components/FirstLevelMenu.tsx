import { transformColorWithOpacity } from '@sa/color'
import { SimpleScrollbar } from '@sa/materials'
import clsx from 'clsx'
import { cloneElement } from 'react'

import { MenuToggler, useMixMenuContext } from '@/features/menu'
import { useRouter } from '@/features/router'
import { ThemeContext, useThemeSettings } from '@/features/theme'
import { useAppStore } from '@/store/appStore'

interface Props {
  children?: React.ReactNode
  inverted?: boolean
  onSelect?: () => void
}

interface MixMenuItemProps {
  active: boolean
  inverted?: boolean
  menu: App.Global.Menu
  onClick?: () => void
  setActiveFirstLevelMenuKey: (key: string) => void
}

function MixMenuItem({ active, inverted, menu: { children, icon, key, label }, onClick, setActiveFirstLevelMenuKey }: MixMenuItemProps) {
  const themeSettings = useThemeSettings()
  const { navigate } = useRouter()
  const { darkMode } = useContext(ThemeContext)
  const siderCollapse = useAppStore(s => s.siderCollapse)

  const selectedBgColor = darkMode
    ? transformColorWithOpacity(themeSettings.themeColor, 0.3, '#000000')
    : transformColorWithOpacity(themeSettings.themeColor, 0.1, '#ffffff')

  function handleClick() {
    setActiveFirstLevelMenuKey(key)
    if (children?.length) { onClick?.() } else { navigate(key) }
  }

  return (
    <div
      style={{ backgroundColor: active ? selectedBgColor : '' }}
      className={clsx(
        'mx-4px mb-6px flex-col-center cursor-pointer rounded-8px bg-transparent px-4px py-8px transition-300 hover:bg-[rgb(0,0,0,0.08)]',
        { 'text-primary selected-mix-menu': active },
        { 'text-white:65 hover:text-white': inverted },
        { '!text-white !bg-primary': active && inverted }
      )}
      onClick={handleClick}
    >
      {icon && cloneElement(icon, { className: siderCollapse ? 'text-icon-small' : 'text-icon-large' } as any)}
      <p className={clsx('w-full ellipsis-text text-12px text-center transition-height-300', siderCollapse ? 'h-0 pt-0' : 'h-24px pt-4px')}>
        {label}
      </p>
    </div>
  )
}

const FirstLevelMenu: FC<Props> = memo(({ children, inverted, onSelect }) => {
  const { activeFirstLevelMenuKey, allMenus, setActiveFirstLevelMenuKey } = useMixMenuContext()

  return (
    <div className="h-full flex-col-stretch flex-1-hidden">
      {children}
      <SimpleScrollbar>
        {allMenus.map(item => (
          <MixMenuItem
            active={item.key === activeFirstLevelMenuKey}
            inverted={inverted}
            key={item.key}
            menu={item}
            setActiveFirstLevelMenuKey={setActiveFirstLevelMenuKey}
            onClick={onSelect}
          />
        ))}
      </SimpleScrollbar>
      <MenuToggler arrowIcon className={clsx({ 'text-white:88 !hover:text-white': inverted })} />
    </div>
  )
})

export default FirstLevelMenu
