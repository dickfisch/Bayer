import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function localSrc(localImage) {
  return localImage.replace('public/', '/')
}

export default function ProductSphere({ products }) {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!products.length || !mountRef.current) return

    const mount = mountRef.current
    let width = mount.clientWidth
    let height = mount.clientHeight

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 9)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const root = new THREE.Group()
    scene.add(root)

    const sphere = new THREE.Group()
    root.add(sphere)

    const radius = 4
    const planeSize = 0.9
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'

    const planes = []
    const n = products.length
    const golden = Math.PI * (3 - Math.sqrt(5))

    products.forEach((p, i) => {
      const t = (i + 0.5) / n
      const phi = Math.acos(1 - 2 * t)
      const theta = golden * i

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      const geom = new THREE.PlaneGeometry(planeSize, planeSize)
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(geom, mat)
      mesh.position.set(x, y, z)
      mesh.lookAt(0, 0, 0)
      mesh.rotateY(Math.PI)
      mesh.userData = { product: p, baseScale: 1, targetScale: 1, targetOpacity: 1 }
      sphere.add(mesh)
      planes.push(mesh)

      const applyTex = tex => {
        tex.colorSpace = THREE.SRGBColorSpace
        mat.map = tex
        mat.needsUpdate = true
        mesh.userData.hasTexture = true
      }

      loader.load(
        localSrc(p.local_image),
        applyTex,
        undefined,
        () => loader.load(p.image_url, applyTex, undefined, () => {})
      )
    })

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(999, 999)

    const toNDC = e => {
      const rect = renderer.domElement.getBoundingClientRect()
      return new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      )
    }

    const onPointerMove = e => {
      const v = toNDC(e)
      mouse.x = v.x
      mouse.y = v.y
    }

    const onPointerLeave = () => {
      mouse.x = 999
      mouse.y = 999
    }

    let isDragging = false
    let dragMoved = false
    let prevX = 0
    let prevY = 0
    let targetRotY = 0
    let targetRotX = 0
    let rotY = 0
    let rotX = 0

    const onPointerDown = e => {
      isDragging = true
      dragMoved = false
      prevX = e.clientX
      prevY = e.clientY
      renderer.domElement.setPointerCapture?.(e.pointerId)
    }

    const onDrag = e => {
      onPointerMove(e)
      if (!isDragging) return
      const dx = e.clientX - prevX
      const dy = e.clientY - prevY
      if (Math.abs(dx) + Math.abs(dy) > 2) dragMoved = true
      targetRotY += dx * 0.005
      targetRotX += dy * 0.005
      targetRotX = Math.max(-0.9, Math.min(0.9, targetRotX))
      prevX = e.clientX
      prevY = e.clientY
    }

    const onPointerUp = e => {
      isDragging = false
      try { renderer.domElement.releasePointerCapture?.(e.pointerId) } catch {}
    }

    const onClick = e => {
      if (dragMoved) return
      const m = toNDC(e)
      raycaster.setFromCamera(m, camera)
      const hits = raycaster.intersectObjects(planes)
      const visibleHit = hits.find(h => {
        const worldPos = new THREE.Vector3()
        h.object.getWorldPosition(worldPos)
        const toCam = new THREE.Vector3().subVectors(camera.position, worldPos).normalize()
        const normal = new THREE.Vector3(0, 0, 0).sub(worldPos).normalize()
        return normal.dot(toCam) < 0
      })
      if (visibleHit) {
        window.open(visibleHit.object.userData.product.source_url, '_blank', 'noopener,noreferrer')
      }
    }

    const el = renderer.domElement
    el.addEventListener('pointermove', onDrag)
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointerleave', onPointerLeave)
    el.addEventListener('click', onClick)

    let rafId = 0
    const origin = new THREE.Vector3(0, 0, 0)

    const tick = () => {
      if (!isDragging) targetRotY += 0.0018

      rotY += (targetRotY - rotY) * 0.08
      rotX += (targetRotX - rotX) * 0.08
      sphere.rotation.y = rotY
      sphere.rotation.x = rotX

      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(planes)
      let hitId = null
      for (const h of hits) {
        const wp = new THREE.Vector3()
        h.object.getWorldPosition(wp)
        const toCam = new THREE.Vector3().subVectors(camera.position, wp).normalize()
        const normal = new THREE.Vector3().subVectors(origin, wp).normalize()
        if (normal.dot(toCam) < 0) { hitId = h.object.uuid; break }
      }

      planes.forEach(plane => {
        const wp = new THREE.Vector3()
        plane.getWorldPosition(wp)
        const toCam = new THREE.Vector3().subVectors(camera.position, wp).normalize()
        const normal = new THREE.Vector3().subVectors(origin, wp).normalize()
        const facing = Math.max(0, -normal.dot(toCam))

        const wantScale = plane.uuid === hitId ? 1.7 : 1
        plane.scale.x += (wantScale - plane.scale.x) * 0.15
        plane.scale.y += (wantScale - plane.scale.y) * 0.15

        if (plane.material) {
          const wantOpacity = plane.userData.hasTexture ? facing : 0
          plane.material.opacity += (wantOpacity - plane.material.opacity) * 0.12
        }
      })

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const onResize = () => {
      width = mount.clientWidth
      height = mount.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      el.removeEventListener('pointermove', onDrag)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointerleave', onPointerLeave)
      el.removeEventListener('click', onClick)
      mount.removeChild(el)
      planes.forEach(p => {
        p.geometry.dispose()
        if (p.material.map) p.material.map.dispose()
        p.material.dispose()
      })
      renderer.dispose()
    }
  }, [products])

  return <div ref={mountRef} className="product-sphere" />
}
