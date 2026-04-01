import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './i18n'
import App from './App'
import { AppProviders } from './providers'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
