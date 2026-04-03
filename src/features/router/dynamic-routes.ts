import type { RouteObject } from 'react-router-dom'

import { useMenuTreeStore } from '@/store/menuTreeStore'
import type { MenuItem } from '@/store/menuTreeStore'
import { get } from '@/utils/request'
import type { ResponseBody } from '@/utils/request'

interface RawMenuItem {
  cacheFlag: number;
  componentPath: string;
  id: string;
  iframeFlag?: string;
  iframeUrl?: string;
  menuCode: string;
  menuIcon?: string;
  menuName: string;
  menuPath: string;
  parentId: string;
  routingParameters?: string;
  systemKey: number;
}

interface RawSystemItem {
  icon?: string;
  systemKey: number;
  systemName: string;
}

interface MenuApiResponse {
  menus: RawMenuItem[];
  system: RawSystemItem[];
}

function formatMenuData(raw: ResponseBody<MenuApiResponse> | null | undefined): MenuItem[] {
  const payload = raw?.data
  const menus: RawMenuItem[] = payload?.menus ?? []
  const system: RawSystemItem[] = payload?.system ?? []

  const formattedMenus: MenuItem[] = menus.map(item => ({
    children: [],
    component: item.componentPath,
    icon: item.menuIcon || 'FileTextOutlined',
    id: item.id,
    iframeFlag: item.iframeFlag,
    iframeUrl: item.iframeUrl,
    keepAlive: item.cacheFlag === 1,
    name: item.menuCode,
    parentId: item.parentId === '0' ? item.systemKey : item.parentId,
    path: item.menuPath,
    routingParameters: item.routingParameters,
    title: item.menuName
  }))

  const formattedSystems: MenuItem[] = system.map(item => ({
    children: [],
    icon: item.icon || 'FileTextOutlined',
    id: item.systemKey,
    keepAlive: false,
    name: String(item.systemKey),
    path: String(item.systemKey),
    title: item.systemName
  }))

  return [...formattedMenus, ...formattedSystems]
}

function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const map = new Map<string | number, MenuItem>()
  const roots: MenuItem[] = []

  items.forEach(item => map.set(item.id, { ...item, children: [] }))

  items.forEach(item => {
    if (!item.parentId) {
      roots.push(map.get(item.id)!)
    } else {
      const parent = map.get(item.parentId)
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.push(map.get(item.id)!)
      } else {
        roots.push(map.get(item.id)!)
      }
    }
  })

  return roots
}

function getPageComponent(componentPath: string) {
  const modules = import.meta.glob([
    '/src/modules/**/*.tsx',
    '/src/modules/**/*.ts',
    '/src/modules/**/*.jsx',
    '/src/modules/**/*.js'
  ])

  const normalizedPath = componentPath.startsWith('/') ? componentPath.slice(1) : componentPath

  const candidates = [
    `/src/modules/${normalizedPath}.tsx`,
    `/src/modules/${normalizedPath}/index.tsx`,
    `/src/modules/${normalizedPath}.ts`,
    `/src/modules/${normalizedPath}/index.ts`
  ]

  for (const path of candidates) {
    if (modules[path]) return modules[path]
  }

  if (import.meta.env.DEV) {
    console.warn(`[route] 找不到组件: "${componentPath}"，尝试路径:`, candidates)
  }

  return () => import('base-app/pages/common/error')
}

/** 递归收集所有叶子路由，全部平铺注册（对齐 Vue3 generateFlatRoutes）。 父级菜单节点（含 system 分组）只用于菜单树展示，不参与路由注册。 */
function collectFlatRoutes(items: MenuItem[]): RouteObject[] {
  const routes: RouteObject[] = []

  for (const item of items) {
    // 有子菜单：递归收集子路由，自身不注册
    if (item.children && item.children.length > 0) {
      routes.push(...collectFlatRoutes(item.children))
      continue
    }

    // 叶子节点且路径无效（system 节点 path 为纯数字）：跳过
    if (!item.path.startsWith('/')) continue

    routes.push({
      handle: {
        icon: item.icon,
        keepAlive: item.keepAlive,
        title: item.title,
        url: item.iframeFlag === '1' ? item.iframeUrl : undefined
      } as Router.RouteHandle,
      id: item.name,
      lazy: async () => {
        const loader = getPageComponent(item.component || item.path)
        const mod = await loader()
        return { Component: (mod as any).default }
      },
      path: item.path
    })
  }

  return routes
}

export async function initDynamicRoutes(
  addRoutes: (parent: string | null, routes: RouteObject[]) => void
): Promise<void> {
  const raw = await get<MenuApiResponse>('/admin/sysmenu/queryCurrentUserAllMenu')

  if (!raw) return

  const flatItems = formatMenuData(raw)
  const menuTree = buildMenuTree(flatItems)

  // 菜单树（含 system 分组）存入 store，供侧边栏渲染
  useMenuTreeStore.getState().setMenuTree(menuTree)

  // 所有路由平铺注册到 (base) 下，不做嵌套
  const routes = collectFlatRoutes(menuTree)
  addRoutes('(base)', routes)
}
