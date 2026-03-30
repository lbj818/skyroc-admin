export function getFixedTabIds(tabs: App.Global.Tab[]) {
  return getFixedTabs(tabs).map(tab => tab.id);
}

export function getFixedTabs(tabs: App.Global.Tab[]) {
  return tabs.filter(tab => tab.fixedIndex || tab.fixedIndex === 0);
}

export function getRouteIcons(route: Router.Route) {
  let icon: string = route?.handle?.icon || import.meta.env.VITE_MENU_ICON;
  let localIcon: string | undefined = route?.handle?.localIcon;

  if (route.matched) {
    const currentRoute = route.matched.find(r => r.id === route.id);
    icon = currentRoute?.handle?.icon || icon;
    localIcon = currentRoute?.handle?.localIcon;
  }

  return { icon, localIcon };
}

export function getTabByRoute(route: Router.Route) {
  const { fullPath, handle, id, pathname } = route;
  const { fixedIndexInTab, keepAlive = false, title } = handle;

  let fixedIndex = fixedIndexInTab;
  if (pathname === import.meta.env.VITE_ROUTE_HOME) {
    fixedIndex = 0;
  }

  const { icon, localIcon } = getRouteIcons(route);

  const tab: App.Global.Tab = {
    fixedIndex,
    fullPath,
    icon,
    id: handle.multiTab ? fullPath : pathname,
    keepAlive,
    label: title,
    localIcon,
    newLabel: '',
    oldLabel: title,
    routeKey: id as string,
    routePath: pathname
  };

  return tab;
}

export function isTabInTabs(tabId: string, tabs: App.Global.Tab[]) {
  return tabs.some(tab => tab.id === tabId);
}

export function extractTabsByAllRoutes(routeNames: string[], tabs: App.Global.Tab[]) {
  return tabs.filter(tab => routeNames.includes(tab.routeKey));
}
