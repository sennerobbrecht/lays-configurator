<template>
  <div class="layout">
    <div class="preview">
      <BagPreview
        :color="bagColor"
        :name="bagName"
        :flavour="bagFlavour"
      />
    </div>

    <div class="config">
      <h1>Create Your Custom Lays Bag</h1>

      <div class="form-group">
        <label>Choose Bag Color</label>
        <input class="color-picker" type="color" v-model="bagColor" />
      </div>

      <div class="divider"></div>

      <div class="form-group">
        <label>Print Name on Bag</label>
        <input class="text-input" type="text" v-model="bagName" placeholder="Type your name..." />
      </div>

      <div class="divider"></div>

      <div class="form-group">
        <label>Select Flavour Image</label>
        <input type="file" accept="image/*" @change="onFlavourUpload" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import BagPreview from "../components/BagPreview.vue"

const bagColor = ref("#ffffff")
const bagName = ref("")
const bagFlavour = ref("")

function onFlavourUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    bagFlavour.value = reader.result
  }
  reader.readAsDataURL(file)
}
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

.text-input {
  padding: 10px 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  outline: none;
  width: 250px;
}
.text-input:focus {
  border-color: #ffcc00;
}
</style>
