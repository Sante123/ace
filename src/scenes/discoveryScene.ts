// GEO — Generative Engine Optimisation scene
// Visualises your brand being recommended by AI engines (ChatGPT, Perplexity, Gemini etc.)

import * as THREE from 'three'

export function initDiscoveryScene(canvas: HTMLCanvasElement): () => void {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0x0e0e0e, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(52, canvas.clientWidth / canvas.clientHeight, 0.1, 200)
  camera.position.set(0, 0, 28)

  const GOLD     = 0xC9A84C
  const GOLD_DIM = 0x6B5520
  const GOLD_HI  = 0xE8C76B

  // ── Central brand node (your business) ───
  const brandGeo = new THREE.IcosahedronGeometry(1.6, 1)
  const brandMat = new THREE.MeshBasicMaterial({ color: GOLD })
  const brandMesh = new THREE.Mesh(brandGeo, brandMat)
  scene.add(brandMesh)

  // Breathing outer ring on brand
  const breathRingMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.35, wireframe: true })
  const breathRing = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.05, 6, 48), breathRingMat)
  scene.add(breathRing)

  // ── Six AI engine nodes in elliptical orbit ──
  // ChatGPT · Perplexity · Gemini · Copilot · Claude · Meta AI
  const ENGINE_COUNT = 6
  const ORBIT_RX = 11   // x radius
  const ORBIT_RY = 6    // y radius (flattened = depth illusion)

  interface EngineNode {
    mesh:  THREE.Mesh
    halo:  THREE.Mesh
    angle: number
    phase: number
  }
  const engines: EngineNode[] = []

  for (let i = 0; i < ENGINE_COUNT; i++) {
    const angle = (i / ENGINE_COUNT) * Math.PI * 2
    const x = Math.cos(angle) * ORBIT_RX
    const y = Math.sin(angle) * ORBIT_RY

    // Octahedron per engine
    const mesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.65, 0),
      new THREE.MeshBasicMaterial({ color: GOLD_DIM })
    )
    mesh.position.set(x, y, 0)
    scene.add(mesh)

    // Halo ring
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.0, 0.035, 4, 28),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.22, wireframe: true })
    )
    halo.position.set(x, y, 0)
    scene.add(halo)

    engines.push({ mesh, halo, angle, phase: i * 1.05 })
  }

  // ── Static spokes: brand → each engine ───
  engines.forEach(e => {
    const pts = [new THREE.Vector3(0, 0, 0), e.mesh.position.clone()]
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.08 })
    ))
  })

  // ── Traveling signal pulses ───────────────
  // Outbound = query leaving brand to engine
  // Inbound  = recommendation coming back (brighter, larger)
  interface Pulse {
    mesh:      THREE.Mesh
    engineIdx: number
    t:         number
    speed:     number
    inbound:   boolean
  }
  const pulses: Pulse[] = []
  const pulseMat = new THREE.MeshBasicMaterial({ color: GOLD })

  function makePulse(staggerT = 0): Pulse {
    const engineIdx = Math.floor(Math.random() * ENGINE_COUNT)
    const inbound   = Math.random() > 0.55   // ~45% come back as recommendations
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 6, 6), pulseMat.clone())
    scene.add(mesh)
    return { mesh, engineIdx, t: staggerT, speed: 0.011 + Math.random() * 0.009, inbound }
  }

  for (let i = 0; i < 9; i++) pulses.push(makePulse(Math.random()))

  // ── Bezier helper ─────────────────────────
  function bezier(a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
    const mid = new THREE.Vector3().lerpVectors(a, b, 0.5)
    mid.z += 2.5  // arc out towards camera
    const s = t
    return new THREE.Vector3(
      (1-s)*(1-s)*a.x + 2*(1-s)*s*mid.x + s*s*b.x,
      (1-s)*(1-s)*a.y + 2*(1-s)*s*mid.y + s*s*b.y,
      (1-s)*(1-s)*a.z + 2*(1-s)*s*mid.z + s*s*b.z,
    )
  }

  // ── Ambient dust particles ────────────────
  const DUST = 70
  const dustPos = new Float32Array(DUST * 3)
  const dustVel = Array.from({ length: DUST }, () => ({
    vx: (Math.random() - 0.5) * 0.014,
    vy: (Math.random() - 0.5) * 0.014,
  }))
  for (let i = 0; i < DUST; i++) {
    dustPos[i*3]   = (Math.random() - 0.5) * 52
    dustPos[i*3+1] = (Math.random() - 0.5) * 34
    dustPos[i*3+2] = (Math.random() - 0.5) * 6
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: GOLD, size: 0.18, transparent: true, opacity: 0.28
  })))

  // ── Animate ───────────────────────────────
  let frameId: number
  let elapsed = 0

  function animate() {
    frameId = requestAnimationFrame(animate)
    elapsed += 0.016

    // Brand node slow rotation
    brandMesh.rotation.y += 0.009
    brandMesh.rotation.x += 0.004

    // Breathing ring
    const breathe = 1 + 0.14 * Math.sin(elapsed * 1.6)
    breathRing.scale.setScalar(breathe)
    breathRingMat.opacity = 0.15 + 0.18 * Math.abs(Math.sin(elapsed * 1.6))

    // Engine nodes: spin + halo pulse
    engines.forEach(e => {
      e.mesh.rotation.y += 0.018
      e.mesh.rotation.z += 0.009
      const pulse = 0.7 + 0.55 * Math.abs(Math.sin(elapsed * 0.9 + e.phase))
      e.halo.scale.setScalar(pulse)
      ;(e.halo.material as THREE.MeshBasicMaterial).opacity = 0.08 + pulse * 0.18
    })

    // Signal pulses travel along bezier arcs
    pulses.forEach(p => {
      p.t += p.speed
      if (p.t >= 1) {
        // Respawn with fresh random engine + direction
        p.t = 0
        p.engineIdx = Math.floor(Math.random() * ENGINE_COUNT)
        p.inbound   = Math.random() > 0.55
      }

      const brand  = new THREE.Vector3(0, 0, 0)
      const engine = engines[p.engineIdx].mesh.position.clone()
      const origin = p.inbound ? engine : brand
      const dest   = p.inbound ? brand  : engine

      p.mesh.position.copy(bezier(origin, dest, p.t))

      // Inbound recommendations: brighter gold + bigger
      const mat = p.mesh.material as THREE.MeshBasicMaterial
      if (p.inbound) {
        mat.color.setHex(GOLD_HI)
        p.mesh.scale.setScalar(1.5 + 0.4 * Math.sin(elapsed * 4 + p.engineIdx))
      } else {
        mat.color.setHex(GOLD)
        p.mesh.scale.setScalar(1.0)
      }
    })

    // Drift ambient dust
    for (let i = 0; i < DUST; i++) {
      dustPos[i*3]   += dustVel[i].vx
      dustPos[i*3+1] += dustVel[i].vy
      if (Math.abs(dustPos[i*3])   > 26) dustVel[i].vx *= -1
      if (Math.abs(dustPos[i*3+1]) > 17) dustVel[i].vy *= -1
    }
    dustGeo.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }

  animate()

  const handleResize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', handleResize)

  return () => {
    cancelAnimationFrame(frameId)
    window.removeEventListener('resize', handleResize)
    renderer.dispose()
  }
}