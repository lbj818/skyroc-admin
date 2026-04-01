import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface MenuItem {
  children?: MenuItem[];
  component?: string;
  icon: string;
  id: string | number;
  iframeFlag?: string;
  iframeUrl?: string;
  keepAlive: boolean;
  name: string;
  parentId?: string | number;
  path: string;
  routingParameters?: string;
  title: string;
}

interface MenuTreeState {
  loaded: boolean;
  menuTree: MenuItem[];
}

const initialState: MenuTreeState = {
  loaded: false,
  menuTree: []
};

export const menuTreeSlice = createSlice({
  initialState,
  name: 'menuTree',
  reducers: {
    resetMenuTree: () => initialState,
    setMenuTree: (state, { payload }: PayloadAction<MenuItem[]>) => {
      state.menuTree = payload;
      state.loaded = true;
    }
  },
  selectors: {
    selectMenuLoaded: s => s.loaded,
    selectMenuTree: s => s.menuTree
  }
});

export const { resetMenuTree, setMenuTree } = menuTreeSlice.actions;
export const { selectMenuLoaded, selectMenuTree } = menuTreeSlice.selectors;
