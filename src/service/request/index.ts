import type { AxiosError, AxiosRequestConfig, AxiosResponse } from '@sa/axios';
import { createAxiosInstance } from '@sa/axios';

import { localStg } from '@/utils/storage';

export type { RequestConfigExtra, ResponseBody } from '@sa/axios';
export type { AxiosError, AxiosRequestConfig, AxiosResponse };

const isDev = import.meta.env.DEV;
const isHttpProxy = isDev && import.meta.env.VITE_HTTP_PROXY === 'Y';
const proxyPattern = import.meta.env.VITE_GRC_PROXY_PATTERN || '/proxy-grc';
const BASE_URL = isHttpProxy ? proxyPattern : import.meta.env.VITE_SERVICE_BASE_URL;

const BASIC_AUTH = 'Basic YnJvd3Nlcjpicm93c2Vy';

let authorizing = false;
let authQueue: Array<{ reject: (e: any) => void; req: AxiosRequestConfig; resolve: (v: any) => void }> = [];

export const instance = createAxiosInstance(BASE_URL);

// ---- 请求拦截器：注入 token ----
instance.interceptors.request.use((config: any) => {
  const token = localStg.get('token');
  if (token && config.token !== false) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// ---- 响应拦截器：统一错误处理 ----

async function handle401() {
  const token = localStg.get('token');
  if (!token) return;

  if (!authorizing) {
    authorizing = true;
    try {
      const { resetAuth } = await import('@/features/auth/auth');
      resetAuth();
    } finally {
      authorizing = false;
      authQueue = [];
    }
  }
}

async function handleResponseError(error: AxiosError) {
  if (error.code === 'ECONNABORTED') {
    window.$message?.error('请求超时，请稍后重试');
    return Promise.reject(error);
  }

  if (!error.response) return Promise.reject(error);

  const { data, status, statusText } = error.response as AxiosResponse<any>;
  const msg = data?.msg || data?.message || statusText || '请求失败';

  if (status === 401) {
    if (authorizing) {
      return new Promise((resolve, reject) => {
        authQueue.push({ reject, req: error.response!.config, resolve });
      });
    }
    await handle401();
  } else {
    window.$message?.error(status === 403 ? '无权限访问' : msg);
  }

  return Promise.reject(error);
}

instance.interceptors.response.use((response: AxiosResponse) => response.data, handleResponseError);

// ---- 请求方法 ----

export function get<R = any, T = any>(
  url: string,
  params?: T,
  config?: AxiosRequestConfig & { token?: boolean }
): Promise<R> {
  return instance.request({ method: 'GET', params, url, ...config });
}

export function post<R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & { token?: boolean }
): Promise<R> {
  return instance.request({ data, method: 'POST', url, ...config });
}

export function put<R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & { token?: boolean }
): Promise<R> {
  return instance.request({ data, method: 'PUT', url, ...config });
}

export function del<R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & { token?: boolean }
): Promise<R> {
  return instance.request({ data, method: 'DELETE', url, ...config });
}

/** 登录专用：Basic Auth + form-urlencoded，不携带业务 token */
export function postForm<R = any>(url: string, data: Record<string, string>): Promise<R> {
  return instance.request({
    data: new URLSearchParams(data),
    headers: {
      Authorization: BASIC_AUTH,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    token: false,
    url
  } as any);
}
