import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

function convert(m: any) {
  const { default: Component } = m
  return { Component }
}

export const Routes = [
  {
    children: [
      {
        index: true,
        element: createElement(Navigate, { to: import.meta.env.VITE_ROUTE_HOME })
      },
      {
        children: [
          {
            children: [
              {
                handle: { icon: 'ic:baseline-block', title: '403' },
                id: 'exception_403',
                lazy: () => import('base-app/pages/common/403').then(convert),
                path: '/exception/403'
              },
              {
                handle: { icon: 'ic:baseline-web-asset-off', title: '404' },
                id: 'exception_404',
                lazy: () => import('base-app/pages/common/404').then(convert),
                path: '/exception/404'
              },
              {
                handle: { icon: 'ic:baseline-wifi-off', title: '500' },
                id: 'exception_500',
                lazy: () => import('base-app/pages/common/500').then(convert),
                path: '/exception/500'
              }
            ],
            handle: { icon: 'ant-design:exception-outlined', order: 4, title: '异常页' },
            id: 'exception',
            path: '/exception'
          }
        ],
        id: '(base)',
        lazy: () => import('@/layouts/base-layout').then(convert)
      },
      {
        handle: { constant: true, title: '登录' },
        id: 'login',
        lazy: () => import('common-app/pages/login').then(convert),
        path: '/login'
      }
    ],
    handle: { title: 'root' },
    id: 'root',
    lazy: () => import('base-app/pages/common/layout').then(convert),
    path: '/'
  }
] satisfies RouteObject[]
