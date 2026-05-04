import { useEffect, useRef } from 'react'
import styles from './About.module.css'

const STATS = [
  { num: '3',    label: 'Core AI Services' },
  { num: '100%', label: 'Custom Solutions'  },
  { num: '∞',    label: 'Scalability'       },
]

export default function About() {
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

      const COUNT = 90
      const pos   = new Float32Array(COUNT * 3)
      const vel   = Array.from({ length: COUNT }, () => ({
        vx: (Math.random() - 0.5) * 0.014,
        vy: (Math.random() - 0.5) * 0.014,
      }))
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 90
        pos[i * 3 + 1] = (Math.random() - 0.5) * 60
        pos[i * 3 + 2] = 0
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
        color: 0xC9A84C, size: 0.28, transparent: true, opacity: 0.35,
      })))

      const animate = () => {
        frameId = requestAnimationFrame(animate)
        for (let i = 0; i < COUNT; i++) {
          pos[i * 3]     += vel[i].vx
          pos[i * 3 + 1] += vel[i].vy
          if (Math.abs(pos[i * 3])     > 45) vel[i].vx *= -1
          if (Math.abs(pos[i * 3 + 1]) > 30) vel[i].vy *= -1
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

      // Store cleanup on canvas element for effect cleanup
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
    <section id="about" className={styles.section}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.inner}>
        <div className={styles.left}>
          <span className="eyebrow">Who We Are</span>
          <h2 className="section-title">
            About <em>Ace AI Solutions</em>
          </h2>
        </div>

        <div className={styles.right}>
          <p className={styles.lead}>
            We are a specialist AI solutions firm built for businesses that refuse to be left behind.
          </p>
          <p className={styles.body}>
            At Ace AI Solutions, we combine deep technical expertise with sharp commercial thinking. Our team designs, builds, and deploys artificial intelligence systems that solve real operational problems — not theoretical ones. We work with businesses across industries to make AI tangible, measurable, and transformative.
          </p>
          <p className={styles.body}>
            We believe the most powerful technology in the world is worthless unless it is purposefully applied. That conviction drives every engagement we take on — from the first discovery call to the final deployment. We are partners in your growth, not just vendors of technology.
          </p>

          <div className={styles.stats}>
            {STATS.map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
