import type { RouteObject } from 'react-router-dom';

function convert(m: any) {
  const { default: Component } = m;
  return { Component };
}

export const BaseChildrenRoutes = [
  {
    children: [
      {
        handle: { icon: 'ic:baseline-block', title: '403' },
        id: 'exception_403',
        lazy: () => import('@/pages/_builtin/403').then(convert),
        path: '/exception/403'
      },
      {
        handle: { icon: 'ic:baseline-web-asset-off', title: '404' },
        id: 'exception_404',
        lazy: () => import('@/pages/_builtin/404').then(convert),
        path: '/exception/404'
      },
      {
        handle: { icon: 'ic:baseline-wifi-off', title: '500' },
        id: 'exception_500',
        lazy: () => import('@/pages/_builtin/500').then(convert),
        path: '/exception/500'
      }
    ],
    handle: { icon: 'ant-design:exception-outlined', order: 4, title: '异常页' },
    id: 'exception',
    path: '/exception'
  },
  {
    children: [
      {
        handle: { icon: 'logos:ant-design', order: 7, title: 'Ant Design 文档', url: 'https://ant.design/index-cn' },
        id: 'document_antd',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/antd'
      },
      {
        handle: {
          icon: 'logos:ant-design',
          order: 8,
          title: 'ProComponents 文档',
          url: 'https://pro-components.antdigital.dev/'
        },
        id: 'document_procomponents',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/procomponents'
      },
      {
        handle: { localIcon: 'logo', order: 0, title: 'UI', url: 'https://ui-play.skyroc.me/button' },
        id: 'document_ui',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/ui'
      },
      {
        handle: { localIcon: 'logo', order: 1, title: '项目文档', url: 'https://admin-docs.skyroc.me' },
        id: 'document_project',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/project'
      },
      {
        handle: { href: 'https://admin-docs.skyroc.me', localIcon: 'logo', order: 2, title: '项目文档(外链)' },
        id: 'document_project-link',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/project-link'
      },
      {
        handle: { icon: 'logos:unocss', order: 5, title: 'UnoCSS 文档', url: 'https://unocss.dev/' },
        id: 'document_unocss',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/unocss'
      },
      {
        handle: { icon: 'logos:vitejs', order: 4, title: 'Vite 文档', url: 'https://cn.vitejs.dev/' },
        id: 'document_vite',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/vite'
      },
      {
        handle: { icon: 'logos:react', order: 3, title: 'React 文档', url: 'https://react.dev/' },
        id: 'document_react',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/react'
      }
    ],
    handle: { icon: 'mdi:file-document-multiple-outline', order: 2, title: '文档' },
    id: 'document',
    path: '/document'
  },
  {
    handle: { icon: 'mdi:file-document-multiple-outline', order: 2, title: '测试' },
    id: 'test',
    lazy: () => import('@/pages/admin/test/index.tsx').then(convert),
    path: '/test'
  }
] satisfies RouteObject[];
