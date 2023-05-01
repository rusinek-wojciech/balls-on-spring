import './style.css'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import * as THREE from 'three'
import { createCamera } from './camera'
import { SceneBall } from './SceneBall'
import { from } from './utils'

function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(0.33, 0.66, 0.1)
  directionalLight.target.position.set(0, 0, 0)
  directionalLight.castShadow = true
  directionalLight.shadow.bias = -0.001
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 500.0
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500.0
  directionalLight.shadow.camera.left = 100
  directionalLight.shadow.camera.right = -100
  directionalLight.shadow.camera.top = 100
  directionalLight.shadow.camera.bottom = -100
  scene.add(directionalLight)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  return scene
}

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  return renderer
}

function createSpring(
  scene: THREE.Scene,
  ball1: SceneBall,
  ball2: SceneBall,
  density: number
) {
  const spring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([]),
    new THREE.LineBasicMaterial({ color: 0x000000 })
  )
  scene.add(spring)
  return {
    draw() {
      const startPoint = new THREE.Vector3(
        ball1.position.x,
        ball1.position.y,
        0
      )
      const endPoint = new THREE.Vector3(ball2.position.x, ball2.position.y, 0)
      const vec = from(endPoint)
        .sub(startPoint)
        .divideScalar(density + 1)
      const angle = Math.atan2(vec.y, vec.x)
      const points = []
      for (let i = 0; i <= density; i++) {
        const point = from(vec).multiplyScalar(i).add(startPoint)
        const sin = 0.3 * Math.sin(i * density)
        point.set(
          point.x + sin * Math.sin(angle),
          point.y - sin * Math.cos(angle),
          0
        )
        points.push(point)
      }

      spring.geometry.setFromPoints(points)
    },
  }
}

function loadApp() {
  const renderer = createRenderer()
  const camera = createCamera(renderer)
  const scene = createScene()
  const clock = new THREE.Clock()

  const L = 5
  const k = 3.2

  const ball1 = SceneBall.create(scene, {
    position: [1, 0],
    velocity: [0, 0.5],
    force: [0, 0],
    mass: 1,
    radius: 0.5,
    color: '#2F4F4F',
  })
  const ball2 = SceneBall.create(scene, {
    position: [-1, 0],
    velocity: [0, -0.5],
    force: [0, 0],
    mass: 1,
    radius: 0.5,
    color: '#008B8B',
  })
  const spring = createSpring(scene, ball1, ball2, 100)

  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta()

    const pos = from(ball1.position).sub(ball2.position)
    const length = pos.length()

    const F1 = pos.normalize().multiplyScalar(-k * (length - L))
    const F2 = from(pos).negate()

    ball1.force = F1
    ball2.force = F2

    ball1.next(dt)
    ball2.next(dt)
    spring.draw()

    renderer.render(scene, camera)
  })
}

function handleWebGLNotAvailable() {
  const h1 = document.createElement('h1')
  h1.appendChild(
    document.createTextNode('WebGL is not supported on this platform')
  )
  document.body.appendChild(h1)
}

window.addEventListener(
  'DOMContentLoaded',
  () => {
    WebGL.isWebGLAvailable() ? loadApp() : handleWebGLNotAvailable()
  },
  { once: true }
)
