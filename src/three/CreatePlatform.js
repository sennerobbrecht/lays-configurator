// src/three/createPlatform.js
import * as THREE from "three"

export function createPlatform(scene) {
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(12, 12, 1.5, 64),
    new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.35,
      metalness: 0.25
    })
  )

  platform.position.y = -12
  scene.add(platform)
}
