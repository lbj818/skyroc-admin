import { useFormRules } from '@/features/form';
import { useRouter } from '@/features/router';

interface FormModel {
  code: string;
  confirmPassword: string;
  password: string;
  phone: string;
}

const Register = () => {
  const { getCaptcha, isCounting, label, loading } = useCaptcha();

  const { navigateUp } = useRouter();

  const [form] = AForm.useForm<FormModel>();

  const { createConfirmPwdRule, formRules } = useFormRules();

  function handleSubmit(params: FormModel) {
    console.log(params);
    window.$message?.success('验证成功');
  }

  function sendCaptcha() {
    getCaptcha('17260711111');
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <h3 className="text-18px text-primary font-medium">注册账号</h3>
      <AForm
        className="pt-24px"
        form={form}
        onFinish={handleSubmit}
      >
        <AForm.Item
          name="phone"
          rules={formRules.phone}
        >
          <AInput placeholder="请输入手机号" />
        </AForm.Item>
        <AForm.Item
          name="code"
          rules={formRules.code}
        >
          <div className="w-full flex-y-center gap-16px">
            <AInput placeholder="请输入验证码" />
            <AButton
              disabled={isCounting}
              loading={loading}
              size="large"
              onClick={sendCaptcha}
            >
              {label}
            </AButton>
          </div>
        </AForm.Item>
        <AForm.Item
          name="password"
          rules={formRules.pwd}
        >
          <AInput placeholder="请输入密码" />
        </AForm.Item>
        <AForm.Item
          name="confirmPassword"
          rules={createConfirmPwdRule(form)}
        >
          <AInput placeholder="请再次输入密码" />
        </AForm.Item>
        <ASpace
          className="w-full"
          direction="vertical"
          size={18}
        >
          <AButton
            block
            htmlType="submit"
            shape="round"
            size="large"
            type="primary"
          >
            确认
          </AButton>

          <AButton
            block
            shape="round"
            size="large"
            onClick={navigateUp}
          >
            返回
          </AButton>
        </ASpace>
      </AForm>
    </>
  );
};

export default Register;
