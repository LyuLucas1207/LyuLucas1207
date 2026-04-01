import { Route, Routes } from 'react-router-dom'

import { useScrollToTop } from '@/hooks/useScrollToTop'
import { SiteLayout } from '@/layouts/siteLayout/SiteLayout'
import { AboutPage } from '@/pages/about'
import { ContactPage } from '@/pages/contact'
import { HighlightsPage } from '@/pages/highlights'
import { HomePage } from '@/pages/home'
import { LifePage } from '@/pages/life'
import { ProjectDetailPage } from '@/pages/projectDetail'
import { ProjectsPage } from '@/pages/projects'
import { ROUTES } from '@/navigations/routes'

function ScrollManager() {
  useScrollToTop()
  return null
}

function AppRouter() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route element={<SiteLayout />}>
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
          <Route path={ROUTES.PROJECT_DETAIL} element={<ProjectDetailPage />} />
          <Route path={ROUTES.LIFE} element={<LifePage />} />
          <Route path={ROUTES.HIGHLIGHTS} element={<HighlightsPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        </Route>
      </Routes>
    </>
  )
}

export { AppRouter }
