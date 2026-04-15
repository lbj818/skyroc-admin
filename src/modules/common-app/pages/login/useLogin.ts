import { getCaptchaApi, loginApi, logoutApi, refreshTokenApi } from 'common-app/api/login'
import type { LoginParams } from 'common-app/api/login'
import { useState } from 'react'

import { router } from '@/features/router'
import { initDynamicRoutes } from '@/features/router/dynamic-routes'
import { useTokenStore } from '@/store/tokenStore'
import { useUserStore } from '@/store/userStore'
import { sessionStg } from '@/utils/storage'


function encodePassword(password: string) { return btoa(password) }

export function useLoginHook() {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [captchaUrl, setCaptchaUrl] = useState('')
  const [captchaLoading, setCaptchaLoading] = useState(false)
  const [requestId, setRequestId] = useState('')

  const userInfo = useUserStore(s => s.userInfo)

  async function fetchCaptcha() {
    setCaptchaLoading(true)
    try {
      const data = await getCaptchaApi()
      setRequestId(data.requestId)
      if (data.captchaImg) setCaptchaUrl(`data:image/png;base64,${data.captchaImg}`)
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

      if (data.success === false) { setErrorMsg(data.message || '登录失败'); return }

      useTokenStore.getState().setTokens(data.access_token, data.refresh_token)

      await useUserStore.getState().setUserInfo()
      await initDynamicRoutes(router.reactRouter.patchRoutes)
      const target = import.meta.env.VITE_ROUTE_HOME
      router.replace(target)

      window.$notification?.success({
        description: `欢迎回来，${userInfo?.realName}！`,
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
  const token = sessionStg.get('Authorization')
  try {
    if (token) await logoutApi(token)
  } catch {
    // 退出时 401 是正常的
  } finally {
    const { resetAuth } = await import('@/features/auth/auth')
    resetAuth()
  }
}

export async function doRefreshToken() {
  const refresh = sessionStg.get('RefreshToken')
  if (!refresh) throw new Error('no refresh token')
  const data = await refreshTokenApi(refresh)
  useTokenStore.getState().setTokens(data.access_token, data.refresh_token)
  return data.access_token
}
