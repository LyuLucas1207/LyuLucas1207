import { Outlet } from 'react-router-dom'

import { Footer } from '@/layouts/Footer'
import { NavBar } from '@/layouts/NavBar'
import styles from './styles.module.css'

function SiteLayout() {
  return (
    <div className={styles.shell}>
      <div className={styles.frame} />

      <NavBar />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export { SiteLayout }
