import { Outlet } from 'react-router-dom'

import { usePrevious, useRoute } from '@/features/router'
import { useMenuTreeStore } from '@/store/menuTreeStore'
import { useUserStore } from '@/store/userStore'
import { sessionStg } from '@/utils/storage'

const LOGIN_PATH = '/login'
const ALLOW_LIST = ['/login', '/exception/403', '/exception/404', '/exception/500']

function checkIsLogin() {
  return Boolean(sessionStg.get('Authorization'))
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
  const userInfo = useUserStore(s => s.userInfo)
  const { setUserInfo } = useUserStore.getState()

  useEffect(() => {
    if (isLogin && !userInfo) {
      setUserInfo()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, userInfo])

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

  // 已登录但 userInfo 未就绪：等待拉取完成再渲染子页面
  if (isLogin && !userInfo && !isAllowed) {
    return null
  }

  // 已登录但菜单未加载：等待 patchRoutesOnNavigation 完成
  if (isLogin && !menuLoaded && !isAllowed) {
    return null
  }

  return <Outlet context={previousRoute} />
}

export default RootLayout
