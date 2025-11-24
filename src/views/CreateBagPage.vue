<template>
  <div class="viewer-wrapper">

    <canvas ref="canvas3d" class="three-canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const canvas3d = ref(null);

onMounted(() => {
  const canvas = canvas3d.value;


  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);


  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 30);


  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight * 0.9);


  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);


  const loader = new GLTFLoader();
  loader.load(
    "/models/punga_chips_export.glb",
    (gltf) => {
    const model = gltf.scene;

// Afmetingen berekenen
const box = new THREE.Box3().setFromObject(model);
const center = box.getCenter(new THREE.Vector3());

// Model centreren op (0,0,0)
model.position.x += (model.position.x - center.x);
model.position.y += (model.position.y - center.y);
model.position.z += (model.position.z - center.z);

// Schaal
model.scale.set(0.8, 0.8, 0.8);

scene.add(model);

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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.9);
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
</style>
