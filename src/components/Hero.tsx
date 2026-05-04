import { useEffect, useRef } from 'react'
import { initHeroScene } from '../scenes/heroScene'
import Button from './Button'
import styles from './Hero.module.css'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const cleanup = initHeroScene(canvasRef.current)
    return cleanup
  }, [])

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.content}>
        <span className="eyebrow">Enterprise Intelligence</span>
        <h1 className={styles.title}>
          We Build<br />
          <em>AI That Works</em><br />
          For Your Business
        </h1>
        <p className={styles.sub}>
          Automation. Consulting. Discovery.<br />
          Precision-engineered AI for businesses that demand more.
        </p>
        <div className={styles.actions}>
          <Button unstyled className="btn-primary" onClick={() => scrollTo('#services')}>
            Explore Services
          </Button>
          <Button unstyled className="btn-ghost" onClick={() => scrollTo('#contact')}>
            Talk to Us
          </Button>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
