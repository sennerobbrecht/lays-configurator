<template>
  <div class="viewer-wrapper">
    <canvas ref="canvas3d" class="three-canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import logoSrc from "@/assets/lays_logo.png"

const props = defineProps({
  color: { type: String, default: "#ffffff" },
  name: { type: String, default: "" }
})

const canvas3d = ref(null)
let model = null
let laysLogo = null

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
  })
}

async function createCustomTexture(text, color) {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = color
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const logoWidth = canvas.width * 0.45
  const logoHeight = (laysLogo.height / laysLogo.width) * logoWidth
  const logoX = canvas.width / 2 - logoWidth / 2
  const logoY = canvas.height * 0.18
  ctx.drawImage(laysLogo, logoX, logoY, logoWidth, logoHeight)

  ctx.fillStyle = "black"
  ctx.font = `bold ${canvas.height * 0.10}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height * 0.72)

  const texture = new THREE.CanvasTexture(canvas)
  texture.flipY = false
  texture.needsUpdate = true
  return texture
}

onMounted(async () => {
  const canvas = canvas3d.value
  const viewer = document.querySelector(".viewer-wrapper")

  laysLogo = await loadImage(logoSrc)

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

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1))
  const dir = new THREE.DirectionalLight(0xffffff, 1)
  dir.position.set(5, 10, 7)
  scene.add(dir)

  const loader = new GLTFLoader()
  loader.load("/models/punga_chips_export.glb", async (gltf) => {
    model = gltf.scene

    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    model.position.sub(center)
    model.scale.set(0.8, 0.8, 0.8)

    const texture = await createCustomTexture(props.name, props.color)

    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.4,
          metalness: 0
        })
      }
    })

    scene.add(model)
  })

  let dragging = false
  let prev = { x: 0, y: 0 }

  canvas.addEventListener("mousedown", e => {
    dragging = true
    prev = { x: e.clientX, y: e.clientY }
  })

  canvas.addEventListener("mouseup", () => dragging = false)

  canvas.addEventListener("mousemove", e => {
    if (dragging && model) {
      model.rotation.y += (e.clientX - prev.x) * 0.01
      model.rotation.x += (e.clientY - prev.y) * 0.01
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

watch(() => props.color, async (value) => {
  if (model && laysLogo) {
    const tex = await createCustomTexture(props.name, value)
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.map = tex
        child.material.needsUpdate = true
      }
    })
  }
})

watch(() => props.name, async (value) => {
  if (model && laysLogo) {
    const tex = await createCustomTexture(value, props.color)
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.map = tex
        child.material.needsUpdate = true
      }
    })
  }
})
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
