import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

export interface ResponseBody<T = any> {
  code?: number | string;
  data?: T;
  message?: string;
  msg?: string;
}

export interface RequestConfigExtra {
  /** 是否携带 token，默认 true */
  token?: boolean;
}

export function createAxiosInstance(baseURL: string): AxiosInstance {
  return axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 300000
  });
}

export type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse };
