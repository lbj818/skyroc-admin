import { del, get, postForm } from '@/service/request'

export interface LoginParams {
  algorithm: string;
  captcha?: string;
  password: string;
  requestId?: string;
  username: string;
}

export interface LoginResult {
  access_token: string;
  expires_in: number;
  message: string;
  refresh_token: string;
  scope: string;
  success: boolean;
  token_type: string;
  vo?: { errCode: string };
}

export interface RefreshTokenResult {
  access_token: string;
  refresh_token: string;
}

export interface CaptchaResult {
  captchaFlag: string;
  captchaImg: string;
  requestId: string;
}

export interface UserInfo {
  deptKey: string
  deptName: string
  email: string
  headFlag: boolean
  id: number | string
  leaglFlag: string
  mobile: string
  organKey: string
  organLevel: number
  organLevelType: number
  organName: string
  prefix: string
  realName: string
  roleCodes?: (string | number)[]
  roles?: (string | number)[]
  systems: Array<any>
  tenantCode: string
  tenantName: string
  username: string
}

/** 登录 */
export function loginApi(params: LoginParams) {
  return postForm<LoginResult>('/uaa/oauth2/token', {
    algorithm: params.algorithm,
    captcha: params.captcha || '',
    client_id: 'browser',
    grant_type: 'password',
    password: params.password,
    requestId: params.requestId || '',
    scope: 'ui',
    type: 'account',
    username: params.username
  })
}

/** 退出登录 */
export function logoutApi(accessToken: string) {
  return del(
    '/uaa/token/logout',
    { access_token: accessToken },
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  )
}

/** 刷新 token */
export function refreshTokenApi(refreshToken: string) {
  return postForm<RefreshTokenResult>('/uaa/oauth2/token', {
    client_id: 'browser',
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  })
}

/** 获取图形验证码 */
export function getCaptchaApi() {
  return get<CaptchaResult>(
    '/uaa/captcha',
    {},
    {
      headers: { Accept: '*/*' },
      token: false
    }
  )
}

/** 获取当前登录用户信息 */
export function getUserInfoApi() {
  return get<UserInfo>('/uaa/users/getLoginUserInfo')
}
