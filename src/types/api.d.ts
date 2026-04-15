declare namespace API {
  /** 全局通过表格查询返回结果 */
  type TableListResult<T = any> = {
    list: T
    pagination?: PaginationResult
  }

  /** 全局通用表格分页返回数据结构 */
  type PaginationResult = {
    current: number
    pageSize: number
    total: number
  }

  /** 全局通用表格分页请求参数 */
  type PageParams<T = any> = {
    currentPage?: number
    pageSize?: number
  } & {
    [P in keyof T]?: T[P]
  }

  type ResponseBody<T = any> = {
    /** 业务状态码 */
    code?: number | string
    /** 业务数据 */
    data: T
    /** 后端错误标识 */
    error?: string
    message?: string
    /** 兼容不同字段名的提示信息 */
    msg?: string
    /** 部分接口可能返回的 http 状态位 */
    status?: number
  }
}
