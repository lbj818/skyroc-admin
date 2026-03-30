import { useInitAuth } from '@/features/auth/auth';
import { useFormRules } from '@/features/form';

type AccountKey = 'admin' | 'super' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  password: string;
  userName: string;
}

type LoginParams = Pick<Account, 'password' | 'userName'>;

const INITIAL_VALUES = {
  password: '123456',
  userName: 'Soybean'
};

const PwdLogin = () => {
  const { loading, toLogin } = useInitAuth();

  const [form] = AForm.useForm<LoginParams>();

  const navigate = useNavigate();

  const {
    formRules: { pwd, userName: userNameRules }
  } = useFormRules();

  const accounts: Account[] = [
    {
      key: 'super',
      label: '超级管理员',
      password: '123456',
      userName: 'Super'
    },
    {
      key: 'admin',
      label: '管理员',
      password: '123456',
      userName: 'Admin'
    },
    {
      key: 'user',
      label: '普通用户',
      password: '123456',
      userName: 'User'
    }
  ];

  function handleAccountLogin(account: Account) {
    toLogin(account);
  }

  function goCodeLogin() {
    navigate('code-login');
  }

  function goRegister() {
    navigate('register');
  }

  function goResetPwd() {
    navigate('reset-pwd');
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <h3 className="text-18px text-primary font-medium">密码登录</h3>
      <AForm
        className="pt-24px"
        form={form}
        initialValues={INITIAL_VALUES}
        onFinish={toLogin}
      >
        <AForm.Item
          name="userName"
          rules={userNameRules}
        >
          <AInput />
        </AForm.Item>

        <AForm.Item
          name="password"
          rules={pwd}
        >
          <AInput.Password autoComplete="password" />
        </AForm.Item>
        <ASpace
          className="w-full"
          direction="vertical"
          size={24}
        >
          <div className="flex-y-center justify-between">
            <ACheckbox>记住我</ACheckbox>

            <AButton
              type="text"
              onClick={goResetPwd}
            >
              忘记密码？
            </AButton>
          </div>
          <AButton
            block
            color="primary"
            htmlType="submit"
            loading={loading}
            shape="round"
            size="large"
            type="primary"
          >
            确认
          </AButton>
          <div className="flex-y-center justify-between gap-12px">
            <AButton
              block
              className="flex-1"
              onClick={goCodeLogin}
            >
              验证码登录
            </AButton>
            <AButton
              block
              className="flex-1"
              onClick={goRegister}
            >
              注册账号
            </AButton>
          </div>
          <ADivider className="!m-0 !text-14px !text-#666">其他账号登录</ADivider>
          <div className="flex-center gap-12px">
            {accounts.map(item => {
              return (
                <AButton
                  key={item.key}
                  type="primary"
                  onClick={() => handleAccountLogin(item)}
                >
                  {item.label}
                </AButton>
              );
            })}
          </div>
        </ASpace>
      </AForm>
    </>
  );
};

export default PwdLogin;
