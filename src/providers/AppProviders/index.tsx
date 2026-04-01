import type { PropsWithChildren } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LayoutProvider } from 'nfx-ui/layouts'
import { BaseEnum, ThemeEnum, ThemeProvider } from 'nfx-ui/themes'

import { WorldTransitionProvider } from '../WorldTransitionProvider'

const queryClient = new QueryClient()

function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme={ThemeEnum.WINE} defaultBase={BaseEnum.WINDOWS}>
        <LayoutProvider>
          <WorldTransitionProvider>{children}</WorldTransitionProvider>
        </LayoutProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export { AppProviders }
