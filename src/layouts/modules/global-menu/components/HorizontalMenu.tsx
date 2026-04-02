import type { MenuInfo } from '@rc-component/menu/lib/interface'
import type { FC } from 'react'

import { useMixMenuContext } from '@/features/menu'
import { useRouter } from '@/features/router'
import { getThemeSettings } from '@/features/theme'

import { HorizontalMenuMode } from '../types'

interface Props {
  mode: HorizontalMenuMode;
}

const HorizontalMenu: FC<Props> = memo(({ mode }) => {
  const themeSettings = useAppSelector(getThemeSettings)

  const { activeFirstLevelMenuKey, allMenus, childLevelMenus, firstLevelMenu, selectKey, setActiveFirstLevelMenuKey } =
    useMixMenuContext()

  const { navigate } = useRouter()

  const selectedKeys = mode === HorizontalMenuMode.FirstLevel ? [activeFirstLevelMenuKey] : selectKey

  function getMenus() {
    if (mode === HorizontalMenuMode.All) return allMenus
    if (mode === HorizontalMenuMode.Child) return childLevelMenus
    return firstLevelMenu
  }

  function handleClickMenu(menuInfo: MenuInfo) {
    if (mode === HorizontalMenuMode.FirstLevel) {
      // 只切换左侧菜单，不跳转路由
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
      items={getMenus().map(menu => ({
        ...menu,
        children: menu.children && menu.children.length > 0 ? menu.children : undefined
      }))}
      onClick={handleClickMenu}
    />
  )
})

export default HorizontalMenu
