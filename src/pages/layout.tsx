import { Outlet } from 'react-router-dom';

import { selectMenuLoaded } from '@/features/menu/menuTreeStore';
import { usePrevious, useRoute } from '@/features/router';
import { initDynamicRoutes } from '@/features/router/initDynamicRoutes';
import { router } from '@/features/router/router';
import { localStg } from '@/utils/storage';

const LOGIN_PATH = '/login';
const ALLOW_LIST = ['/login', '/login-out', '/exception/403', '/exception/404', '/exception/500'];

const RootLayout = () => {
  const route = useRoute();
  const previousRoute = usePrevious(route);

  const { handle, id, pathname } = route;
  const menuLoaded = useAppSelector(selectMenuLoaded);

  // 路由守卫状态：null=放行，string=重定向，'loading'=等待动态路由
  const [guardState, setGuardState] = useState<'loading' | null | string>(null);
  const processedRouteId = useRef<string>(null);

  useEffect(() => {
    document.title = handle?.title ?? '';
  }, [handle?.title]);

  useEffect(() => {
    window.NProgress?.done?.();
    return () => {
      window.NProgress?.start?.();
    };
  }, [pathname]);

  useEffect(() => {
    // 路由 id 变化时重新执行守卫逻辑（对齐 Vue3 beforeEach）
    if (processedRouteId.current === id) return;
    processedRouteId.current = id;

    const isLogin = Boolean(localStg.get('token'));
    const isAllowed = ALLOW_LIST.includes(pathname) || handle?.constant;

    if (!isLogin) {
      if (!isAllowed) {
        setGuardState(`${LOGIN_PATH}?redirect=${encodeURIComponent(route.fullPath)}`);
      } else {
        setGuardState(null);
      }
      return;
    }

    // 已登录访问登录页 → 跳首页
    if (pathname === LOGIN_PATH) {
      setGuardState(import.meta.env.VITE_ROUTE_HOME || '/home');
      return;
    }

    // 外链路由
    if (handle?.href) {
      window.open(handle.href, '_blank');
      setGuardState(null);
      return;
    }

    // 有 token 但菜单未加载（对齐 Vue3：!userStore.userInfo 时拉取动态路由）
    if (!menuLoaded && !isAllowed) {
      setGuardState('loading');

      initDynamicRoutes(router.reactRouter.patchRoutes).then(() => {
        // 动态路由加载完成后，replace 当前路由触发重新匹配（对齐 Vue3 next({ ...to, replace: true })）
        router.replace(route.fullPath);
      }).catch(() => {
        setGuardState(`${LOGIN_PATH}?redirect=${encodeURIComponent(route.fullPath)}`);
      });

      return;
    }

    setGuardState(null);
  }, [id]);

  if (guardState === 'loading') {
    return null; // 等待动态路由加载，可替换为 loading 组件
  }

  if (guardState) {
    return (
      <Navigate
        replace
        to={guardState}
      />
    );
  }

  return <Outlet context={previousRoute} />;
};

export default RootLayout;
