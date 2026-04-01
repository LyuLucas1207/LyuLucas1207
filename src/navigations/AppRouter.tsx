import { Route, Routes } from 'react-router-dom'

import { useScrollToTop } from '../hooks/useScrollToTop'
import { SiteLayout } from '../layouts/siteLayout/SiteLayout'
import { AboutPage } from '../pages/about/AboutPage'
import { ContactPage } from '../pages/contact/ContactPage'
import { HighlightsPage } from '../pages/highlights/HighlightsPage'
import { HomePage } from '../pages/home/HomePage'
import { LifePage } from '../pages/life/LifePage'
import { ProjectDetailPage } from '../pages/projectDetail/ProjectDetailPage'
import { ProjectsPage } from '../pages/projects/ProjectsPage'
import { ROUTES } from './routes'

function ScrollManager() {
  useScrollToTop()
  return null
}

function AppRouter() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
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
