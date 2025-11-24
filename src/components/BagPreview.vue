<template>
  <div class="viewer-wrapper">
    <canvas ref="canvas3d" class="three-canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

const props = defineProps({
  color: { type: String, default: "#ffffff" },
  name: { type: String, default: "" }
})

const canvas3d = ref(null)
let model = null

function createTextTexture(text) {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "black"
  ctx.font = "bold 140px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

onMounted(() => {
  const canvas = canvas3d.value
  const viewer = document.querySelector(".viewer-wrapper")

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  const camera = new THREE.PerspectiveCamera(
    75,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 40)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(viewer.clientWidth, viewer.clientHeight)

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1)
  scene.add(hemi)

  const dir = new THREE.DirectionalLight(0xffffff, 1)
  dir.position.set(5, 10, 7)
  scene.add(dir)

  const loader = new GLTFLoader()
  loader.load("/models/punga_chips_export.glb", (gltf) => {
    model = gltf.scene

    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    model.position.sub(center)
    model.scale.set(0.8, 0.8, 0.8)

    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: props.color,
          map: createTextTexture(props.name),
          roughness: 0.4,
          metalness: 0
        })
      }
    })

    scene.add(model)
  })

  let dragging = false
  let prev = { x: 0, y: 0 }

  canvas.addEventListener("mousedown", (e) => {
    dragging = true
    prev = { x: e.clientX, y: e.clientY }
  })

  canvas.addEventListener("mouseup", () => {
    dragging = false
  })

  canvas.addEventListener("mousemove", (e) => {
    if (dragging && model) {
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      model.rotation.y += dx * 0.01
      model.rotation.x += dy * 0.01
      prev = { x: e.clientX, y: e.clientY }
    }
  })

  function render() {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
  }
  render()

  window.addEventListener("resize", () => {
    camera.aspect = viewer.clientWidth / viewer.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(viewer.clientWidth, viewer.clientHeight)
  })
})

watch(
  () => props.color,
  (value) => {
    if (model) {
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.color.set(value)
        }
      })
    }
  }
)

watch(
  () => props.name,
  (value) => {
    if (model) {
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.map = createTextTexture(value)
          child.material.needsUpdate = true
        }
      })
    }
  }
)
</script>

<style scoped>
.viewer-wrapper {
  width: 100%;
  height: 100%;
}

.three-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
