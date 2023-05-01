import * as THREE from 'three'

export const from = (v: THREE.Vector3 = new THREE.Vector3()) =>
  new THREE.Vector3().copy(v)
