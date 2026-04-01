import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext'
import { useEffect, useRef, useState } from 'react'

import styles from './styles.module.css'

type EditorialTextProps = {
  className?: string
  font?: string
  lineHeight?: number
  text: string
}

type LineShape = {
  text: string
  width: number
}

function EditorialText({
  className,
  font = '600 34px "Cormorant Garamond"',
  lineHeight = 44,
  text,
}: EditorialTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [lines, setLines] = useState<LineShape[]>([])

  useEffect(() => {
    const element = containerRef.current
    if (!element) {
      return
    }

    const update = () => {
      const width = element.clientWidth
      if (!width) {
        return
      }

      const prepared = prepareWithSegments(text, font)
      const result = layoutWithLines(prepared, width, lineHeight)
      setLines(result.lines.map((line) => ({ text: line.text, width: line.width })))
    }

    const resizeObserver = new ResizeObserver(() => update())
    resizeObserver.observe(element)
    update()

    return () => {
      resizeObserver.disconnect()
    }
  }, [font, lineHeight, text])

  return (
    <div ref={containerRef} className={`${styles.wrapper} ${className ?? ''}`}>
      {lines.map((line, index) => (
        <span
          key={`${line.text}-${index}`}
          className={styles.line}
          style={{ maxWidth: `${Math.ceil(line.width) + 4}px` }}
        >
          {line.text}
        </span>
      ))}
    </div>
  )
}

export { EditorialText }
