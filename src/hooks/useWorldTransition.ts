import { useContext } from 'react'

import { WorldTransitionContext } from '../providers/worldTransition'

function useWorldTransition() {
  const context = useContext(WorldTransitionContext)

  if (!context) {
    throw new Error('useWorldTransition must be used within WorldTransitionProvider')
  }

  return context
}

export { useWorldTransition }
