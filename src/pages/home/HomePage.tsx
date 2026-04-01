import { HomePlanetHero } from './components/HomePlanetHero'
import styles from './HomePage.module.css'

function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.heroStage} data-page-chunk>
        <HomePlanetHero />
      </section>
    </div>
  )
}

export { HomePage }
