import { PageTab } from '@sa/materials'
import clsx from 'clsx'

import BetterScroll from '@/components/BetterScroll'
import { useAppStore } from '@/store/appStore'
import { useRouteStore } from '@/store/routeStore'
import { isPC } from '@/utils/agent'

import { useTheme, useThemeSettings } from '../theme'

import ContextMenu from './TabContextMenu'
import TabReloadButton from './TabReloadButton'
import { useTabActions, useTabManager } from './tabHooks'
import { useTabScroll } from './useTabScroll'

const GlobalTab = () => {
  const isPCFlag = isPC()
  const { darkMode } = useTheme()
  const themeSettings = useThemeSettings()
  const { activeTabId, isTabRetain, navigate, removeTabById, tabs } = useTabActions()
  const { bsWrapper, setBsScroll, tabRef } = useTabScroll(activeTabId)
  const fullContent = useAppStore(s => s.fullContent)
  const { toggleFullContent } = useAppStore.getState()
  const { setRemoveCacheKey } = useRouteStore.getState()

  useTabManager()

  const tabWrapperClass = themeSettings.tab.mode === 'chrome' ? 'items-end' : 'items-center gap-12px'

  function getContextMenuDisabledKeys(tabId: string, index: number) {
    const disabledKeys: App.Global.DropdownKey[] = []
    if (isTabRetain(tabId)) disabledKeys.push('closeCurrent', 'closeLeft')
    if (index === 1) disabledKeys.push('closeLeft')
    if (index === tabs.length - 1) disabledKeys.push('closeRight')
    return disabledKeys
  }

  function handleCloseTab(tab: App.Global.Tab) {
    removeTabById(tab.id)
    setRemoveCacheKey(tab.routePath)
  }

  return (
    <DarkModeContainer className="size-full flex-y-center px-16px shadow-tab">
      <div className="h-full flex-1-hidden" ref={bsWrapper}>
        <BetterScroll options={{ click: !isPCFlag, scrollX: true, scrollY: false }} setBsScroll={setBsScroll} onClick={() => (document.activeElement as HTMLElement)?.blur()}>
          <div className={clsx('h-full flex pr-18px', tabWrapperClass)} ref={tabRef}>
            {tabs.map((item, index) => (
              <ContextMenu active={item.id === activeTabId} darkMode={darkMode} disabledKeys={getContextMenuDisabledKeys(item.id, index)} key={item.id} mode={themeSettings.tab.mode} tabId={item.id}>
                <div className={themeSettings.tab.mode === 'slider' ? 'h-full' : undefined} id={item.id}>
                  <PageTab
                    active={item.id === activeTabId}
                    activeColor={themeSettings.themeColor}
                    closable={!isTabRetain(item.id)}
                    darkMode={darkMode}
                    datatype={item.id}
                    handleClose={() => handleCloseTab(item)}
                    id={item.id}
                    mode={themeSettings.tab.mode}
                    prefix={<SvgIcon className="inline-block align-text-bottom text-16px" icon={item.icon} localIcon={item.localIcon} />}
                    onClick={() => navigate(item.fullPath)}
                  >
                    <div className="max-w-240px ellipsis-text">{item.label}</div>
                  </PageTab>
                </div>
              </ContextMenu>
            ))}
          </div>
        </BetterScroll>
      </div>
      <TabReloadButton />
      <FullScreen full={fullContent} toggleFullscreen={toggleFullContent} />
    </DarkModeContainer>
  )
}

export default GlobalTab
