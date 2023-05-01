import * as THREE from 'three'

const FOV = 60
const NEAR = 1.0
const FAR = 1000.0
const CAMERA_POSITION = [0, 0, 10] as const

const aspect = () => window.innerWidth / window.innerHeight

export function createCamera(renderer: THREE.WebGLRenderer) {
  const camera = new THREE.PerspectiveCamera(FOV, aspect(), NEAR, FAR)
  camera.position.set(...CAMERA_POSITION)

  window.addEventListener(
    'resize',
    () => {
      camera.aspect = aspect()
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    { once: true }
  )

  return camera
}
