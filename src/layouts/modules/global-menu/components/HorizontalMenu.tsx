import type { MenuInfo } from '@rc-component/menu/lib/interface'
import type { FC } from 'react'

import { useMixMenuContext } from '@/features/menu'
import { useRouter } from '@/features/router'
import { useThemeSettings } from '@/features/theme'

import { HorizontalMenuMode } from '../types'

interface Props {
  mode: HorizontalMenuMode
}

const HorizontalMenu: FC<Props> = memo(({ mode }) => {
  const themeSettings = useThemeSettings()
  const { activeFirstLevelMenuKey, allMenus, childLevelMenus, firstLevelMenu, selectKey, setActiveFirstLevelMenuKey } = useMixMenuContext()
  const { navigate } = useRouter()

  const selectedKeys = mode === HorizontalMenuMode.FirstLevel ? [activeFirstLevelMenuKey] : selectKey

  function getMenus() {
    if (mode === HorizontalMenuMode.All) return allMenus
    if (mode === HorizontalMenuMode.Child) return childLevelMenus
    return firstLevelMenu
  }

  function handleClickMenu(menuInfo: MenuInfo) {
    if (mode === HorizontalMenuMode.FirstLevel) {
      setActiveFirstLevelMenuKey(menuInfo.key)
    } else {
      navigate(menuInfo.key)
    }
  }

  return (
    <AMenu
      className="size-full transition-400 border-0!"
      inlineIndent={18}
      mode="horizontal"
      selectedKeys={selectedKeys}
      style={{ lineHeight: `${themeSettings.header.height}px` }}
      items={getMenus().map(menu => ({ ...menu, children: menu.children?.length ? menu.children : undefined }))}
      onClick={handleClickMenu}
    />
  )
})

export default HorizontalMenu
