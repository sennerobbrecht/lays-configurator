<template>
  <div class="layout">
    <div class="preview">
      <BagPreview
        :color="bagColor"
        :name="bagName"
        :flavour="bagFlavour"
        :font="bagFont"
        :packaging="bagPackaging"
        :inspiration="inspiration"
        :keyFlavours="keyFlavours"
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
        <input class="text-input" type="text" v-model="bagName" />
      </div>

      <div class="divider"></div>

      <div class="form-group">
        <label>Select Font</label>
        <select v-model="bagFont" class="font-select">
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Impact">Impact</option>
        </select>
      </div>

      <div class="divider"></div>

      <div class="form-group">
        <label>Select Packaging Type</label>
        <select v-model="bagPackaging" class="font-select">
          <option value="normal">Normal</option>
          <option value="matte">Matte</option>
          <option value="glossy">Glossy</option>
          <option value="eco">Eco</option>
          <option value="premium">Premium Gold</option>
        </select>
      </div>

      <div class="divider"></div>

      <div class="form-group">
        <label>Select Flavour Image</label>
        <input type="file" accept="image/*" @change="onFlavourUpload" />
      </div>

      <div class="divider"></div>

      <div class="form-group">
        <label>Inspiration</label>
        <textarea class="text-area" v-model="inspiration"></textarea>
      </div>

      <div class="divider"></div>

      <div class="form-group">
        <label>Key Flavours</label>
        <div v-for="(flavour, index) in keyFlavours" :key="index" class="keyflavour-row">
          <input class="text-input" v-model="keyFlavours[index]" />
          <button class="remove-btn" @click="removeKeyFlavour(index)" v-if="keyFlavours.length > 1">−</button>
        </div>
        <button class="add-btn" @click="addKeyFlavour">Add Key Flavour</button>
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
const bagFont = ref("Arial")
const bagPackaging = ref("normal")
const inspiration = ref("")
const keyFlavours = ref([""])

function addKeyFlavour() {
  keyFlavours.value.push("")
}

function removeKeyFlavour(index) {
  keyFlavours.value.splice(index, 1)
}

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
  border: 2px solid #ccc;
  border-radius: 8px;
}
.font-select {
  width: 200px;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #ccc;
  font-size: 16px;
}
.divider {
  width: 100%;
  height: 1px;
  background: #ddd;
}
.text-input {
  padding: 10px 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  width: 250px;
}
.text-area {
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  width: 350px;
  height: 120px;
  resize: none;
}
.keyflavour-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.add-btn,
.remove-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
.add-btn {
  background: #4caf50;
  color: white;
}
.remove-btn {
  background: #e53935;
  color: white;
}
</style>
