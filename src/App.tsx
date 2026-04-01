import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './navigations/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
