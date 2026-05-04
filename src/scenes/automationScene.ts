import * as THREE from 'three'

export function initAutomationScene(canvas: HTMLCanvasElement): () => void {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0x0e0e0e, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 200)
  camera.position.set(0, 0, 30)

  // ── Circuit grid ─────────────────────────
  const gridGroup = new THREE.Group()
  scene.add(gridGroup)

  const COLS = 8, ROWS = 6
  const SPACING = 4
  const nodePositions: THREE.Vector3[] = []

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = (c - COLS / 2) * SPACING + SPACING / 2
      const y = (r - ROWS / 2) * SPACING + SPACING / 2
      nodePositions.push(new THREE.Vector3(x, y, 0))
    }
  }

  // Draw node dots
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0xC9A84C })
  nodePositions.forEach(pos => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(0.12, 8), nodeMat)
    m.position.copy(pos)
    gridGroup.add(m)
  })

  // Draw grid lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.08 })
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 1; c++) {
      const a = nodePositions[r * COLS + c]
      const b = nodePositions[r * COLS + c + 1]
      const lg = new THREE.BufferGeometry().setFromPoints([a, b])
      gridGroup.add(new THREE.Line(lg, lineMat))
    }
  }
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 1; r++) {
      const a = nodePositions[r * COLS + c]
      const b = nodePositions[(r + 1) * COLS + c]
      const lg = new THREE.BufferGeometry().setFromPoints([a, b])
      gridGroup.add(new THREE.Line(lg, lineMat))
    }
  }

  // ── Flowing pulses ───────────────────────
  interface Pulse {
    mesh: THREE.Mesh
    path: THREE.Vector3[]
    t: number
    speed: number
  }

  const pulses: Pulse[] = []
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0xE2C46D })

  function makePath(): THREE.Vector3[] {
    const path: THREE.Vector3[] = []
    let r = Math.floor(Math.random() * ROWS)
    let c = Math.floor(Math.random() * COLS)
    path.push(nodePositions[r * COLS + c].clone())
    const steps = 4 + Math.floor(Math.random() * 5)
    for (let s = 0; s < steps; s++) {
      const dir = Math.random() < 0.5 ? 'h' : 'v'
      if (dir === 'h') {
        c = Math.min(COLS - 1, Math.max(0, c + (Math.random() < 0.5 ? 1 : -1)))
      } else {
        r = Math.min(ROWS - 1, Math.max(0, r + (Math.random() < 0.5 ? 1 : -1)))
      }
      path.push(nodePositions[r * COLS + c].clone())
    }
    return path
  }

  for (let i = 0; i < 12; i++) {
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.2, 8), pulseMat.clone())
    scene.add(mesh)
    pulses.push({ mesh, path: makePath(), t: Math.random(), speed: 0.006 + Math.random() * 0.008 })
  }

  // ── Animate ──────────────────────────────
  let frameId: number

  function animate() {
    frameId = requestAnimationFrame(animate)

    gridGroup.rotation.z += 0.0005

    pulses.forEach(p => {
      p.t += p.speed
      if (p.t > 1) { p.t = 0; p.path = makePath() }
      const seg = Math.min(p.path.length - 2, Math.floor(p.t * (p.path.length - 1)))
      const localT = (p.t * (p.path.length - 1)) - seg
      const a = p.path[seg], b = p.path[seg + 1]
      p.mesh.position.lerpVectors(a, b, localT)
    })

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