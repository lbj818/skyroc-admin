import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { getPaletteColorByNumber, mixColor } from '@sa/color'

import FlipText from '@/components/FilpText'
import SystemLogo from '@/components/SystemLogo'
import WaveBg from '@/components/WaveBg'
import { ThemeSchemaSwitch, useTheme } from '@/features/theme'
import { useThemeStore } from '@/store/themeStore'

import { useLoginHook } from './useLogin'

const COLOR_WHITE = '#ffffff'

interface LoginFormValues {
  captcha?: string
  password: string
  username: string
}

const LoginPage = () => {
  const { darkMode } = useTheme()
  const { themeColor } = useThemeStore(s => s.settings)
  const bgThemeColor = darkMode ? getPaletteColorByNumber(themeColor, 600) : themeColor
  const bgColor = mixColor(COLOR_WHITE, themeColor, darkMode ? 0.5 : 0.2)

  const [form] = AForm.useForm<LoginFormValues>()
  const { captchaLoading, captchaUrl, errorMsg, fetchCaptcha, loading, requestId, setErrorMsg, toLogin } = useLoginHook()

  function handleValuesChange() {
    if (errorMsg) setErrorMsg(null)
  }

  async function handleSubmit(values: LoginFormValues) {
    await toLogin({
      algorithm: 'base64',
      captcha: values.captcha,
      password: values.password,
      requestId,
      username: values.username
    })
  }

  return (
    <div
      className="relative size-full flex-center overflow-hidden bg-layout"
      style={{ backgroundColor: bgColor }}
    >
      <WaveBg themeColor={bgThemeColor} />
      <ACard className="relative z-4 w-auto rd-12px" variant="borderless">
        <div className="w-400px lt-sm:w-300px">
          <header className="flex-y-center justify-between">
            <SystemLogo className="h-64px w-64px text-primary lt-sm:h-48px lt-sm:w-48px" />
            <FlipText className="text-28px text-primary font-500 lt-sm:text-22px" word="数智化合规系统" />
            <ThemeSchemaSwitch className="text-20px lt-sm:text-18px" showTooltip={false} />
          </header>
          <main className="pt-24px">
            <h3 className="text-18px text-primary font-medium">账户密码登录</h3>
            {errorMsg && <AAlert showIcon className="mb-16px mt-8px" title={errorMsg} type="error" />}
            <AForm className="pt-24px" form={form} onFinish={handleSubmit} onValuesChange={handleValuesChange}>
              <AForm.Item name="username" rules={[{ message: '请输入用户名', required: true }]}>
                <AInput placeholder="用户名" prefix={<UserOutlined className="text-gray-400" />} size="large" />
              </AForm.Item>
              <AForm.Item name="password" rules={[{ message: '请输入密码', required: true }]}>
                <AInput.Password autoComplete="current-password" placeholder="密码" prefix={<LockOutlined className="text-gray-400" />} size="large" />
              </AForm.Item>
              {captchaUrl && (
                <AForm.Item name="captcha" rules={[{ message: '请输入验证码', required: true }]}>
                  <ASpace>
                    <AInput placeholder="验证码" size="large" />
                    <ASpin spinning={captchaLoading}>
                      <img alt="验证码" className="h-40px w-120px cursor-pointer rounded-8px" src={captchaUrl} onClick={fetchCaptcha} />
                    </ASpin>
                  </ASpace>
                </AForm.Item>
              )}
              <AForm.Item className="mt-8px">
                <AButton block htmlType="submit" loading={loading} shape="round" size="large" type="primary">
                  登录
                </AButton>
              </AForm.Item>
            </AForm>
          </main>
        </div>
      </ACard>
    </div>
  )
}

export default LoginPage
