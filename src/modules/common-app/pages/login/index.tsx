import { LockOutlined, UserOutlined } from '@ant-design/icons'

import CaptchaField from './CaptchaField'
import { useLoginHook } from './useLogin'

interface LoginFormValues {
  captcha?: string;
  password: string;
  username: string;
}

const LoginPage = () => {
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
    <>
      <h3 className="text-18px text-primary font-medium">账户密码登录</h3>

      {errorMsg && (
        <AAlert
          showIcon
          className="mb-16px mt-8px"
          title={errorMsg}
          type="error"
        />
      )}

      <AForm
        className="pt-24px"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        <AForm.Item
          name="username"
          rules={[{ message: '请输入用户名', required: true }]}
        >
          <AInput
            placeholder="用户名"
            prefix={<UserOutlined className="text-gray-400" />}
            size="large"
          />
        </AForm.Item>

        <AForm.Item
          name="password"
          rules={[{ message: '请输入密码', required: true }]}
        >
          <AInput.Password
            autoComplete="current-password"
            placeholder="密码"
            prefix={<LockOutlined className="text-gray-400" />}
            size="large"
          />
        </AForm.Item>

        {captchaUrl && (
          <CaptchaField
            captchaLoading={captchaLoading}
            captchaUrl={captchaUrl}
            onRefresh={fetchCaptcha}
          />
        )}

        <AForm.Item className="mt-8px">
          <AButton
            block
            htmlType="submit"
            loading={loading}
            shape="round"
            size="large"
            type="primary"
          >
            登录
          </AButton>
        </AForm.Item>
      </AForm>
    </>
  )
}

export default LoginPage
