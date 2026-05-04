import * as THREE from 'three'

export function initConsultingScene(canvas: HTMLCanvasElement): () => void {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0x0e0e0e, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 200)
  camera.position.set(0, 0, 22)

  const goldColor = new THREE.Color(0xC9A84C)

  // ── Central wireframe icosahedron ────────
  const icoGeo = new THREE.IcosahedronGeometry(5, 1)
  const icoMat = new THREE.MeshBasicMaterial({
    color: goldColor,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  })
  const ico = new THREE.Mesh(icoGeo, icoMat)
  scene.add(ico)

  // Inner solid icosahedron with glow
  const icoInner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(4.5, 0),
    new THREE.MeshBasicMaterial({ color: 0x0e0e0e })
  )
  scene.add(icoInner)

  // ── Orbiting rings ───────────────────────
  const rings: { mesh: THREE.Mesh; speed: number; axis: THREE.Vector3 }[] = []

  const ringData = [
    { r: 7,   tube: 0.04, tilt: 0.3,  speed: 0.006 },
    { r: 9,   tube: 0.03, tilt: 1.1,  speed: -0.004 },
    { r: 11,  tube: 0.025,tilt: 0.7,  speed: 0.003 },
  ]

  ringData.forEach(d => {
    const geo = new THREE.TorusGeometry(d.r, d.tube, 8, 120)
    const mat = new THREE.MeshBasicMaterial({ color: goldColor, transparent: true, opacity: 0.35 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.x = d.tilt
    scene.add(mesh)
    rings.push({ mesh, speed: d.speed, axis: new THREE.Vector3(Math.random(), Math.random(), 0.2).normalize() })
  })

  // ── Orbiting nodes on outer ring ─────────
  const orbitNodes: { mesh: THREE.Mesh; angle: number; radius: number; speed: number }[] = []
  const nodeMat = new THREE.MeshBasicMaterial({ color: goldColor })
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), nodeMat.clone())
    scene.add(m)
    orbitNodes.push({ mesh: m, angle: (i / 6) * Math.PI * 2, radius: 9, speed: 0.007 + i * 0.001 })
  }

  // ── Animate ──────────────────────────────
  let frameId: number

  function animate() {
    frameId = requestAnimationFrame(animate)

    ico.rotation.x += 0.004
    ico.rotation.y += 0.006
    icoInner.rotation.copy(ico.rotation)

    rings.forEach(r => {
      r.mesh.rotation.x += r.speed * 0.6
      r.mesh.rotation.y += r.speed
    })

    orbitNodes.forEach(n => {
      n.angle += n.speed
      n.mesh.position.x = Math.cos(n.angle) * n.radius
      n.mesh.position.y = Math.sin(n.angle) * n.radius * 0.35
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