import request from '@/utils/request'

export interface SysOrgEntity {
  /** 业务审批权限标志 */
  auditPowerFlag: number;
  /** 删除标志 */
  delFlag: number;
  /** 总行标志 */
  headFlag: number;
  /** 机构ID */
  id?: string;
  /** 合规部标志 */
  leagalFlag: number;
  /** 机构领导id */
  manager: string;
  /** 机构领导名称 */
  managerName: string;
  /** 机构编码 */
  organCode: string;
  /** 机构级别 */
  organLevel: number;
  /** 机构级别归类 */
  organLevelType: number;
  /** 机构描述 */
  orgDescription: string;
  /** 机构名称 */
  orgName: string;
  /** 排序 */
  orgSequence: number;
  /** 机构类型 */
  orgType: number;
  /** 父机构id */
  parentId: string;
  /** 是否虚拟机构 */
  visualFlag: number;
}

export interface SysOrgAddParams {
  /** 业务审批权限标志 */
  auditPowerFlag: number;
  /** 删除标志 */
  delFlag: number;
  /** 总行标志 */
  headFlag: number;
  /** 机构ID */
  id?: string;
  /** 合规部标志 */
  leagalFlag: number;
  /** 机构领导id */
  manager: string;
  /** 机构领导名称 */
  managerName: string;
  /** 机构编码 */
  organCode: string;
  /** 机构级别 */
  organLevel: number;
  /** 机构级别归类 */
  organLevelType: number;
  /** 机构描述 */
  orgDescription: string;
  /** 机构名称 */
  orgName: string;
  /** 排序 */
  orgSequence: number;
  /** 机构类型 */
  orgType: number;
  /** 父机构id */
  parentId: string;
  /** 是否虚拟机构 */
  visualFlag: number;
}

export interface SysOrgUpdateParams extends SysOrgAddParams {
  id: string;
}

export interface SysOrgDeleteParams {
  /** 机构ID */
  id: string;
}

export interface LazyLoadOrgTreeResult {
  /** 机构id */
  key: string
  /** 父级id */
  parentId: string
  /** 父级名称 */
  parentName: string
  /** 租户编码 */
  tenantCode: string
  /** 租户名称 */
  tenantName: string
  /** 机构名称 */
  title: string
}

export interface LazyLoadOrgTreeParams {
  /** 搜索关键词 */
  key?: string
  /** 机构级别 */
  orgLevel?: number
  /** 搜索类型 */
  searchType: string
}

// 新增机构
export function addSysOrg(parameter: SysOrgAddParams) {
  return request({
    url: '/admin/sysorg/addSysOrg',
    method: 'post',
    data: parameter,
  })
}

// 删除机构
export function deleteSysOrg(parameter: SysOrgDeleteParams) {
  return request({
    url: '/admin/sysorg/deleteSysOrg',
    method: 'post',
    params: parameter
  })
}

// 编辑机构
export function updateSysOrg(parameter: SysOrgUpdateParams) {
  return request({
    url: '/admin/sysorg/updateSysOrg',
    method: 'put',
    data: parameter
  })
}

// 查询机构
export function querySysOrg(parameter: API.PageParams<SysOrgAddParams>) {
  return request<API.PageParams<SysOrgAddParams>, SysOrgEntity[]>({
    url: '/admin/sysorg/querySysOrg',
    method: 'get',
    params: parameter
  })
}

// 查询机构树(全部)
export function getSysOrgTreeAll(parameter: LazyLoadOrgTreeParams) {
  return request<LazyLoadOrgTreeParams, LazyLoadOrgTreeResult[]>({
    url: '/admin/sysorg/searchAllOrg',
    method: 'get',
    params: parameter
  })
}

// 查询机构详情
export function querySysOrgDetail(parameter: { id: string }) {
  return request<{ id: string }, SysOrgEntity>({
    url: '/admin/sysorg/querySysOrgDetail',
    method: 'post',
    params: parameter
  })
}

// 查询机构树
export function querySysOrgTree(parameter: void) {
  return request<void, SysOrgEntity[]>({
    url: '/admin/sysorg/querySysOrgTree',
    method: 'get',
    params: parameter
  })
}
