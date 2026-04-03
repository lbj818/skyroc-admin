import { InputNumber, Select, Switch } from 'antd'

import { useThemeStore } from '@/store/themeStore'

import SettingItem from '../components/SettingItem'

const PageFun = memo(() => {
  const s = useThemeStore(s => s.settings)
  const { setFixedHeaderAndTab, setFooter, setHeader, setLayoutScrollMode, setPage, setSider, setTab, setWatermark } = useThemeStore.getState()

  const isWrapperScrollMode = s.layout.scrollMode === 'wrapper'
  const isPageAnimate = s.page.animate
  const layoutMode = s.layout.mode
  const isMixLayoutMode = layoutMode.includes('mix')
  const isVertical = layoutMode === 'vertical'

  const scrollModeOptions = [{ label: '外层滚动', value: 'wrapper' }, { label: '主体滚动', value: 'content' }]
  const pageAnimationModeOptions = [
    { label: '弹动', value: 'fade' }, { label: '底部消退', value: 'fade-bottom' },
    { label: '缩放消退', value: 'fade-scale' }, { label: '滑动', value: 'fade-slide' },
    { label: '无', value: 'none' }, { label: '渐变', value: 'zoom-fade' }, { label: '闪现', value: 'zoom-out' }
  ]
  const tabModeOptions = [{ label: '按钮风格', value: 'button' }, { label: '谷歌风格', value: 'chrome' }, { label: '滑块风格', value: 'slider' }]

  return (
    <div className="relative flex-col-stretch gap-12px">
      <SettingItem label="滚动模式"><Select className="w-120px" options={scrollModeOptions} value={s.layout.scrollMode} onChange={setLayoutScrollMode} /></SettingItem>
      <SettingItem label="页面切换动画"><Switch checked={isPageAnimate} onChange={v => setPage({ animate: v })} /></SettingItem>
      <SettingItem label="页面切换动画类型" show={isPageAnimate}><Select className="w-120px" options={pageAnimationModeOptions} value={s.page.animateMode} onChange={v => setPage({ animateMode: v })} /></SettingItem>
      <SettingItem label="固定头部和标签栏" show={isWrapperScrollMode}><Switch checked={s.fixedHeaderAndTab} onChange={setFixedHeaderAndTab} /></SettingItem>
      <SettingItem label="头部高度"><InputNumber className="w-120px" value={s.header.height} onChange={v => setHeader({ height: v ?? 0 })} /></SettingItem>
      <SettingItem label="显示面包屑"><Switch value={s.header.breadcrumb.visible} onChange={v => setHeader({ breadcrumb: { visible: v } })} /></SettingItem>
      <SettingItem label="显示面包屑图标" show={s.header.breadcrumb.visible}><Switch value={s.header.breadcrumb.visible} onChange={v => setHeader({ breadcrumb: { showIcon: v } })} /></SettingItem>
      <SettingItem label="显示标签栏"><Switch value={s.tab.visible} onChange={v => setTab({ visible: v })} /></SettingItem>
      <SettingItem label="标签栏高度" show={s.tab.visible}><InputNumber className="w-120px" value={s.tab.height} onChange={v => setTab({ height: v ?? 0 })} /></SettingItem>
      <SettingItem label="标签栏风格" show={s.tab.visible}><Select className="w-120px" options={tabModeOptions} value={s.tab.mode} onChange={v => setTab({ mode: v })} /></SettingItem>
      <SettingItem label="侧边栏宽度" show={isVertical}><InputNumber className="w-120px" value={s.sider.width} onChange={v => setSider({ width: v ?? 0 })} /></SettingItem>
      <SettingItem label="侧边栏折叠宽度" show={isVertical}><InputNumber className="w-120px" value={s.sider.collapsedWidth} onChange={v => setSider({ collapsedWidth: v ?? 0 })} /></SettingItem>
      <SettingItem label="混合布局侧边栏宽度" show={isMixLayoutMode}><InputNumber className="w-120px" value={s.sider.mixWidth} onChange={v => setSider({ mixWidth: v ?? 0 })} /></SettingItem>
      <SettingItem label="混合布局侧边栏折叠宽度" show={isMixLayoutMode}><InputNumber className="w-120px" value={s.sider.mixCollapsedWidth} onChange={v => setSider({ mixCollapsedWidth: v ?? 0 })} /></SettingItem>
      <SettingItem label="混合布局子菜单宽度" show={layoutMode === 'vertical-mix'}><InputNumber className="w-120px" value={s.sider.mixChildMenuWidth} onChange={v => setSider({ mixChildMenuWidth: v ?? 0 })} /></SettingItem>
      <SettingItem label="显示底部"><Switch value={s.footer.visible} onChange={v => setFooter({ visible: v })} /></SettingItem>
      <SettingItem label="固定底部" show={Boolean(s.footer.visible && isWrapperScrollMode)}><Switch value={s.footer.fixed} onChange={v => setFooter({ fixed: v })} /></SettingItem>
      <SettingItem label="底部高度" show={s.footer.visible}><InputNumber className="w-120px" value={s.footer.height} onChange={v => setFooter({ height: v ?? 0 })} /></SettingItem>
      <SettingItem label="底部局右" show={Boolean(s.footer.visible && layoutMode === 'horizontal-mix')}><Switch value={s.footer.right} onChange={v => setFooter({ right: v })} /></SettingItem>
      <SettingItem label="显示全屏水印"><Switch value={s.watermark?.visible} onChange={v => setWatermark({ visible: v })} /></SettingItem>
      <SettingItem label="水印文本" show={Boolean(s.watermark.visible)}><AInput allowClear className="w-120px" value={s.watermark.text} onChange={e => setWatermark({ text: e.target.value || '' })} /></SettingItem>
    </div>
  )
})

export default PageFun
