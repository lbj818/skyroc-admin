import { Outlet } from 'react-router-dom'

import { usePrevious, useRoute } from '@/features/router'
import { useMenuTreeStore } from '@/store/menuTreeStore'

const LOGIN_PATH = '/login'
const ALLOW_LIST = ['/login', '/login-out', '/exception/403', '/exception/404', '/exception/500']

function checkIsLogin() {
  return Boolean(window.sessionStorage.getItem('Authorization'))
}

const RootLayout = () => {
  const route = useRoute()
  const previousRoute = usePrevious(route)

  const { handle, pathname } = route
  const menuLoaded = useMenuTreeStore(s => s.loaded)

  useEffect(() => {
    document.title = handle?.title ?? ''
  }, [handle?.title])

  useEffect(() => {
    window.NProgress?.done?.()
    return () => {
      window.NProgress?.start?.()
    }
  }, [pathname])

  const isLogin = checkIsLogin()
  const isAllowed = ALLOW_LIST.includes(pathname) || handle?.constant

  // 未登录 + 非白名单 → 跳登录页
  if (!isLogin && !isAllowed) {
    return (
      <Navigate
        replace
        to={`${LOGIN_PATH}?redirect=${encodeURIComponent(route.fullPath)}`}
      />
    )
  }

  // 已登录 + 访问登录页 → 跳首页
  if (isLogin && pathname === LOGIN_PATH) {
    return (
      <Navigate
        replace
        to={import.meta.env.VITE_ROUTE_HOME || '/home'}
      />
    )
  }

  // 外链路由
  if (handle?.href) {
    window.open(handle.href, '_blank')
    return <Outlet context={previousRoute} />
  }

  // 已登录但菜单未加载：等待 patchRoutesOnNavigation 完成
  if (isLogin && !menuLoaded && !isAllowed) {
    return null
  }

  return <Outlet context={previousRoute} />
}

export default RootLayout
