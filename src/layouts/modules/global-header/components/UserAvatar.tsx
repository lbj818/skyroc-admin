import type { MenuProps } from 'antd'
import { doLogout } from 'common-app/pages/login/useLogin'

import { useRouter } from '@/features/router'
import { sessionStg } from '@/utils/storage'

const UserAvatar = memo(() => {
  const userInfo = (() => {
    try { return sessionStg.get('userInfo') } catch { return null }
  })()
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

  const items: MenuProps['items'] = [
    {
      key: '0',
      label: <div className="flex-center gap-8px"><SvgIcon className="text-icon" icon="ph:user-circle" />个人中心</div>
    },
    { type: 'divider' },
    {
      key: '1',
      label: <div className="flex-center gap-8px"><SvgIcon className="text-icon" icon="ph:sign-out" />退出登录</div>
    }
  ]

  return (
    <ADropdown menu={{ items, onClick: ({ key }) => key === '1' ? logout() : navigate('/user-center') }} placement="bottomRight" trigger={['click']}>
      <div>
        <ButtonIcon className="px-12px">
          <SvgIcon className="text-icon-large" icon="ph:user-circle" />
          <span className="text-16px font-medium">{userInfo?.realName || userInfo?.username}</span>
        </ButtonIcon>
      </div>
    </ADropdown>
  )
})

export default UserAvatar
