import { create } from 'zustand'

export interface MenuItem {
  children?: MenuItem[]
  component?: string
  icon: string
  id: string | number
  iframeFlag?: string
  iframeUrl?: string
  keepAlive: boolean
  name: string
  parentId?: string | number
  path: string
  routingParameters?: string
  title: string
}

interface MenuTreeState {
  loaded: boolean
  menuTree: MenuItem[]
  resetMenuTree: () => void
  setMenuTree: (tree: MenuItem[]) => void
}

export const useMenuTreeStore = create<MenuTreeState>((set) => ({
  loaded: false,
  menuTree: [],
  resetMenuTree: () => set({ loaded: false, menuTree: [] }),
  setMenuTree: (tree) => set({ loaded: true, menuTree: tree })
}))
