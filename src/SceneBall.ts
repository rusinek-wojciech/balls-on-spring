import * as THREE from 'three'
import { from } from './utils'

export class SceneBall {
  private _mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
  private _velocity: THREE.Vector3
  private _force: THREE.Vector3
  readonly mass: number

  private constructor(
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>,
    velocity: THREE.Vector3,
    force: THREE.Vector3,
    mass: number
  ) {
    this._mesh = mesh
    this._velocity = velocity
    this._force = force
    this.mass = mass
  }

  get position() {
    return this._mesh.position
  }

  set force(force: THREE.Vector3) {
    this._force.copy(force)
  }

  velocity(dt: number) {
    return from(this._force)
      .divideScalar(this.mass)
      .multiplyScalar(dt)
      .add(this._velocity)
  }

  next(dt: number) {
    const velocity = this.velocity(dt)
    this._velocity.copy(velocity)
    const nextPos = velocity.multiplyScalar(dt).add(this.position)
    this.position.copy(nextPos)
  }

  static create(
    scene: THREE.Scene,
    options: {
      position: [number, number]
      velocity: [number, number]
      force: [number, number]
      color: string
      mass: number
      radius: number
    }
  ) {
    const { position, velocity, force } = options
    const geometry = new THREE.SphereGeometry(options.radius)
    const material = new THREE.MeshStandardMaterial({
      color: options.color,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(...position, 0)
    scene.add(mesh)
    return new SceneBall(
      mesh,
      new THREE.Vector3(...velocity, 0),
      new THREE.Vector3(...force, 0),
      options.mass
    )
  }
}
