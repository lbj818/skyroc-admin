import { SimpleScrollbar } from '@sa/materials'

import { useAppStore } from '@/store/appStore'
import { useThemeStore } from '@/store/themeStore'

import ConfigOperation from './modules/ConfigOperation'
import DarkMode from './modules/DarkMode'
import LayoutMode from './modules/LayoutMode'
import PageFun from './modules/PageFun'
import ThemeColor from './modules/ThemeColor'

const ThemeDrawer = memo(() => {
  const themeDrawerVisible = useAppStore(s => s.themeDrawerVisible)
  const { closeThemeDrawer } = useAppStore.getState()
  const { cacheThemeSettings } = useThemeStore.getState()

  useMount(() => {
    window.addEventListener('beforeunload', cacheThemeSettings)
    return () => window.removeEventListener('beforeunload', cacheThemeSettings)
  })

  return (
    <ADrawer
      closeIcon={false}
      footer={<ConfigOperation />}
      open={themeDrawerVisible}
      styles={{ body: { padding: 0 } }}
      title="主题配置"
      extra={<ButtonIcon className="h-28px" icon="ant-design:close-outlined" onClick={closeThemeDrawer} />}
      onClose={closeThemeDrawer}
    >
      <SimpleScrollbar>
        <div className="overflow-x-hidden px-24px pb-24px pt-8px">
          <ADivider>主题模式</ADivider>
          <DarkMode />
          <ADivider>布局模式</ADivider>
          <LayoutMode />
          <ADivider>主题颜色</ADivider>
          <ThemeColor />
          <ADivider>页面功能</ADivider>
          <PageFun />
        </div>
      </SimpleScrollbar>
    </ADrawer>
  )
})

export default ThemeDrawer
