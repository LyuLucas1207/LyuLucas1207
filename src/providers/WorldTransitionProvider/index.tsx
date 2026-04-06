import type { PropsWithChildren } from 'react'

import { useTransitionStore } from '@/stores/transitionStore'
import {
  EndingTransition,
  EnteringTransition,
  LanguageTransitionOverlay,
  PageTransitionOverlay,
  ThemeTransitionOverlay,
} from './components'

function WorldTransitionProvider({ children }: PropsWithChildren) {
  const request = useTransitionStore((s) => s.request)
  const handleMidpoint = useTransitionStore((s) => s.handleMidpoint)
  const handleComplete = useTransitionStore((s) => s.handleComplete)

  return (
    <>
      {children}
      <EnteringTransition />
      <EndingTransition />
      <ThemeTransitionOverlay request={request} onMidpoint={handleMidpoint} onComplete={handleComplete} />
      <PageTransitionOverlay request={request} onMidpoint={handleMidpoint} onComplete={handleComplete} />
      <LanguageTransitionOverlay request={request} onMidpoint={handleMidpoint} onComplete={handleComplete} />
    </>
  )
}

export { WorldTransitionProvider }
