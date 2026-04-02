import { router } from '@/features/router'
import { store } from '@/store'

import { resetMenuTree } from '../menu/menuTreeStore'
import { resetRouteStore } from '../router/routeStore'
import { clearTabs } from '../tab/tabStore'

import { resetToken } from './tokenStore'

/** 重置认证状态，清除 token、菜单、路由缓存，跳转登录页 */
export function resetAuth() {
  store.dispatch(resetToken())
  store.dispatch(resetMenuTree())
  store.dispatch(clearTabs())
  store.dispatch(resetRouteStore())

  router.resetRoutes()

  const location = router.reactRouter.state.location
  const fullPath = location.pathname + location.search + location.hash
  const isLoginPage = location.pathname.includes('/login')

  if (!isLoginPage) {
    router.push('/login', { query: { redirect: fullPath }, replace: true })
  } else {
    router.replace('/login')
  }
}
