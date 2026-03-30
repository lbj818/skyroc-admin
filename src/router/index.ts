import type { RouteObject } from 'react-router-dom';

import { BaseChildrenRoutes } from './routes/builtin';

function convert(m: any) {
  const { default: Component } = m;
  return { Component };
}

const routes: RouteObject[] = [
  {
    children: [
      {
        children: BaseChildrenRoutes,
        id: '(base)',
        lazy: () => import('@/pages/(base)/layout.tsx').then(convert)
      }
    ],
    handle: { constant: true, title: 'root' },
    id: 'root',
    lazy: () => import('@/pages/layout.tsx').then(convert),
    path: '/'
  }
];

export const allRoutes = routes;
export const authRoutes: Router.SingleAuthRoute[] = [];
export const initCacheRoutes: string[] = [];
export { routes };
