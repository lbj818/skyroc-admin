import type { MenuInfo } from '@rc-component/menu/lib/interface';
import type { FC } from 'react';

import { useMixMenuContext } from '@/features/menu';
import { useRouter } from '@/features/router';
import { getThemeSettings } from '@/features/theme';

import { HorizontalMenuMode } from '../types';

interface Props {
  /** 水平菜单显示模式 */
  mode: HorizontalMenuMode;
}

function isHasChildren(menus: App.Global.Menu[], key: string) {
  return menus.some(item => item.key === key && item.children?.length);
}

const HorizontalMenu: FC<Props> = memo(({ mode }) => {
  const themeSettings = useAppSelector(getThemeSettings);

  const { activeFirstLevelMenuKey, allMenus, childLevelMenus, firstLevelMenu, selectKey, setActiveFirstLevelMenuKey } =
    useMixMenuContext();

  const { navigate } = useRouter();

  // FirstLevel 模式：选中态用 activeFirstLevelMenuKey（system key 如 "10"）
  // 其他模式：用当前路由路径
  const selectedKeys = mode === HorizontalMenuMode.FirstLevel ? [activeFirstLevelMenuKey] : selectKey;

  function getMenus() {
    if (mode === HorizontalMenuMode.All) return allMenus;
    if (mode === HorizontalMenuMode.Child) return childLevelMenus;
    return firstLevelMenu;
  }

  /** 递归找到菜单下第一个叶子节点的 key（用于点击一级菜单时自动导航） */
  function getFirstLeafKey(menu: App.Global.Menu): string {
    if (!menu.children || menu.children.length === 0) return menu.key;
    return getFirstLeafKey(menu.children[0]);
  }

  function handleClickMenu(menuInfo: MenuInfo) {
    if (mode === HorizontalMenuMode.FirstLevel) {
      const menu = allMenus.find(item => item.key === menuInfo.key);
      setActiveFirstLevelMenuKey(menuInfo.key);
      if (menu) {
        // 有子菜单时导航到第一个叶子路由，无子菜单直接导航
        navigate(getFirstLeafKey(menu));
      }
    } else {
      navigate(menuInfo.key);
    }
  }

  return (
    <AMenu
      className="size-full transition-400 border-0!"
      inlineIndent={18}
      mode="horizontal"
      selectedKeys={selectedKeys}
      style={{ lineHeight: `${themeSettings.header.height}px` }}
      items={getMenus().map(menu => ({
        ...menu,
        children: menu.children ? menu.children : []
      }))}
      onSelect={handleClickMenu}
    />
  );
});

export default HorizontalMenu;
