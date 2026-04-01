import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

import type { WorldMood } from '@/types'

import { WorldTransitionOverlay } from './components'

type TransitionRequest = {
  id: number
  mood: WorldMood
  title?: string
  subtitle?: string
}

type PlayWorldTransitionOptions = {
  mood: WorldMood
  title?: string
  subtitle?: string
  action?: () => void
}

type WorldTransitionContextValue = {
  playWorldTransition: (options: PlayWorldTransitionOptions) => void
}

const WorldTransitionContext = createContext<WorldTransitionContextValue | null>(null)

function WorldTransitionProvider({ children }: PropsWithChildren) {
  const [request, setRequest] = useState<TransitionRequest | null>(null)
  const pendingActionRef = useRef<(() => void) | null>(null)
  const runningRef = useRef(false)

  const playWorldTransition = useCallback((options: PlayWorldTransitionOptions) => {
    if (runningRef.current) {
      return
    }

    runningRef.current = true
    pendingActionRef.current = options.action ?? null
    setRequest({
      id: Date.now(),
      mood: options.mood,
      title: options.title,
      subtitle: options.subtitle,
    })
  }, [])

  const handleMidpoint = useCallback(() => {
    pendingActionRef.current?.()
    pendingActionRef.current = null
  }, [])

  const handleComplete = useCallback(() => {
    runningRef.current = false
    pendingActionRef.current = null
    setRequest(null)
  }, [])

  const value = useMemo(
    () => ({
      playWorldTransition,
    }),
    [playWorldTransition],
  )

  return (
    <WorldTransitionContext.Provider value={value}>
      {children}
      <WorldTransitionOverlay request={request} onMidpoint={handleMidpoint} onComplete={handleComplete} />
    </WorldTransitionContext.Provider>
  )
}

function useWorldTransition() {
  const context = useContext(WorldTransitionContext)

  if (!context) {
    throw new Error('useWorldTransition must be used within WorldTransitionProvider')
  }

  return context
}

export { useWorldTransition, WorldTransitionProvider }
