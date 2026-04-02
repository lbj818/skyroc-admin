import { useState } from 'react'

import { setTokens } from '@/features/auth/tokenStore'
import { router } from '@/features/router'
import { initDynamicRoutes } from '@/features/router/initDynamicRoutes'
import { store } from '@/store'

import { getCaptchaApi, getUserInfoApi, loginApi, logoutApi, refreshTokenApi } from '../../api/login'
import type { LoginParams } from '../../api/login'

const SESSION_TOKEN_KEY = 'Authorization'
const SESSION_REFRESH_KEY = 'RefreshToken'

function encodePassword(password: string) {
  return btoa(password)
}

export function useLoginHook() {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [captchaUrl, setCaptchaUrl] = useState('')
  const [captchaLoading, setCaptchaLoading] = useState(false)
  const [requestId, setRequestId] = useState('')

  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')

  async function fetchCaptcha() {
    setCaptchaLoading(true)
    try {
      const data = await getCaptchaApi()
      setRequestId(data.requestId)
      if (data.captchaImg) {
        setCaptchaUrl(`data:image/png;base64,${data.captchaImg}`)
      }
    } finally {
      setCaptchaLoading(false)
    }
  }

  async function toLogin(params: LoginParams) {
    if (loading) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const data = await loginApi({ ...params, password: encodePassword(params.password) })

      if (data.success === false) {
        setErrorMsg(data.message || '登录失败')
        return
      }

      store.dispatch(setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token }))

      const userInfo = await getUserInfoApi()

      // 先加载动态路由，再跳转，避免导航时路由还未注册
      await initDynamicRoutes(router.reactRouter.patchRoutes)

      const target = redirectUrl ? decodeURIComponent(redirectUrl) : import.meta.env.VITE_ROUTE_HOME || '/home'
      router.replace(target)

      window.$notification?.success({
        description: `欢迎回来，${(userInfo as any)?.nickname || (userInfo as any)?.username}！`,
        message: '登录成功'
      })
    } catch {
      setErrorMsg('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return { captchaLoading, captchaUrl, errorMsg, fetchCaptcha, loading, requestId, setErrorMsg, toLogin }
}

export async function doLogout() {
  const token = window.sessionStorage.getItem(SESSION_TOKEN_KEY)
  try {
    if (token) await logoutApi(token)
  } finally {
    // 清空 token、菜单、路由缓存（对齐 Vue3 logout 逻辑）
    const { resetAuth } = await import('@/features/auth/auth')
    resetAuth()
  }
}

export async function doRefreshToken() {
  const refresh = window.sessionStorage.getItem(SESSION_REFRESH_KEY)
  if (!refresh) throw new Error('no refresh token')
  const data = await refreshTokenApi(refresh)
  store.dispatch(setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token }))
  return data.access_token
}
