import { useEffect, useRef, useState } from 'react'
import styles from './ServiceBlock.module.css'
import Button from './Button'

interface Props {
  number:    string
  name:      string
  tag:       string | null
  desc:      string
  bullets:   string[]
  cta:       string
  reversed:  boolean
  initScene: (canvas: HTMLCanvasElement) => () => void
}

export default function ServiceBlock({ number, name, tag, desc, bullets, cta, reversed, initScene }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Lazy-init Three.js scene on intersection
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cleanup: (() => void) | undefined

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cleanup = initScene(canvas)
          obs.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    obs.observe(canvas)
    return () => { obs.disconnect(); cleanup?.() }
  }, [initScene])

  // Reveal content on scroll
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <article className={`${styles.block} ${reversed ? styles.reversed : ''}`}>
      <div className={styles.canvasWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <div ref={contentRef} className={`${styles.content} ${visible ? styles.visible : ''}`}>
        <p className={styles.number}>{number}</p>
        <h3 className={styles.name}>
          {name}
          {tag && <span className={styles.tag}>{tag}</span>}
        </h3>
        <p className={styles.desc}>{desc}</p>
        <ul className={styles.bullets}>
          {bullets.map(b => <li key={b}>{b}</li>)}
        </ul>
        <Button unstyled className={styles.cta} onClick={scrollToContact}>{cta}</Button>
      </div>
    </article>
  )
}
