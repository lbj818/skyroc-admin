import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import axios from 'axios'

import { router } from '@/features/router/router'
import { sessionStg } from '@/utils/storage'

export interface RequestConfigExtra {
  /** 是否返回 axios 原始响应 */
  axiosDetail?: boolean
  /** 是否显示 loading */
  loading?: boolean
  /** 是否携带 token，默认 true */
  token?: boolean
  /** 是否自动解包业务 data，默认 false */
  unwrap?: boolean
}

export interface IAxiosResponse<D = any> extends AxiosResponse<D> {
  config: InternalAxiosRequestConfig<D> & RequestConfigExtra
}

const isDev = import.meta.env.DEV
const isHttpProxy = isDev && import.meta.env.VITE_HTTP_PROXY === 'Y'
const proxyPattern = import.meta.env.VITE_GRC_PROXY_PATTERN || '/proxy-grc'
const BASE_URL = isHttpProxy ? proxyPattern : import.meta.env.VITE_SERVICE_BASE_URL

let authorizing = false
let authQueue: Array<{ reject: (e: any) => void; req: AxiosRequestConfig; resolve: (v: any) => void }> = []

export const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 300000
})

function getMenuIdForPath() {
  const { getPathname } = router
  console.log('pathname', getPathname())
  return ''
}

// ---- 请求拦截器：注入 token ----

// ---- 请求拦截器：注入 token ----
function requestHandler(
  config: InternalAxiosRequestConfig & RequestConfigExtra
): InternalAxiosRequestConfig & RequestConfigExtra {
  const menuId = getMenuIdForPath()
  if (menuId) {
    config.headers.set('ApiKey', btoa(menuId))
  }
  const token = sessionStg.get('Authorization')
  if (token && config.token !== false) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
}

type MaybeWrapped<T> = T | API.ResponseBody<T>

function isResponseBody<T>(val: unknown): val is API.ResponseBody<T> {
  return Boolean(val) && typeof val === 'object' && ('code' in (val as any) || 'msg' in (val as any) || 'message' in (val as any))
}

// ---- 响应成功拦截：默认保留业务包装，axiosDetail 时返回完整响应 ----
function responseHandler(response: AxiosResponse<MaybeWrapped<any>>): any {
  const res = response as IAxiosResponse<MaybeWrapped<any>>
  if (res.config.axiosDetail) return res

  const payload = res.data
  if (payload == null) return {}
  if (res.config.unwrap !== true) return payload

  // 兼容两类返回：
  // 1) 业务包装：{ code, data, msg... } → 返回 data
  // 2) 非包装：直接返回对象/数组/token 等 → 原样返回
  if (isResponseBody<any>(payload) && 'data' in payload) {
    return (payload as API.ResponseBody<any>).data
  }
  return payload
}

// ---- 响应拦截器：统一错误处理 ----

async function handle401() {
  const token = sessionStg.get('Authorization')
  if (!token) return

  if (!authorizing) {
    authorizing = true
    try {
      const { resetAuth } = await import('@/features/auth/auth')
      resetAuth()
    } finally {
      authorizing = false
      authQueue = []
    }
  }
}

async function handleResponseError(error: AxiosError) {
  if (error.code === 'ECONNABORTED') {
    window.$message?.error('请求超时，请稍后重试')
    return Promise.reject(error)
  }

  if (!error.response) return Promise.reject(error)

  const { data, status, statusText } = error.response as AxiosResponse<any>
  const msg = data?.msg || data?.message || statusText || '请求失败'

  if (status === 401) {
    if (authorizing) {
      return new Promise((resolve, reject) => {
        authQueue.push({ reject, req: error.response!.config, resolve })
      })
    }
    await handle401()
  } else {
    window.$message?.error(status === 403 ? '无权限访问' : msg)
  }

  return Promise.reject(error)
}

instance.interceptors.request.use(requestHandler)
instance.interceptors.response.use(responseHandler, handleResponseError)

interface AxiosOptions<T = any> extends AxiosRequestConfig<T>, RequestConfigExtra {}

/**
 * 统一的请求入口，行为与 vue3 版的 `instancePromise` 保持一致：
 * - 默认走响应拦截器的 data 提取逻辑
 * - 通过 axiosDetail 控制是否返回完整响应
 */
function request<R = any, T = any>(
  options: AxiosOptions<T> & { axiosDetail?: boolean }
): Promise<R | API.ResponseBody<R> | IAxiosResponse<MaybeWrapped<R>>> {
  const { axiosDetail = false } = options
  options.axiosDetail = axiosDetail
  return instance.request(options as AxiosRequestConfig<T> & RequestConfigExtra) as any
}

// ---- 请求方法 ----

export function get<R = any, T = any>(
  url: string,
  params?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<API.ResponseBody<R>> {
  return request<R, T>({
    url,
    params,
    method: 'GET',
    unwrap: false,
    axiosDetail: false as const,
    ...(config as AxiosRequestConfig<T> & RequestConfigExtra)
  }) as Promise<API.ResponseBody<R>>
}

export function post<R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<API.ResponseBody<R>> {
  return request<R, T>({
    url,
    data,
    method: 'POST',
    unwrap: false,
    axiosDetail: false as const,
    ...(config as AxiosRequestConfig<T> & RequestConfigExtra)
  }) as Promise<API.ResponseBody<R>>
}

export function put<R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<API.ResponseBody<R>> {
  return request<R, T>({
    url,
    data,
    method: 'PUT',
    unwrap: false,
    axiosDetail: false as const,
    ...(config as AxiosRequestConfig<T> & RequestConfigExtra)
  }) as Promise<API.ResponseBody<R>>
}

export function del<R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<API.ResponseBody<R>> {
  return request<R, T>({
    url,
    data,
    method: 'DELETE',
    unwrap: false,
    axiosDetail: false as const,
    ...(config as AxiosRequestConfig<T> & RequestConfigExtra)
  }) as Promise<API.ResponseBody<R>>
}

export function getUnwrapped<R = any, T = any>(
  url: string,
  params?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<R> {
  return request<R, T>({
    url,
    params,
    method: 'GET',
    unwrap: true,
    axiosDetail: false as const,
    ...(config as AxiosRequestConfig<T> & RequestConfigExtra)
  }) as Promise<R>
}

export function postUnwrapped<R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<R> {
  return request<R, T>({
    url,
    data,
    method: 'POST',
    unwrap: true,
    axiosDetail: false as const,
    ...(config as AxiosRequestConfig<T> & RequestConfigExtra)
  }) as Promise<R>
}

export function useRequestUnwrapped<T = any, R = any>(
  props: AxiosRequestConfig<T> & RequestConfigExtra
): Promise<R> {
  return request<R, T>({ ...props, unwrap: true, axiosDetail: false as const }) as Promise<R>
}

export default function useRequest<T = any, R = any>(
  props: AxiosRequestConfig<T> & RequestConfigExtra
): Promise<API.ResponseBody<R>> {
  return request<R, T>({ ...props, unwrap: false, axiosDetail: false as const }) as Promise<API.ResponseBody<R>>
}
