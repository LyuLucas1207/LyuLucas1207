import { createRouter, defineRouter } from 'nfx-ui/navigations'

const routeDefinition = defineRouter({
  HOME: '/',
  ABOUT: '/about',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:slug',
  LIFE: '/life',
  HIGHLIGHTS: '/highlights',
  CONTACT: '/contact',
})

const router = createRouter(routeDefinition)

export const ROUTES = router.ROUTES
export const routeUtils = router
