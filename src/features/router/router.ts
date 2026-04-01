import type { RouterNavigateOptions, To } from 'react-router-dom';
import { createBrowserRouter, createHashRouter, matchRoutes } from 'react-router-dom';

import { globalConfig } from '@/config';
import { routes } from '@/router';
import { store } from '@/store';

import { selectIsLogin } from '../auth/tokenStore';

import { initDynamicRoutes } from './initDynamicRoutes';
import { type LocationQueryRaw, stringifyQuery } from './query';
import { setCacheRoutes } from './routeStore';

function createRouterInstance() {
  const routerCreator = globalConfig.routerMode === 'hash' ? createHashRouter : createBrowserRouter;
  return routerCreator;
}

function initRouter() {
  let isAlreadyPatch = false;

  function getIsNeedPatch(path: string) {
    if (!selectIsLogin(store.getState())) return false;
    if (isAlreadyPatch) return false;

    const matchRoute = matchRoutes(routes, { pathname: path }, import.meta.env.VITE_BASE_URL);

    if (!matchRoute || matchRoute.length < 2) return true;

    const deepest = matchRoute.at(-1);
    return deepest?.route.path === '*' || deepest?.route.id === 'notFound';
  }

  const routerCreator = createRouterInstance();

  const reactRouter = routerCreator(routes, {
    basename: import.meta.env.VITE_BASE_URL,
    patchRoutesOnNavigation: async ({ patch, path }) => {
      if (getIsNeedPatch(path)) {
        isAlreadyPatch = true;
        await initDynamicRoutes(patch);
      }
    }
  });

  store.dispatch(setCacheRoutes([]));

  if (selectIsLogin(store.getState()) && !isAlreadyPatch) {
    initDynamicRoutes(reactRouter.patchRoutes);
  }

  function resetRoutes() {
    isAlreadyPatch = false;
    reactRouter._internalSetRoutes(routes);
  }

  return { reactRouter, resetRoutes };
}

type ExtendedNavigateOptions = RouterNavigateOptions & { query?: LocationQueryRaw };

function buildPathWithQuery(path: To, query?: LocationQueryRaw): To {
  if (!query) return path;
  const pathStr = typeof path === 'string' ? path : path.pathname || '';
  return `${pathStr}?${stringifyQuery(query)}` as To;
}

function navigator() {
  const { reactRouter, resetRoutes } = initRouter();

  function back() {
    reactRouter.navigate(-1);
  }
  function forward() {
    reactRouter.navigate(1);
  }
  function go(delta: number) {
    reactRouter.navigate(delta);
  }
  function reload() {
    reactRouter.navigate(0);
  }
  function navigateUp() {
    reactRouter.navigate('..');
  }
  function canGoBack() {
    return window.history.length > 1;
  }
  function getLocation() {
    return reactRouter.state.location;
  }
  function getPathname() {
    return reactRouter.state.location.pathname;
  }
  function getSearch() {
    return reactRouter.state.location.search;
  }
  function getHash() {
    return reactRouter.state.location.hash;
  }
  function getState() {
    return reactRouter.state.location.state;
  }

  async function navigate(path: To | null, options?: RouterNavigateOptions) {
    reactRouter.navigate(path, options);
  }

  function goHome(options?: RouterNavigateOptions) {
    reactRouter.navigate(globalConfig.homePath, options);
  }

  function replace(path: To, options?: ExtendedNavigateOptions) {
    const { query, ...rest } = options || {};
    reactRouter.navigate(buildPathWithQuery(path, query), { ...rest, replace: true });
  }

  function push(path: To, options?: ExtendedNavigateOptions) {
    const { query, ...rest } = options || {};
    reactRouter.navigate(buildPathWithQuery(path, query), rest);
  }

  function goTo(path: To, options?: ExtendedNavigateOptions) {
    push(path, options);
  }

  return {
    back,
    canGoBack,
    forward,
    getHash,
    getLocation,
    getPathname,
    getSearch,
    getState,
    go,
    goHome,
    goTo,
    navigate,
    navigateUp,
    push,
    reactRouter,
    reload,
    replace,
    resetRoutes
  };
}

export const router = navigator();
export type RouterContextType = Awaited<ReturnType<typeof navigator>>;
