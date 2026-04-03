import type { MenuInfo } from '@rc-component/menu/lib/interface'
import { SimpleScrollbar } from '@sa/materials'
import type { MenuProps } from 'antd'

import { useMixMenuContext } from '@/features/menu'
import { useRouter } from '@/features/router'
import { useThemeSettings } from '@/features/theme'
import { useAppStore } from '@/store/appStore'

interface LevelKeysProps {
  children?: LevelKeysProps[]
  key?: string
}

const getLevelKeys = (items: LevelKeysProps[]) => {
  const key: Record<string, number> = {}
  const walk = (list: LevelKeysProps[], level = 1) => {
    list.forEach(item => {
      if (item.key) key[item.key] = level
      if (item.children) walk(item.children, level + 1)
    })
  }
  walk(items)
  return key
}

const getSelectedMenuKeyPath = (matches: Router.Route['matched']) =>
  matches.reduce((acc: string[], match, index) => {
    if (index < matches.length - 1 && match.pathname) acc.push(match.pathname)
    return acc
  }, [])

function transformMenuToAntdMenuItem(menu: any): any {
  const { children, ...rest } = menu
  return {
    ...rest,
    children: Array.isArray(children) && children.length > 0 ? children.map(transformMenuToAntdMenuItem) : undefined
  }
}

const VerticalMenu = memo(() => {
  const { allMenus, childLevelMenus, route, selectKey } = useMixMenuContext()
  const levelKeys = useMemo(() => getLevelKeys(allMenus), [allMenus])
  const themeSettings = useThemeSettings()
  const { navigate } = useRouter()
  const inlineCollapsed = useAppStore(s => s.siderCollapse)

  const isMix = themeSettings.layout.mode.includes('mix')
  const isVerticalMix = themeSettings.layout.mode === 'vertical-mix'

  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>(
    inlineCollapsed ? [] : getSelectedMenuKeyPath(route.matched)
  )

  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    if (keys.includes('rc-menu-more')) { setStateOpenKeys(keys); return }
    const currentOpenKey = keys.find(key => !stateOpenKeys.includes(key))
    if (currentOpenKey && themeSettings.isOnlyExpandCurrentParentMenu) {
      const repeatIndex = keys.filter(k => k !== currentOpenKey).findIndex(k => levelKeys[k] === levelKeys[currentOpenKey])
      setStateOpenKeys(keys.filter((_, i) => i !== repeatIndex).filter(k => levelKeys[k] <= levelKeys[currentOpenKey]))
    } else {
      setStateOpenKeys(keys)
    }
  }

  useEffect(() => {
    if (inlineCollapsed || isVerticalMix) return
    setStateOpenKeys(getSelectedMenuKeyPath(route.matched))
  }, [route, inlineCollapsed, isVerticalMix])

  useUpdateEffect(() => {
    if (inlineCollapsed || isVerticalMix) return
    const names = route.matched.slice(isMix ? 1 : 0, -1).map(item => item.pathname).filter(Boolean) as string[]
    setStateOpenKeys(names || [])
  }, [isMix, inlineCollapsed])

  return (
    <SimpleScrollbar>
      <AMenu
        className="size-full transition-300 border-0!"
        inlineCollapsed={isVerticalMix ? false : inlineCollapsed}
        inlineIndent={18}
        items={(isMix ? childLevelMenus : allMenus).map(transformMenuToAntdMenuItem)}
        mode="inline"
        openKeys={stateOpenKeys}
        selectedKeys={selectKey}
        onOpenChange={onOpenChange}
        onSelect={(info: MenuInfo) => navigate(info.key)}
      />
    </SimpleScrollbar>
  )
})

export default VerticalMenu
