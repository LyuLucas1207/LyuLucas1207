import type { PropsWithChildren } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LayoutProvider } from 'nfx-ui/layouts'
import { LanguageEnum, LanguageProvider } from 'nfx-ui/languages'
import { BaseEnum, ThemeEnum, ThemeProvider } from 'nfx-ui/themes'

import { NAME_SPACES, NAME_SPACES_MAP, RESOURCES } from '@/assets/languages'
import { WorldTransitionProvider } from '../WorldTransitionProvider'

const queryClient = new QueryClient()

function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider
        bundles={{ RESOURCES, NAME_SPACES_MAP, NAME_SPACES }}
        fallbackLng={LanguageEnum.ZH}
      >
        <ThemeProvider defaultTheme={ThemeEnum.WINE} defaultBase={BaseEnum.WINDOWS}>
          <LayoutProvider>
            <WorldTransitionProvider>{children}</WorldTransitionProvider>
          </LayoutProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export { AppProviders }
