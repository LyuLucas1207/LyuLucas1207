import type { RouteKey as RouteKeyGeneric, RoutePath as RoutePathGeneric } from "nfx-ui/navigations";

import { createRouter, defineRouter } from "nfx-ui/navigations";

const routeMap = defineRouter({
  HOME: '/',
  INTRO: '/intro',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:slug',
  LIFE: '/life',
  HIGHLIGHTS: '/highlights',
  CONTACT: '/contact',
})

const { ROUTES, matchRoute, isActiveRoute, getRouteByKey } = createRouter(routeMap);
type RouteKey = RouteKeyGeneric<typeof routeMap>;
type RoutePath = RoutePathGeneric<typeof routeMap>;

export { ROUTES, matchRoute, isActiveRoute, getRouteByKey, type RouteKey, type RoutePath };
