// src/three/createEnvironment.js
import * as THREE from "three"

export function createEnvironment(scene) {
  /* ---------------- ROOM ---------------- */
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(140, 70, 140),
    new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.85
    })
  )
  room.material.side = THREE.BackSide
  room.position.y = 18
  scene.add(room)

  /* ---------------- FLOOR ---------------- */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 140),
    new THREE.MeshStandardMaterial({
      color: 0xe5e5e5,
      roughness: 0.75,
      metalness: 0.05
    })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -12
  scene.add(floor)

  /* ---------------- LIGHTS ---------------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.3))

  const key = new THREE.SpotLight(0xffffff, 1.8, 200, Math.PI / 6, 0.4, 1)
  key.position.set(0, 40, 10)
  key.target.position.set(0, 5, 0)
  scene.add(key, key.target)

  const rim = new THREE.DirectionalLight(0xffffff, 0.8)
  rim.position.set(-20, 15, -30)
  scene.add(rim)

  const fill = new THREE.DirectionalLight(0xffffff, 0.5)
  fill.position.set(20, 10, 20)
  scene.add(fill)
}
