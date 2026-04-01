import type { MenuProps } from 'antd';

import { selectIsLogin } from '@/features/auth/tokenStore';
import { useRoute, useRouter } from '@/features/router';
import { localStg } from '@/utils/storage';

const UserAvatar = memo(() => {
  const isLogin = useAppSelector(selectIsLogin);

  const userInfo = localStg.get('userInfo') as any;

  const { navigate, push } = useRouter();

  const { fullPath } = useRoute();

  function logout() {
    window?.$modal?.confirm({
      cancelText: '取消',
      content: '确认退出登录吗？',
      okText: '确认',
      onOk: () => {
        push('/login-out', { query: { redirect: fullPath } });
      },
      title: '提示'
    });
  }

  function onClick({ key }: { key: string }) {
    if (key === '1') {
      logout();
    } else {
      navigate('/user-center');
    }
  }

  function loginOrRegister() {
    navigate('/login');
  }

  const items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <div className="flex-center gap-8px">
          <SvgIcon
            className="text-icon"
            icon="ph:user-circle"
          />
          个人中心
        </div>
      )
    },
    {
      type: 'divider'
    },
    {
      key: '1',
      label: (
        <div className="flex-center gap-8px">
          <SvgIcon
            className="text-icon"
            icon="ph:sign-out"
          />
          退出登录
        </div>
      )
    }
  ];

  return isLogin ? (
    <ADropdown
      menu={{ items, onClick }}
      placement="bottomRight"
      trigger={['click']}
    >
      <div>
        <ButtonIcon className="px-12px">
          <SvgIcon
            className="text-icon-large"
            icon="ph:user-circle"
          />
          <span className="text-16px font-medium">{userInfo?.nickname || userInfo?.username}</span>
        </ButtonIcon>
      </div>
    </ADropdown>
  ) : (
    <AButton onClick={loginOrRegister}>登录 / 注册</AButton>
  );
});

export default UserAvatar;
