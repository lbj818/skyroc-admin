import { useEmit, useOn } from '@sa/hooks'

import { useRoute, useRouter } from '@/features/router'
import { useRouteStore } from '@/store/routeStore'
import { useTabStore } from '@/store/tabStore'
import { localStg } from '@/utils/storage'

import { getActiveFirstLevelMenuKey } from '../menu/menuHelpers'
import { useThemeSettings } from '../theme'

import { getFixedTabs, getTabByRoute, isTabInTabs } from './shared'
import { TabEvent } from './tabEnum'

export function useUpdateTabs() {
  const { setTabs } = useTabStore.getState()
  return (newTabs: App.Global.Tab[]) => setTabs(newTabs)
}

export function useTabActions() {
  const tabs = useTabStore(s => s.tabs)
  const activeTabId = useTabStore(s => s.activeTabId)
  const { setActiveFirstLevelMenuKey, setActiveTabId } = useTabStore.getState()
  const { setRemoveCacheKey } = useRouteStore.getState()
  const updateTabs = useUpdateTabs()
  const { navigate } = useRouter()

  const _fixedTabs = getFixedTabs(tabs)
  const _tabIds = tabs.map(tab => tab.id)

  function changeActiveTabId(tabId: string) { setActiveTabId(tabId) }

  async function switchRouteByTab(tab: App.Global.Tab) {
    navigate(tab.fullPath)
    changeActiveTabId(tab.id)
  }

  function _clearTabs(excludes: string[] = []) {
    const remainTabIds = [..._fixedTabs.map(tab => tab.id), ...excludes]
    const removeKeepKeys: string[] = []
    const updatedTabs: App.Global.Tab[] = []

    for (const tab of tabs) {
      if (remainTabIds.includes(tab.id)) { updatedTabs.push(tab) }
      else if (tab.keepAlive) removeKeepKeys.push(tab.routePath)
    }

    if (updatedTabs.length === tabs.length) return

    if (!remainTabIds.includes(activeTabId)) {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTabId)
      const newActive = tabs[currentIndex + 1] || tabs[currentIndex - 1] || updatedTabs.at(-1)
      if (newActive) switchRouteByTab(newActive)
    }

    updateTabs(updatedTabs)
    if (removeKeepKeys.length > 0) setRemoveCacheKey(removeKeepKeys)
  }

  function _clearLeftTabs(tabId: string) {
    const index = _tabIds.indexOf(tabId)
    if (index === -1) return
    _clearTabs(_tabIds.slice(index))
  }

  function _clearRightTabs(tabId: string) {
    const index = _tabIds.indexOf(tabId)
    if (index === 0) { _clearTabs(); return }
    if (index === -1) return
    _clearTabs(_tabIds.slice(0, index + 1))
  }

  function removeTabById(tabId: string) {
    _clearTabs(_tabIds.filter(t => t !== tabId))
  }

  function removeActiveTab() { removeTabById(activeTabId) }
  function isTabRetain(tabId: string) { return _fixedTabs.some(tab => tab.id === tabId) }

  useOn(TabEvent.UPDATE_TABS, (eventName: TabEvent, id: string) => {
    if (eventName === TabEvent.CLEAR_LEFT_TABS) return _clearLeftTabs(id)
    if (eventName === TabEvent.CLEAR_RIGHT_TABS) return _clearRightTabs(id)
    if (eventName === TabEvent.CLOSE_CURRENT) return removeTabById(id)
    if (eventName === TabEvent.CLOSE_OTHER) return _clearTabs([id])
    return _clearTabs()
  })

  return { activeTabId, isTabRetain, navigate, removeActiveTab, removeTabById, tabs }
}

export function useTabController() {
  const emit = useEmit()
  const _op = (eventName: TabEvent, id?: string) => emit(TabEvent.UPDATE_TABS, eventName, id)

  return {
    clearLeftTabs: (id: string) => _op(TabEvent.CLEAR_LEFT_TABS, id),
    clearRightTabs: (id: string) => _op(TabEvent.CLEAR_RIGHT_TABS, id),
    closeAllTabs: () => _op(TabEvent.CLOSE_ALL),
    closeCurrentTab: (id: string) => _op(TabEvent.CLOSE_CURRENT, id),
    closeOtherTabs: (id: string) => _op(TabEvent.CLOSE_OTHER, id)
  }
}

export function initTab(cache: boolean, updateTabs: (tabs: App.Global.Tab[]) => void) {
  const storageTabs = localStg.get('globalTabs')
  if (cache && storageTabs) { updateTabs(storageTabs); return storageTabs }
  return []
}

export function useCacheTabs() {
  const themeSettings = useThemeSettings()
  const tabs = useTabStore(s => s.tabs)

  return () => {
    if (themeSettings.tab.cache) localStg.set('globalTabs', tabs)
  }
}

export function useTabManager() {
  const isInit = useRef(false)
  const themeSettings = useThemeSettings()
  const cacheTabs = useCacheTabs()
  const tabs = useTabStore(s => s.tabs)
  const { addTab, setActiveFirstLevelMenuKey, setActiveTabId, updateTab } = useTabStore.getState()
  const updateTabs = useUpdateTabs()
  const _route = useRoute()

  function _addTab(route: Router.Route) {
    const tab = getTabByRoute(route)

    if (!isInit.current) {
      isInit.current = true
      const initTabs = initTab(themeSettings.tab.cache, updateTabs)
      const existsInInit = Array.isArray(initTabs) && initTabs.length > 0 && isTabInTabs(tab.id, initTabs)
      const existsInStore = isTabInTabs(tab.id, tabs)
      if (!existsInInit && !existsInStore) addTab(tab)
    } else if (!isTabInTabs(tab.id, tabs)) {
      addTab(tab)
    } else {
      const index = tabs.findIndex(item => item.id === tab.id)
      updateTab(index, tab)
    }

    setActiveTabId(tab.id)
    setActiveFirstLevelMenuKey(getActiveFirstLevelMenuKey(route))
  }

  useEffect(() => { _addTab(_route) }, [_route.fullPath])
  useEventListener('beforeunload', cacheTabs, { target: window })
}

export function useTabLabel() {
  const activeTabId = useTabStore(s => s.activeTabId)
  const tabs = useTabStore(s => s.tabs)
  const { changeTabLabel } = useTabStore.getState()

  function setTabLabel(label: string, tabId?: string) {
    const index = tabs.findIndex(item => item.id === (tabId || activeTabId))
    if (index >= 0) changeTabLabel(index, label)
  }

  function resetTabLabel(tabId?: string) {
    const index = tabs.findIndex(item => item.id === (tabId || activeTabId))
    if (index >= 0) changeTabLabel(index)
  }

  return { resetTabLabel, setTabLabel }
}
