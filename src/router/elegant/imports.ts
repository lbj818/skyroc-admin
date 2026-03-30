export const layouts: Record<string, () => Promise<any>> = {
  '(base)': () => import('@/pages/(base)/layout.tsx'),
  '(blank)': () => import('@/pages/(blank)/layout.tsx'),
  '(blank)_login': () => import('@/pages/(blank)/login/layout.tsx'),
  root: () => import('@/pages/layout.tsx')
};

export const pages: Record<string, () => Promise<any>> = {
  '(base)_home': () => import('@/pages/(base)/home/index.tsx'),
  '(base)_multi-menu': () => import('@/pages/(base)/multi-menu/index.tsx'),
  '(base)_multi-menu_first': () => import('@/pages/(base)/multi-menu/first/index.tsx'),
  '(base)_multi-menu_first_child': () => import('@/pages/(base)/multi-menu/first/child/index.tsx'),
  '(base)_multi-menu_second': () => import('@/pages/(base)/multi-menu/second/index.tsx'),
  '(base)_multi-menu_second_child': () => import('@/pages/(base)/multi-menu/second/child/index.tsx'),
  '(base)_multi-menu_second_child_home': () => import('@/pages/(base)/multi-menu/second/child/home/index.tsx'),
  '(base)_user-center': () => import('@/pages/(base)/user-center/index.tsx'),
  '(blank)_login': () => import('@/pages/(blank)/login/index.tsx'),
  '(blank)_login_code-login': () => import('@/pages/(blank)/login/code-login/index.tsx'),
  '(blank)_login_register': () => import('@/pages/(blank)/login/register/index.tsx'),
  '(blank)_login_reset-pwd': () => import('@/pages/(blank)/login/reset-pwd/index.tsx'),
  '(blank)_login-out': () => import('@/pages/(blank)/login-out/index.tsx'),
  '403': () => import('@/pages/_builtin/403/index.tsx'),
  '404': () => import('@/pages/_builtin/404/index.tsx'),
  '500': () => import('@/pages/_builtin/500/index.tsx'),
  admin_test: () => import('@/pages/admin/test/index.tsx'),
  'iframe-page': () => import('@/pages/_builtin/iframe-page/index.tsx'),
  root: () => import('@/pages/index.tsx')
};

export const errors: Record<string, () => Promise<any>> = {
  root: () => import('@/pages/error.tsx')
};
