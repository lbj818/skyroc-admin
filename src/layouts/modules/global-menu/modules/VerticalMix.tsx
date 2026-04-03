import classNames from 'clsx'
import { createPortal } from 'react-dom'

import DarkModeContainer from '@/components/DarkModeContainer'
import PinToggler from '@/components/PinToggler'
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app'
import { useMixMenuContext } from '@/features/menu'
import { ThemeContext, useThemeSettings } from '@/features/theme'
import { useAppStore } from '@/store/appStore'

import GlobalLogo from '../../GlobalLogo'
import FirstLevelMenu from '../components/FirstLevelMenu'
import VerticalMenu from '../components/VerticalMenu'

import { useGetElementById } from './hook'

const VerticalMix = memo(() => {
  const { childLevelMenus, setActiveFirstLevelMenuKey } = useMixMenuContext()
  const { darkMode } = useContext(ThemeContext)
  const themeSettings = useThemeSettings()
  const mixSiderFixed = useAppStore(s => s.mixSiderFixed)
  const { toggleMixSiderFixed } = useAppStore.getState()
  const [drawerVisible, setDrawerVisible] = useState(false)

  const siderInverted = !darkMode && themeSettings.sider.inverted
  const hasMenus = childLevelMenus && childLevelMenus.length > 0
  const showDrawer = hasMenus && (drawerVisible || mixSiderFixed)

  return (
    <div className="h-full flex" onMouseLeave={() => { setDrawerVisible(false); setActiveFirstLevelMenuKey() }}>
      <FirstLevelMenu inverted={siderInverted} onSelect={() => setDrawerVisible(true)}>
        <GlobalLogo showTitle={false} style={{ height: `${themeSettings.header.height}px` }} />
      </FirstLevelMenu>
      <div
        className="relative h-full transition-width-300"
        style={{ width: mixSiderFixed && hasMenus ? `${themeSettings.sider.mixChildMenuWidth}px` : '0px' }}
      >
        <DarkModeContainer
          className="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          inverted={siderInverted}
          style={{ width: showDrawer ? `${themeSettings.sider.mixChildMenuWidth}px` : '0px' }}
        >
          <header className="flex-y-center justify-between px-12px" style={{ height: `${themeSettings.header.height}px` }}>
            <h2 className="text-16px text-primary font-bold">数智化合规系统</h2>
            <PinToggler
              className={classNames({ 'text-white:88 !hover:text-white': siderInverted })}
              pin={mixSiderFixed}
              onClick={toggleMixSiderFixed}
            />
          </header>
          <VerticalMenu />
        </DarkModeContainer>
      </div>
    </div>
  )
})

const VerticalMixMenu = () => {
  const container = useGetElementById(GLOBAL_SIDER_MENU_ID)
  if (!container) return null
  return createPortal(<VerticalMix />, container)
}

export default VerticalMixMenu
