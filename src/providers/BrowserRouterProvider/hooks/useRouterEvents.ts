import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { routerEventEmitter, routerEvents } from '@/events/router'
import { ROUTES } from '@/navigations/routes'

export function useRouterEvents() {
  const navigate = useNavigate()

  const handleNavigate = useCallback(
    (payload: { to: string; replace?: boolean; state?: unknown }) => {
      if (payload.replace) {
        navigate(payload.to, { replace: true, state: payload.state })
      } else {
        navigate(payload.to, { state: payload.state })
      }
    },
    [navigate],
  )

  const handleNavigateReplace = useCallback(
    (payload: { to: string; state?: unknown }) => {
      navigate(payload.to, { replace: true, state: payload.state })
    },
    [navigate],
  )

  const handleNavigateBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleNavigateToHome = useCallback(() => {
    navigate(ROUTES.HOME)
  }, [navigate])

  const handleNavigateToIntro = useCallback(() => {
    navigate(ROUTES.INTRO)
  }, [navigate])

  const handleNavigateToProjects = useCallback(() => {
    navigate(ROUTES.PROJECTS)
  }, [navigate])

  const handleNavigateToLife = useCallback(() => {
    navigate(ROUTES.LIFE)
  }, [navigate])

  const handleNavigateToHighlights = useCallback(() => {
    navigate(ROUTES.HIGHLIGHTS)
  }, [navigate])

  const handleNavigateToContact = useCallback(() => {
    navigate(ROUTES.CONTACT)
  }, [navigate])

  useEffect(() => {
    routerEventEmitter.on(routerEvents.NAVIGATE, handleNavigate)
    routerEventEmitter.on(routerEvents.NAVIGATE_REPLACE, handleNavigateReplace)
    routerEventEmitter.on(routerEvents.NAVIGATE_BACK, handleNavigateBack)
    routerEventEmitter.on(routerEvents.NAVIGATE_TO_HOME, handleNavigateToHome)
    routerEventEmitter.on(routerEvents.NAVIGATE_TO_INTRO, handleNavigateToIntro)
    routerEventEmitter.on(routerEvents.NAVIGATE_TO_PROJECTS, handleNavigateToProjects)
    routerEventEmitter.on(routerEvents.NAVIGATE_TO_LIFE, handleNavigateToLife)
    routerEventEmitter.on(routerEvents.NAVIGATE_TO_HIGHLIGHTS, handleNavigateToHighlights)
    routerEventEmitter.on(routerEvents.NAVIGATE_TO_CONTACT, handleNavigateToContact)

    return () => {
      routerEventEmitter.off(routerEvents.NAVIGATE, handleNavigate)
      routerEventEmitter.off(routerEvents.NAVIGATE_REPLACE, handleNavigateReplace)
      routerEventEmitter.off(routerEvents.NAVIGATE_BACK, handleNavigateBack)
      routerEventEmitter.off(routerEvents.NAVIGATE_TO_HOME, handleNavigateToHome)
      routerEventEmitter.off(routerEvents.NAVIGATE_TO_INTRO, handleNavigateToIntro)
      routerEventEmitter.off(routerEvents.NAVIGATE_TO_PROJECTS, handleNavigateToProjects)
      routerEventEmitter.off(routerEvents.NAVIGATE_TO_LIFE, handleNavigateToLife)
      routerEventEmitter.off(routerEvents.NAVIGATE_TO_HIGHLIGHTS, handleNavigateToHighlights)
      routerEventEmitter.off(routerEvents.NAVIGATE_TO_CONTACT, handleNavigateToContact)
    }
  }, [
    handleNavigate,
    handleNavigateReplace,
    handleNavigateBack,
    handleNavigateToHome,
    handleNavigateToIntro,
    handleNavigateToProjects,
    handleNavigateToLife,
    handleNavigateToHighlights,
    handleNavigateToContact,
  ])
}
