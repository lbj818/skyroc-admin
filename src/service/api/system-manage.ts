import { get } from '../request'
import { SYSTEM_MANAGE_URLS } from '../urls'

export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return get<Api.SystemManage.RoleList>(SYSTEM_MANAGE_URLS.GET_ROLE_LIST, params)
}

export function fetchGetAllRoles() {
  return get<Api.SystemManage.AllRole[]>(SYSTEM_MANAGE_URLS.GET_ALL_ROLES)
}

export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return get<Api.SystemManage.UserList>(SYSTEM_MANAGE_URLS.GET_USER_LIST, params)
}

export function fetchGetMenuList() {
  return get<Api.SystemManage.MenuList>(SYSTEM_MANAGE_URLS.GET_MENU_LIST)
}

export function fetchGetAllPages() {
  return get<string[]>(SYSTEM_MANAGE_URLS.GET_ALL_PAGES)
}

export function fetchGetMenuTree() {
  return get<Api.SystemManage.MenuTree[]>(SYSTEM_MANAGE_URLS.GET_MENU_TREE)
}
