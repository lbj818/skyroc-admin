import type { FC, PropsWithChildren } from 'react'

import { selectIsLogin } from '@/features/auth/tokenStore'
import { selectMenuTree } from '@/features/menu/menuTreeStore'
import { selectActiveFirstLevelMenuKey, setActiveFirstLevelMenuKey } from '@/features/tab/tabStore'

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
  const dispatch = useAppDispatch()

  const activeFirstLevelMenuKey = useAppSelector(selectActiveFirstLevelMenuKey)
  const isLogin = useAppSelector(selectIsLogin)
  const menuTree = useAppSelector(selectMenuTree)

  const menus = useMemo(() => {
    if (isLogin && menuTree.length > 0) return menuTreeToGlobalMenus(menuTree)
    return filterRoutesToMenus(getBaseChildrenRoutes(router.reactRouter.routes))
     
  }, [isLogin, menuTree, router.reactRouter.routes])

  const firstLevelMenu = menus.map(({ children: _, ...rest }) => rest) as App.Global.Menu[]
  const childLevelMenus = menus.find(menu => menu.key === activeFirstLevelMenuKey)?.children as App.Global.Menu[]
  const selectKey = isLogin && menuTree.length > 0 ? getSelectKeyFromPath(route.pathname) : getSelectKey(route)

  function changeActiveFirstLevelMenuKey(key?: string) {
    const routeKey =
      key ||
      (isLogin && menuTree.length > 0
        ? getActiveMenuKeyFromTree(menus, route.pathname)
        : getActiveFirstLevelMenuKey(route))
    dispatch(setActiveFirstLevelMenuKey(routeKey || ''))
  }

  // 路由变化时自动同步一级菜单激活状态
  useEffect(() => {
    changeActiveFirstLevelMenuKey()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.pathname, menus])

  return (
    <MixMenuContext
      value={{
        activeFirstLevelMenuKey,
        allMenus: menus,
        childLevelMenus: childLevelMenus || [],
        firstLevelMenu,
        isActiveFirstLevelMenuHasChildren: activeFirstLevelMenuKey ? Boolean(childLevelMenus) : false,
        route,
        selectKey,
        setActiveFirstLevelMenuKey: changeActiveFirstLevelMenuKey
      }}
    >
      {children}
    </MixMenuContext>
  )
}

export default MenuProvider
