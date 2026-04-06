import type { ReactNode } from 'react'

import { BrowserRouter } from 'react-router-dom'

import { useRouterEvents } from './hooks/useRouterEvents'

interface BrowserRouterProviderProps {
  children?: ReactNode
}

function RouterEventsHandler({ children }: { children: ReactNode }) {
  useRouterEvents()
  return <>{children}</>
}

function BrowserRouterProvider({ children }: BrowserRouterProviderProps) {
  return (
    <BrowserRouter>
      <RouterEventsHandler>{children}</RouterEventsHandler>
    </BrowserRouter>
  )
}

export { BrowserRouterProvider }
