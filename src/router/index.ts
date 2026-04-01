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
        lazy: () => import('@/layouts/base-layout').then(convert)
      },
      {
        children: [
          {
            handle: { constant: true, title: '登录' },
            id: '(blank)_login',
            lazy: () => import('common-app/pages/login/index.tsx').then(convert),
            path: '/login'
          }
        ],
        handle: { constant: true },
        id: '(blank)',
        lazy: () => import('common-app/pages/login/layout.tsx').then(convert)
      }
    ],
    handle: { constant: true, title: 'root' },
    id: 'root',
    lazy: () => import('@/pages/layout.tsx').then(convert),
    path: '/'
  }
];

export const allRoutes = routes;
export { routes };
