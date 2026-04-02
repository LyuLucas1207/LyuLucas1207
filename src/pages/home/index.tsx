import { HomePlanetHero } from './components/HomePlanetHero'
import styles from './styles.module.css'

function WorldPage() {
  return (
    <div className={styles.page}>
      <section className={styles.heroStage}>
        <HomePlanetHero />
      </section>
    </div>
  )
}

export { WorldPage }
