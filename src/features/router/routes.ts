import type { RouteObject } from 'react-router-dom'

/** 获取 (base) 布局下的子路由，供静态菜单模式使用 */
export function getBaseChildrenRoutes(routes: RouteObject[]) {
  return routes[0].children?.find(item => item.id === '(base)')?.children || []
}
