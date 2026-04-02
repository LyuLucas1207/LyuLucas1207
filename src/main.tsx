import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LayoutProvider } from 'nfx-ui/layouts'
import { LanguageEnum, LanguageProvider } from 'nfx-ui/languages'
import { BaseEnum, ThemeEnum, ThemeProvider } from 'nfx-ui/themes'

import { NAME_SPACES, NAME_SPACES_MAP, RESOURCES } from '@/assets/languages'
import { BrowserRouterProvider } from '@/providers/BrowserRouterProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { WorldTransitionProvider } from '@/providers/WorldTransitionProvider'

import './index.css'

import App from './App'

gsap.registerPlugin(ScrollTrigger)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <LanguageProvider
        bundles={{ RESOURCES, NAME_SPACES_MAP, NAME_SPACES }}
        fallbackLng={LanguageEnum.ZH}
      >
        <ThemeProvider defaultTheme={ThemeEnum.WINE} defaultBase={BaseEnum.WINDOWS}>
          <LayoutProvider>
            <WorldTransitionProvider>
              <BrowserRouterProvider>
                <App />
              </BrowserRouterProvider>
            </WorldTransitionProvider>
          </LayoutProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryProvider>
  </StrictMode>,
)
