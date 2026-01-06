<template>
  <div ref="viewer" class="viewer-wrapper">
    <canvas ref="canvas3d" class="three-canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import logoSrc from "@/assets/lays_logo_transparent.png"
import { createPlatform } from "@/three/CreatePlatform"

const viewer = ref(null)
const canvas3d = ref(null)

const props = defineProps({
  color: String,
  name: String,
  flavour: String,
  font: String,
  packaging: String,
  pattern: String
})

let model = null
let laysLogo = null

function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
  })
}

function hexToRgb(hex) {
  const h = hex.replace("#", "")
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  }
}

function getMaterialConfig(type) {
  if (type === "matte") return { roughness: 1.0, metalness: 0.0 }
  if (type === "glossy") return { roughness: 0.1, metalness: 0.3 }
  if (type === "eco") return { roughness: 0.9, metalness: 0.0 }
  if (type === "premium") return { roughness: 0.25, metalness: 0.9 }
  return { roughness: 0.4, metalness: 0.0 }
}

function drawPattern(ctx, w, h, pattern) {
  ctx.lineWidth = 14
  ctx.strokeStyle = "rgba(0,0,0,0.35)"
  ctx.fillStyle = "rgba(0,0,0,0.25)"

  if (pattern === "waves") {
    for (let y = 0; y < h; y += 80) {
      ctx.beginPath()
      for (let x = 0; x < w; x += 40) {
        ctx.quadraticCurveTo(x + 20, y + 35, x + 40, y)
      }
      ctx.stroke()
    }
  }

  if (pattern === "dots") {
    for (let y = 0; y < h; y += 100) {
      for (let x = 0; x < w; x += 100) {
        ctx.beginPath()
        ctx.arc(x, y, 30, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  if (pattern === "stripes") {
    for (let y = 0; y < h; y += 70) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
  }

  if (pattern === "diagonal") {
    for (let i = -h; i < w; i += 120) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + h, h)
      ctx.stroke()
    }
  }

  if (pattern === "grid") {
    for (let y = 0; y < h; y += 80) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    for (let x = 0; x < w; x += 80) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
  }
}

async function createCustomTexture(text, color, flavourImg, font, pattern) {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext("2d")

  const fillColor = props.packaging === "premium" ? "#d4af37" : color
  ctx.fillStyle = fillColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  if (pattern !== "none") {
    drawPattern(ctx, canvas.width, canvas.height, pattern)
  }

  const logoCanvas = document.createElement("canvas")
  logoCanvas.width = laysLogo.width
  logoCanvas.height = laysLogo.height
  const lctx = logoCanvas.getContext("2d")
  lctx.drawImage(laysLogo, 0, 0)

  const imgData = lctx.getImageData(0, 0, logoCanvas.width, logoCanvas.height)
  const data = imgData.data
  const rgb = hexToRgb(fillColor)

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 20) {
      data[i] = rgb.r
      data[i + 1] = rgb.g
      data[i + 2] = rgb.b
      data[i + 3] = 255
    }
  }

  lctx.putImageData(imgData, 0, 0)

  const logoWidth = canvas.width * 0.45
  const logoHeight = (laysLogo.height / laysLogo.width) * logoWidth
  const logoX = canvas.width / 2 - logoWidth / 2
  const logoY = canvas.height * 0.08
  ctx.drawImage(logoCanvas, logoX, logoY, logoWidth, logoHeight)

  ctx.fillStyle = "black"
  ctx.font = `bold ${canvas.height * 0.055}px ${font}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height * 0.45)

  if (flavourImg) {
    const fw = canvas.width * 0.4
    const fh = (flavourImg.height / flavourImg.width) * fw
    const fx = canvas.width / 2 - fw / 2
    const fy = canvas.height * 0.55
    ctx.drawImage(flavourImg, fx, fy, fw, fh)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.flipY = false
  return texture
}

onMounted(async () => {
  const canvas = canvas3d.value
  const container = viewer.value

  laysLogo = await loadImage(logoSrc)
  let flavourImg = props.flavour ? await loadImage(props.flavour) : null

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf4f4f4)

  createPlatform(scene)

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 40)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambient)

  const key = new THREE.DirectionalLight(0xffffff, 1.1)
  key.position.set(5, 10, 8)
  scene.add(key)

  const fill = new THREE.DirectionalLight(0xffffff, 0.6)
  fill.position.set(-5, 4, 6)
  scene.add(fill)

  const rim = new THREE.DirectionalLight(0xffffff, 0.4)
  rim.position.set(0, 6, -8)
  scene.add(rim)

  const loader = new GLTFLoader()
  loader.load("/models/punga_chips_export.glb", async gltf => {
    model = gltf.scene

    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    model.position.sub(center)
    model.scale.set(0.8, 0.8, 0.8)

    const texture = await createCustomTexture(
      props.name,
      props.color,
      flavourImg,
      props.font,
      props.pattern
    )
    const mat = getMaterialConfig(props.packaging)

    model.traverse(child => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: mat.roughness,
          metalness: mat.metalness
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

  canvas.addEventListener("mouseup", () => (dragging = false))

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
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  })
})

watch(
  () => [
    props.color,
    props.name,
    props.flavour,
    props.font,
    props.packaging,
    props.pattern
  ],
  async () => {
    if (!model) return
    const flavourImg = props.flavour ? await loadImage(props.flavour) : null

    const texture = await createCustomTexture(
      props.name,
      props.color,
      flavourImg,
      props.font,
      props.pattern
    )
    const mat = getMaterialConfig(props.packaging)

    model.traverse(child => {
      if (child.isMesh) {
        child.material.map = texture
        child.material.roughness = mat.roughness
        child.material.metalness = mat.metalness
        child.material.needsUpdate = true
      }
    })
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
