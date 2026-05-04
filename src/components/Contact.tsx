import { useEffect, useRef } from 'react'
import styles from './Contact.module.css'

const EMAIL   = 'aceaisolutions@outlook.com'
const LINKEDIN = 'https://www.linkedin.com/in/eze-patrick-811ab136a?utm_source=share_via&utm_content=profile&utm_medium=member_ios'

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function Contact() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let frameId: number
    let disposed = false

    import('three').then(THREE => {
      if (disposed) return

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      renderer.setClearColor(0x000000, 0)

      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200)
      camera.position.z = 50

      const COUNT = 60
      const pos   = new Float32Array(COUNT * 3)
      const vel   = Array.from({ length: COUNT }, () => ({
        vx: (Math.random() - 0.5) * 0.016,
        vy: (Math.random() - 0.5) * 0.016,
      }))
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 80
        pos[i * 3 + 1] = (Math.random() - 0.5) * 50
        pos[i * 3 + 2] = 0
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
        color: 0xC9A84C, size: 0.25, transparent: true, opacity: 0.3,
      })))

      const animate = () => {
        frameId = requestAnimationFrame(animate)
        for (let i = 0; i < COUNT; i++) {
          pos[i * 3]     += vel[i].vx
          pos[i * 3 + 1] += vel[i].vy
          if (Math.abs(pos[i * 3])     > 40) vel[i].vx *= -1
          if (Math.abs(pos[i * 3 + 1]) > 25) vel[i].vy *= -1
        }
        geo.attributes.position.needsUpdate = true
        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      }
      window.addEventListener('resize', onResize)
      ;(canvas as HTMLCanvasElement & { _cleanup?: () => void })._cleanup = () => {
        cancelAnimationFrame(frameId)
        window.removeEventListener('resize', onResize)
        renderer.dispose()
      }
    })

    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      ;(canvas as HTMLCanvasElement & { _cleanup?: () => void })._cleanup?.()
    }
  }, [])

  return (
    <section id="contact" className={styles.section}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.inner}>
        <span className="eyebrow">Get in Touch</span>
        <h2 className={styles.title}>
          Ready to<br /><em>Transform</em> Your Business?
        </h2>
        <p className={styles.sub}>
          Tell us about your challenge. We will respond within 24 hours with a clear path forward.
        </p>

        <div className={styles.actions}>
          <a
            href={`mailto:${EMAIL}`}
            className="btn-primary"
            aria-label={`Email Ace AI Solutions at ${EMAIL}`}
          >
            <MailIcon />
            {EMAIL}
          </a>

          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            aria-label="Connect with Ace AI Solutions on LinkedIn"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
