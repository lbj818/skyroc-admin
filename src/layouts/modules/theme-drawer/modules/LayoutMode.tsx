import clsx from 'clsx'

import { useThemeStore } from '@/store/themeStore'

import LayoutModeCard from '../components/LayoutModeCard'
import SettingItem from '../components/SettingItem'

import style from './layoutMode.module.scss'

const LAYOUTS_COMPONENTS: Record<UnionKey.ThemeLayoutMode, React.ReactNode> = {
  horizontal: (<><div className={style['layout-header']} /><div className={style['horizontal-wrapper']}><div className={style['layout-main']} /></div></>),
  'horizontal-mix': (<><div className={style['layout-header']} /><div className={style['horizontal-wrapper']}><div className={clsx('w-18px', style['layout-sider'])} /><div className={style['layout-main']} /></div></>),
  vertical: (<><div className={clsx('h-full w-18px', style['layout-sider'])} /><div className={style['vertical-wrapper']}><div className={style['layout-header']} /><div className={style['layout-main']} /></div></>),
  'vertical-mix': (<><div className={clsx('h-full w-8px', style['layout-sider'])} /><div className={clsx('h-full w-16px', style['layout-sider'])} /><div className={style['vertical-wrapper']}><div className={style['layout-header']} /><div className={style['layout-main']} /></div></>)
}

const LayoutMode = memo(() => {
  const settings = useThemeStore(s => s.settings)
  const { changeReverseHorizontalMix } = useThemeStore.getState()

  return (
    <>
      <LayoutModeCard mode={settings.layout.mode} {...LAYOUTS_COMPONENTS} />
      <SettingItem className="mt-16px" label="一级菜单与子级菜单位置反转" show={settings.layout.mode === 'horizontal-mix'}>
        <ASwitch checked={settings.layout.reverseHorizontalMix} onChange={changeReverseHorizontalMix} />
      </SettingItem>
    </>
  )
})

export default LayoutMode
