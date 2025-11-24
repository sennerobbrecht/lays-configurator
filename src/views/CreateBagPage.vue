<template>
  <div class="layout">
    <div class="preview">
      <BagPreview />
    </div>

    <div class="config">
      <h2>Configure Your Bag</h2>
      <p>Select options here…</p>
    </div>
  </div>
</template>

<script setup>
import BagPreview from "../components/BagPreview.vue"
</script>

<style scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

.preview {
  width: 50%;
  height: 100%;
  background: #f0f0f0;
}

.config {
  width: 50%;
  height: 100%;
  background: #ffffff;
  padding: 40px;
  overflow-y: auto;
}
</style>
