import * as AntdIcons from '@ant-design/icons'
import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'

import BeyondHiding from '@/components/BeyondHiding'
import SvgIcon from '@/components/SvgIcon'
import type { MenuItem } from '@/features/menu/menuTreeStore'

/** 动态渲染 antd 图标，icon 为图标名字符串如 "FileTextOutlined" */
function renderMenuIcon(icon: string, style?: React.CSSProperties) {
  const IconComponent = (AntdIcons as any)[icon]
  if (IconComponent) {
    return createElement(IconComponent, { style: { fontSize: '16px', ...style } })
  }
  // 降级到 SvgIcon（iconify 图标）
  return createElement(SvgIcon, { icon, style: { fontSize: '20px', ...style } })
}

// ---- 静态路由菜单工具 ----

export function filterRoutesToMenus(routes: RouteObject[]) {
  const sortedRoutes = sortRoutesByOrder(routes)
  const menus: App.Global.Menu[] = []

  for (const route of sortedRoutes) {
    if (route.path && !route.handle?.hideInMenu) {
      const newNode = getGlobalMenuByBaseRoute(route)
      if (route.children && route.children.length) {
        const filteredChildren = filterRoutesToMenus(route.children)
        if (filteredChildren?.length) newNode.children = filteredChildren
      }
      menus.push(newNode)
    } else if (route.children && route.children.length) {
      menus.push(...filterRoutesToMenus(route.children))
    }
  }

  return menus
}

export function sortRoutesByOrder(routes: RouteObject[]) {
  routes.sort((next, prev) => (Number(next.handle?.order) || 0) - (Number(prev.handle?.order) || 0))
  routes.forEach(sortRouteByOrder)
  return routes
}

function sortRouteByOrder(route: RouteObject) {
  if (route.children?.length) {
    route.children.sort((next, prev) => (Number(next.handle?.order) || 0) - (Number(prev.handle?.order) || 0))
    route.children.forEach(sortRouteByOrder)
  }
  return route
}

export function getGlobalMenuByBaseRoute(route: RouteObject): App.Global.Menu {
  const { path } = route
  const { icon = import.meta.env.VITE_MENU_ICON, localIcon, title } = route.handle ?? {}

  return {
    icon: (
      <SvgIcon
        icon={icon}
        localIcon={localIcon}
        style={{ fontSize: '20px' }}
      />
    ),
    key: path || '',
    label: <BeyondHiding title={title} />,
    title
  }
}

export function getActiveFirstLevelMenuKey(route: App.Global.TabRoute) {
  const { activeMenu, hideInMenu } = route.handle
  const name = route.pathname
  const routeName = (hideInMenu ? activeMenu : name) || name
  const [, firstLevelRouteName] = routeName.split('/')
  return `/${firstLevelRouteName}`
}

export function getSelectKey(route: Router.Route) {
  const { activeMenu, hideInMenu } = route.handle
  const name = route.pathname as string
  const routeName = (hideInMenu ? activeMenu : name) || name
  return [routeName]
}

export function mergeMenus(menus: App.Global.Menu[], newMenus: App.Global.Menu[]) {
  newMenus.forEach(newMenu => {
    const newMenuKey = newMenu.key.split('/')

    function findAndMergeParent(currentMenus: App.Global.Menu[], menuPath: string[]): boolean {
      for (const menu of currentMenus) {
        const menuKeyParts = menu.key.split('/')
        if (menuKeyParts[1] === menuPath[1]) {
          if (!menu.children) menu.children = []
          if (menuPath.length === 3) {
            menu.children.push(newMenu)
            return true
          }
          return findAndMergeParent(menu.children || [], menuPath.slice(1))
        }
      }
      return false
    }

    if (!findAndMergeParent(menus, newMenuKey)) menus.push(newMenu)
  })

  return menus
}

// ---- 动态菜单（后端菜单树）转换工具 ----

function menuItemToGlobalMenu(item: MenuItem): App.Global.Menu {
  const menu: App.Global.Menu = {
    icon: renderMenuIcon(item.icon),
    key: item.path,
    label: <BeyondHiding title={item.title} />,
    title: item.title
  }

  if (item.children && item.children.length > 0) {
    menu.children = item.children.map(menuItemToGlobalMenu)
  }

  return menu
}

export function menuTreeToGlobalMenus(tree: MenuItem[]): App.Global.Menu[] {
  return tree.map(menuItemToGlobalMenu)
}

export function getFirstLevelKeyFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  return parts.length > 0 ? `/${parts[0]}` : '/'
}

export function getSelectKeyFromPath(pathname: string): string[] {
  return [pathname]
}

/**
 * 从动态菜单树中，根据当前路径找到对应的一级菜单 key（system 节点的 key）
 * system 节点的 key 是数字字符串，不以 / 开头
 */
export function getActiveMenuKeyFromTree(menus: App.Global.Menu[], pathname: string): string {
  for (const menu of menus) {
    if (containsPath(menu, pathname)) {
      return menu.key
    }
  }
  return ''
}

function containsPath(menu: App.Global.Menu, pathname: string): boolean {
  if (menu.key === pathname) return true
  if (menu.children) {
    return menu.children.some(child => containsPath(child, pathname))
  }
  return false
}
