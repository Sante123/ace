import * as THREE from 'three'

export function initHeroScene(canvas: HTMLCanvasElement): () => void {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0x070707, 1)

  const scene  = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
  camera.position.set(0, 0, 45)

  // ── Particle nodes ────────────────────────
  const COUNT = 200
  const positions = new Float32Array(COUNT * 3)
  const nodeData: { x: number; y: number; z: number; vx: number; vy: number; vz: number }[] = []

  for (let i = 0; i < COUNT; i++) {
    const x = (Math.random() - 0.5) * 80
    const y = (Math.random() - 0.5) * 50
    const z = (Math.random() - 0.5) * 30
    positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z
    nodeData.push({ x, y, z, vx: (Math.random() - 0.5) * 0.02, vy: (Math.random() - 0.5) * 0.02, vz: (Math.random() - 0.5) * 0.01 })
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.35, transparent: true, opacity: 0.7 })))

  // ── Connection lines ──────────────────────
  const MAX_CONN = 400
  const linePos  = new Float32Array(MAX_CONN * 6)
  const lineGeo  = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
  scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.12 })))

  const THRESH = 18
  const mouse  = { x: 0, y: 0 }

  const onMouseMove = (e: MouseEvent) => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.3
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.3
  }
  window.addEventListener('mousemove', onMouseMove)

  let frameId: number

  function animate() {
    frameId = requestAnimationFrame(animate)

    for (let i = 0; i < COUNT; i++) {
      const n = nodeData[i]
      n.x += n.vx; n.y += n.vy; n.z += n.vz
      if (Math.abs(n.x) > 40) n.vx *= -1
      if (Math.abs(n.y) > 25) n.vy *= -1
      if (Math.abs(n.z) > 15) n.vz *= -1
      positions[i * 3] = n.x; positions[i * 3 + 1] = n.y; positions[i * 3 + 2] = n.z
    }
    geo.attributes.position.needsUpdate = true

    let conn = 0
    for (let i = 0; i < COUNT && conn < MAX_CONN; i++) {
      for (let j = i + 1; j < COUNT && conn < MAX_CONN; j++) {
        const dx = nodeData[i].x - nodeData[j].x
        const dy = nodeData[i].y - nodeData[j].y
        const dz = nodeData[i].z - nodeData[j].z
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < THRESH) {
          linePos[conn*6]   = nodeData[i].x; linePos[conn*6+1] = nodeData[i].y; linePos[conn*6+2] = nodeData[i].z
          linePos[conn*6+3] = nodeData[j].x; linePos[conn*6+4] = nodeData[j].y; linePos[conn*6+5] = nodeData[j].z
          conn++
        }
      }
    }
    lineGeo.setDrawRange(0, conn * 2)
    lineGeo.attributes.position.needsUpdate = true

    camera.position.x += (mouse.x * 5 - camera.position.x) * 0.04
    camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.04

    renderer.render(scene, camera)
  }
  animate()

  const onResize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  return () => {
    cancelAnimationFrame(frameId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
    renderer.dispose()
  }
}