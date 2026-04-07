import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StrictMode } from 'react'
import { LayoutProvider } from 'nfx-ui/layouts'
import { LanguageEnum, LanguageProvider } from 'nfx-ui/languages'
import { BaseEnum, ThemeEnum, ThemeProvider } from 'nfx-ui/themes'

import { NAME_SPACES, NAME_SPACES_MAP, RESOURCES } from '@/assets/languages'
import { AppRouter } from '@/navigations/AppRouter'
import { BrowserRouterProvider } from '@/providers/BrowserRouterProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { WorldTransitionProvider } from '@/providers/WorldTransitionProvider'

import './App.css'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  return (
    <StrictMode>
      <QueryProvider>
        <LanguageProvider
          bundles={{ RESOURCES, NAME_SPACES_MAP, NAME_SPACES }}
          fallbackLng={LanguageEnum.ZH}
        >
          <ThemeProvider defaultTheme={ThemeEnum.DEFAULT} defaultBase={BaseEnum.WINDOWS}>
            <LayoutProvider>
              <BrowserRouterProvider>
                <WorldTransitionProvider>
                  <AppRouter />
                </WorldTransitionProvider>
              </BrowserRouterProvider>
            </LayoutProvider>
          </ThemeProvider>
        </LanguageProvider>
      </QueryProvider>
    </StrictMode>
  )
}
