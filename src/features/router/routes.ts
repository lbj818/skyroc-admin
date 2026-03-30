import type { RouteObject } from 'react-router-dom';

type FlatRoute = {
  name?: string;
  path: string;
};

interface SimpleRoute {
  children?: SimpleRoute[];
  key: string;
  title?: string;
}

export function flattenLeafRoutes(routes: RouteObject[]) {
  const flat: { name?: string; path: string }[] = [];

  for (const route of routes) {
    if (route.children && route.children.length > 0) {
      flat.push(...flattenLeafRoutes(route.children));
    } else if (route.path) {
      const isHasIndex = Boolean(route.children?.[0]?.index);
      if (isHasIndex || !route.children || route.children?.length < 1) {
        flat.push({ name: route.id, path: route.path });
      }
    }
  }

  return flat;
}

function isRouteGroup(routeId?: string): boolean {
  if (!routeId) return false;
  return routeId.endsWith(')');
}

export function filterAndFlattenRoutes(routes: RouteObject[]): SimpleRoute[] {
  const result: SimpleRoute[] = [];

  for (const route of routes) {
    if (
      route.handle?.constant ||
      route?.index ||
      (route.children && route.children[0] && route.children[0].index && route.children[0].handle?.constant)
    ) {
      continue;
    }

    if (isRouteGroup(route.id)) {
      if (route.children && route.children.length > 0) {
        result.push(...filterAndFlattenRoutes(route.children));
      }
    } else {
      const newRoute: SimpleRoute = {
        key: route.path || '',
        title: route.handle?.title || route.id
      };

      if (route.children && route.children.length > 0) {
        newRoute.children = filterAndFlattenRoutes(route.children);
      }

      result.push(newRoute);
    }
  }

  return result;
}

export function getFlatBaseRoutes(routes: FlatRoute[]) {
  return routes.map(({ name, path }) => ({
    label: name || path,
    value: path
  }));
}

export function getBaseChildrenRoutes(routes: RouteObject[]) {
  const baseRoutes = routes[0].children?.find(item => item.id === '(base)')?.children;
  return baseRoutes || [];
}
