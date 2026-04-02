import { InputNumber, Select, Switch } from 'antd'

import {
  getThemeSettings,
  setFixedHeaderAndTab,
  setFooter,
  setHeader,
  setLayoutScrollMode,
  setPage,
  setSider,
  setTab,
  setWatermark
} from '@/features/theme'

import SettingItem from '../components/SettingItem'

const PageFun = memo(() => {
  const themeSetting = useAppSelector(getThemeSettings)

  const dispatch = useAppDispatch()

  const isWrapperScrollMode = themeSetting.layout.scrollMode === 'wrapper'
  const isPageAnimate = themeSetting.page.animate
  const layoutMode = themeSetting.layout.mode
  const isMixLayoutMode = layoutMode.includes('mix')
  const isVertical = layoutMode === 'vertical'

  const scrollModeOptions = [
    { label: '外层滚动', value: 'wrapper' },
    { label: '主体滚动', value: 'content' }
  ]
  const pageAnimationModeOptions = [
    { label: '弹动', value: 'fade' },
    { label: '底部消退', value: 'fade-bottom' },
    { label: '缩放消退', value: 'fade-scale' },
    { label: '滑动', value: 'fade-slide' },
    { label: '无', value: 'none' },
    { label: '渐变', value: 'zoom-fade' },
    { label: '闪现', value: 'zoom-out' }
  ]
  const tabModeOptions = [
    { label: '按钮风格', value: 'button' },
    { label: '谷歌风格', value: 'chrome' },
    { label: '滑块风格', value: 'slider' }
  ]

  return (
    <div className="relative flex-col-stretch gap-12px">
      <SettingItem label="滚动模式">
        <Select
          className="w-120px"
          options={scrollModeOptions}
          value={themeSetting.layout.scrollMode}
          onChange={value => dispatch(setLayoutScrollMode(value))}
        />
      </SettingItem>
      <SettingItem label="页面切换动画">
        <Switch
          checked={isPageAnimate}
          onChange={value => dispatch(setPage({ animate: value }))}
        />
      </SettingItem>
      <SettingItem
        label="页面切换动画类型"
        show={isPageAnimate}
      >
        <Select
          className="w-120px"
          options={pageAnimationModeOptions}
          value={themeSetting.page.animateMode}
          onChange={value => dispatch(setPage({ animateMode: value }))}
        />
      </SettingItem>
      <SettingItem
        label="固定头部和标签栏"
        show={isWrapperScrollMode}
      >
        <Switch
          checked={themeSetting.fixedHeaderAndTab}
          onChange={value => dispatch(setFixedHeaderAndTab(value))}
        />
      </SettingItem>
      <SettingItem label="头部高度">
        <InputNumber
          className="w-120px"
          value={themeSetting.header.height}
          onChange={value => dispatch(setHeader({ height: value ?? 0 }))}
        />
      </SettingItem>
      <SettingItem label="显示面包屑">
        <Switch
          value={themeSetting.header.breadcrumb.visible}
          onChange={value => dispatch(setHeader({ breadcrumb: { visible: value } }))}
        />
      </SettingItem>
      <SettingItem
        label="显示面包屑图标"
        show={themeSetting.header.breadcrumb.visible}
      >
        <Switch
          value={themeSetting.header.breadcrumb.visible}
          onChange={value => dispatch(setHeader({ breadcrumb: { showIcon: value } }))}
        />
      </SettingItem>
      <SettingItem label="显示标签栏">
        <Switch
          value={themeSetting.tab.visible}
          onChange={value => dispatch(setTab({ visible: value }))}
        />
      </SettingItem>
      <SettingItem
        label="标签栏高度"
        show={themeSetting.tab.visible}
      >
        <InputNumber
          className="w-120px"
          value={themeSetting.tab.height}
          onChange={value => dispatch(setTab({ height: value ?? 0 }))}
        />
      </SettingItem>
      <SettingItem
        label="标签栏风格"
        show={themeSetting.tab.visible}
      >
        <Select
          className="w-120px"
          options={tabModeOptions}
          value={themeSetting.tab.mode}
          onChange={value => dispatch(setTab({ mode: value }))}
        />
      </SettingItem>
      <SettingItem
        label="侧边栏宽度"
        show={isVertical}
      >
        <InputNumber
          className="w-120px"
          value={themeSetting.sider.width}
          onChange={value => dispatch(setSider({ width: value ?? 0 }))}
        />
      </SettingItem>
      <SettingItem
        label="侧边栏折叠宽度"
        show={isVertical}
      >
        <InputNumber
          className="w-120px"
          value={themeSetting.sider.collapsedWidth}
          onChange={value => dispatch(setSider({ collapsedWidth: value ?? 0 }))}
        />
      </SettingItem>
      <SettingItem
        label="混合布局侧边栏宽度"
        show={isMixLayoutMode}
      >
        <InputNumber
          className="w-120px"
          value={themeSetting.sider.mixWidth}
          onChange={value => dispatch(setSider({ mixWidth: value ?? 0 }))}
        />
      </SettingItem>
      <SettingItem
        label="混合布局侧边栏折叠宽度"
        show={isMixLayoutMode}
      >
        <InputNumber
          className="w-120px"
          value={themeSetting.sider.mixCollapsedWidth}
          onChange={value => dispatch(setSider({ mixCollapsedWidth: value ?? 0 }))}
        />
      </SettingItem>
      <SettingItem
        label="混合布局子菜单宽度"
        show={layoutMode === 'vertical-mix'}
      >
        <InputNumber
          className="w-120px"
          value={themeSetting.sider.mixChildMenuWidth}
          onChange={value => dispatch(setSider({ mixChildMenuWidth: value ?? 0 }))}
        />
      </SettingItem>
      <SettingItem label="显示底部">
        <Switch
          value={themeSetting.footer.visible}
          onChange={value => dispatch(setFooter({ visible: value }))}
        />
      </SettingItem>
      <SettingItem
        label="固定底部"
        show={Boolean(themeSetting.footer.visible && isWrapperScrollMode)}
      >
        <Switch
          value={themeSetting.footer.fixed}
          onChange={value => dispatch(setFooter({ fixed: value }))}
        />
      </SettingItem>
      <SettingItem
        label="底部高度"
        show={themeSetting.footer.visible}
      >
        <InputNumber
          className="w-120px"
          value={themeSetting.footer.height}
          onChange={value => dispatch(setFooter({ height: value ?? 0 }))}
        />
      </SettingItem>
      <SettingItem
        label="底部局右"
        show={Boolean(themeSetting.footer.visible && layoutMode === 'horizontal-mix')}
      >
        <Switch
          value={themeSetting.footer.right}
          onChange={value => dispatch(setFooter({ right: value }))}
        />
      </SettingItem>
      <SettingItem label="显示全屏水印">
        <Switch
          value={themeSetting.watermark?.visible}
          onChange={value => dispatch(setWatermark({ visible: value }))}
        />
      </SettingItem>
      <SettingItem
        label="水印文本"
        show={Boolean(themeSetting.watermark.visible)}
      >
        <AInput
          allowClear
          className="w-120px"
          value={themeSetting.watermark.text}
          onChange={value => dispatch(setWatermark({ text: value.target.value || '' }))}
        />
      </SettingItem>
    </div>
  )
})

export default PageFun
