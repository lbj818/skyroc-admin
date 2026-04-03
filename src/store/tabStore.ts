import { create } from 'zustand'

interface TabState {
  activeFirstLevelMenuKey: string
  activeTabId: string
  addTab: (tab: App.Global.Tab) => void
  changeTabLabel: (index: number, label?: string) => void
  clearTabs: () => void
  setActiveFirstLevelMenuKey: (key: string) => void
  setActiveTabId: (id: string) => void
  setTabs: (tabs: App.Global.Tab[]) => void
  tabs: App.Global.Tab[]
  updateTab: (index: number, tab: App.Global.Tab) => void
}

export const useTabStore = create<TabState>((set) => ({
  activeFirstLevelMenuKey: '',
  activeTabId: '',
  tabs: [],
  addTab: (tab) =>
    set((state) => {
      const { fixedIndex } = tab
      const newTabs = [...state.tabs]
      if (fixedIndex || fixedIndex === 0) {
        newTabs.splice(fixedIndex, 0, tab)
      } else {
        newTabs.push(tab)
      }
      return { tabs: newTabs }
    }),
  changeTabLabel: (index, label) =>
    set((state) => {
      const newTabs = [...state.tabs]
      newTabs[index] = {
        ...newTabs[index],
        label: label ?? newTabs[index].oldLabel ?? ''
      }
      return { tabs: newTabs }
    }),
  clearTabs: () => set({ activeFirstLevelMenuKey: '', activeTabId: '', tabs: [] }),
  setActiveFirstLevelMenuKey: (key) => set({ activeFirstLevelMenuKey: key }),
  setActiveTabId: (id) => set({ activeTabId: id }),
  setTabs: (tabs) => set({ tabs }),
  updateTab: (index, tab) =>
    set((state) => {
      const newTabs = [...state.tabs]
      newTabs[index] = tab
      return { tabs: newTabs }
    })
}))
