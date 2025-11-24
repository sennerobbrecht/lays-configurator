<template>
 <div class="layout">

  <div class="viewer-wrapper">
    <canvas ref="canvas3d" class="three-canvas"></canvas>
  </div>

  <div class="config-panel">
    <h2>Configure Your Bag</h2>


    <p>Select options here…</p>
  </div>
</div>

</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const canvas3d = ref(null);
let model = null;


onMounted(() => {
  const canvas = canvas3d.value;


  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);


const viewer = document.querySelector(".viewer-wrapper");

const camera = new THREE.PerspectiveCamera(
  75,
  viewer.clientWidth / viewer.clientHeight,
  0.1,
  1000
);

  camera.position.set(0, 0, 40);
camera.lookAt(0, 0, 0);



  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);



  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);


  const loader = new GLTFLoader();
  loader.load(
    "/models/punga_chips_export.glb",
    (gltf) => {
   model = gltf.scene;



const box = new THREE.Box3().setFromObject(model);
const center = box.getCenter(new THREE.Vector3());


model.position.x += (model.position.x - center.x);
model.position.y += (model.position.y - center.y);
model.position.z += (model.position.z - center.z);


model.scale.set(0.8, 0.8, 0.8);

scene.add(model);
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging && model) {
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;


    model.rotation.y += deltaX * 0.01;


    model.rotation.x += deltaY * 0.01;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
});

model.traverse((child) => {
  if (child.isMesh) {
    child.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.0
    });
  }
});


    },
    undefined,
    (error) => {
      console.error("3D model load error:", error);
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();


  window.addEventListener("resize", () => {
   camera.aspect = viewer.clientWidth / viewer.clientHeight;
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
camera.updateProjectionMatrix();

  });
});
</script>

<style scoped>
.viewer-wrapper {
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.three-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

.viewer-wrapper {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
}

.config-panel {
  width: 50%;
  height: 100%;
  padding: 30px;
  background: #ffffff;
  overflow-y: auto;
  box-shadow: -2px 0 8px rgba(0,0,0,0.05);
}

.three-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

</style>
