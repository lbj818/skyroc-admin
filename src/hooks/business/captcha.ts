import { useCountDownTimer, useLoading } from '@sa/hooks'

import { REG_PHONE } from '@/constants/reg'

export function useCaptcha() {
  const { endLoading, loading, startLoading } = useLoading()
  const { count, isCounting, start } = useCountDownTimer(10)
  const label = useMemo(() => {
    let text = '获取验证码'
    if (loading) text = ''
    if (isCounting) text = `${count}秒后重新获取`
    return text
  }, [count, loading, isCounting])

  function isPhoneValid(phone: string) {
    if (phone.trim() === '') {
      return false
    }

    if (!REG_PHONE.test(phone)) {
      return false
    }

    return true
  }
  async function getCaptcha(phone: string) {
    const valid = isPhoneValid(phone)

    if (!valid || loading) {
      return
    }

    startLoading()

    // request
    await new Promise(resolve => {
      setTimeout(resolve, 500)
    })

    start()

    endLoading()
  }

  return {
    getCaptcha,
    isCounting,
    label,
    loading
  }
}
