import { useEffect, useState } from 'react'

import styles from '../HomePlanetHero/styles.module.css'

type HomePlanetCursorProps = {
  dragging: boolean
}

function HomePlanetCursor({ dragging }: HomePlanetCursorProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onPointerEnter = () => setVisible(true)
    const onPointerLeave = () => setVisible(false)

    window.addEventListener('pointerenter', onPointerEnter)
    window.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.removeEventListener('pointerenter', onPointerEnter)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <div
      className={styles.cursorReticle}
      data-visible={visible}
      data-dragging={dragging}
      aria-hidden="true"
    >
      <span className={styles.cursorRing} />
      <span className={styles.cursorCore} />
      <span className={styles.cursorCrosshairX} />
      <span className={styles.cursorCrosshairY} />
    </div>
  )
}

export { HomePlanetCursor }
