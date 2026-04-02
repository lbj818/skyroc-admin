import type { MenuProps } from 'antd'

import { selectIsLogin } from '@/features/auth/tokenStore'
import { useRouter } from '@/features/router'
import { doLogout } from '@/modules/common-app/pages/login/useLogin'

const UserAvatar = memo(() => {
  const isLogin = useAppSelector(selectIsLogin)

  // 从 sessionStorage 读取用户信息（Vue3 项目登录后存储）
  const userInfoRaw = window.sessionStorage.getItem('userInfo')
  const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null

  const { navigate } = useRouter()

  function logout() {
    window?.$modal?.confirm({
      cancelText: '取消',
      content: '确认退出登录吗？',
      okText: '确认',
      onOk: () => doLogout(),
      title: '提示'
    })
  }

  function onClick({ key }: { key: string }) {
    if (key === '1') {
      logout()
    } else {
      navigate('/user-center')
    }
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
    { type: 'divider' },
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
  ]

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
    <AButton onClick={() => navigate('/login')}>登录</AButton>
  )
})

export default UserAvatar
