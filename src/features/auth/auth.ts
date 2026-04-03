import { router } from '@/features/router'
import { useMenuTreeStore } from '@/store/menuTreeStore'
import { useRouteStore } from '@/store/routeStore'
import { useTabStore } from '@/store/tabStore'
import { useTokenStore } from '@/store/tokenStore'

export function resetAuth() {
  useTokenStore.getState().resetToken()
  useMenuTreeStore.getState().resetMenuTree()
  useTabStore.getState().clearTabs()
  useRouteStore.getState().resetRouteStore()

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
