import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from '../../navigations/AppRouter'

function BrowserRouterProvider() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export { BrowserRouterProvider }
