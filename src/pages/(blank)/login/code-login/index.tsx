import { useFormRules } from '@/features/form';
import { useRouter } from '@/features/router';

type FormValues = {
  code: string;
  phone: string;
};

const CodeLogin = () => {
  const [form] = AForm.useForm<FormValues>();

  const { getCaptcha, isCounting, label, loading } = useCaptcha();

  const { formRules } = useFormRules();

  const { navigateUp } = useRouter();

  function handleSubmit(params: FormValues) {
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
      <h3 className="text-18px text-primary font-medium">验证码登录</h3>
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

export default CodeLogin;
