import type { RouteObject } from 'react-router-dom'

function convert(m: any) {
  const { default: Component } = m
  return { Component }
}

export const BaseChildrenRoutes = [
  {
    children: [
      {
        handle: { icon: 'ic:baseline-block', title: '403' },
        id: 'exception_403',
        lazy: () => import('base-app/pages/_builtin/403').then(convert),
        path: '/exception/403'
      },
      {
        handle: { icon: 'ic:baseline-web-asset-off', title: '404' },
        id: 'exception_404',
        lazy: () => import('base-app/pages/_builtin/404').then(convert),
        path: '/exception/404'
      },
      {
        handle: { icon: 'ic:baseline-wifi-off', title: '500' },
        id: 'exception_500',
        lazy: () => import('base-app/pages/_builtin/500').then(convert),
        path: '/exception/500'
      }
    ],
    handle: { icon: 'ant-design:exception-outlined', order: 4, title: '异常页' },
    id: 'exception',
    path: '/exception'
  }
] satisfies RouteObject[]
