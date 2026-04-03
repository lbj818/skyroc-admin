import type { FC, PropsWithChildren } from 'react'

import { useMenuTreeStore } from '@/store/menuTreeStore'
import { useTabStore } from '@/store/tabStore'
import { useTokenStore } from '@/store/tokenStore'

import { useRoute, useRouter } from '../router'
import { getBaseChildrenRoutes } from '../router/routes'

import { MixMenuContext } from './menuContext'
import {
  filterRoutesToMenus,
  getActiveFirstLevelMenuKey,
  getActiveMenuKeyFromTree,
  getSelectKey,
  getSelectKeyFromPath,
  menuTreeToGlobalMenus
} from './menuHelpers'

const MenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const route = useRoute()
  const router = useRouter()

  const activeFirstLevelMenuKey = useTabStore(s => s.activeFirstLevelMenuKey)
  const { setActiveFirstLevelMenuKey } = useTabStore.getState()
  const isLogin = useTokenStore(s => s.isLogin)
  const menuTree = useMenuTreeStore(s => s.menuTree)

  const menus = useMemo(() => {
    if (isLogin && menuTree.length > 0) return menuTreeToGlobalMenus(menuTree)
    return filterRoutesToMenus(getBaseChildrenRoutes(router.reactRouter.routes))
  }, [isLogin, menuTree, router.reactRouter.routes])

  const firstLevelMenu = menus.map(({ children: _, ...rest }) => rest) as App.Global.Menu[]
  const childLevelMenus = menus.find(menu => menu.key === activeFirstLevelMenuKey)?.children as App.Global.Menu[]
  const selectKey = isLogin && menuTree.length > 0 ? getSelectKeyFromPath(route.pathname) : getSelectKey(route)

  function changeActiveFirstLevelMenuKey(key?: string) {
    const routeKey = key || (isLogin && menuTree.length > 0
      ? getActiveMenuKeyFromTree(menus, route.pathname)
      : getActiveFirstLevelMenuKey(route))
    setActiveFirstLevelMenuKey(routeKey || '')
  }

  // 路由变化或菜单首次加载时同步一级菜单激活状态
  useEffect(() => {
    changeActiveFirstLevelMenuKey()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.pathname, menuTree.length])

  return (
    <MixMenuContext value={{
      activeFirstLevelMenuKey,
      allMenus: menus,
      childLevelMenus: childLevelMenus || [],
      firstLevelMenu,
      isActiveFirstLevelMenuHasChildren: activeFirstLevelMenuKey ? Boolean(childLevelMenus) : false,
      route,
      selectKey,
      setActiveFirstLevelMenuKey: changeActiveFirstLevelMenuKey
    }}>
      {children}
    </MixMenuContext>
  )
}

export default MenuProvider
