<template>
  <div class="layout">
    <div class="preview">
      <BagPreview :color="bagColor" />
    </div>

    <div class="config">
      <h1>Create Your Custom Lays Bag</h1>

      <div class="form-group">
        <label>Choose Bag Color</label>
        <input class="color-picker" type="color" v-model="bagColor" />
      </div>

      <div class="divider"></div>

      <button class="next-button">Next Step</button>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue"
import BagPreview from "../components/BagPreview.vue"

const bagColor = ref("#ffffff")
</script>

<style scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.preview {
  width: 50%;
  background: #e8e8e8;
}

.config {
  width: 50%;
  padding: 50px 40px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.config h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 16px;
  font-weight: 600;
}

.color-picker {
  width: 90px;
  height: 40px;
  padding: 0;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
}

.divider {
  width: 100%;
  height: 1px;
  background: #ddd;
  margin: 10px 0;
}

.next-button {
  width: 160px;
  padding: 12px;
  border: none;
  background: #ffcc00;
  font-size: 16px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.next-button:hover {
  background: #f2c200;
}
</style>
