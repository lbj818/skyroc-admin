import request from '@/utils/request'

export interface MenuApiResponse {
  menus: RawMenuItem[];
  system: RawSystemItem[];
}

export interface RawMenuItem {
  cacheFlag: number;
  componentPath: string;
  id: string;
  iframeFlag?: string;
  iframeUrl?: string;
  menuCode: string;
  menuIcon?: string;
  menuName: string;
  menuPath: string;
  parentId: string;
  routingParameters?: string;
  systemKey: number;
}

export interface RawSystemItem {
  icon?: string;
  systemKey: number;
  systemName: string;
}

/**
 * 查询当前用户所有菜单
 */
export function getMenuTreeCurrentUserAll() {
  return request<void, MenuApiResponse>({
    url: '/admin/sysmenu/queryCurrentUserAllMenu',
    method: 'get',
  })
}
