<template>
  <div class="layout">
    <div class="preview">
      <BagPreview
        :color="bagColor"
        :name="bagName"
        :flavour="bagFlavour"
        :font="bagFont"
        :packaging="bagPackaging"
        :pattern="bagPattern"
        :inspiration="inspiration"
        :keyFlavours="keyFlavours"
      />
    </div>

    <div class="config">
      <h1>Create Your Custom Lays Bag</h1>

      <div v-if="currentStep >= 1" class="form-group">
        <label>Step 1 — Choose Bag Color</label>
        <input class="color-picker" type="color" v-model="bagColor" @input="nextStep(2)" />
      </div>

      <div v-if="currentStep >= 2" class="form-group">
        <label>Step 2 — Print Name on Bag</label>
        <input class="text-input" type="text" v-model="bagName" @input="nextStep(3)" />
      </div>

      <div v-if="currentStep >= 3" class="form-group">
        <label>Step 3 — Select Font</label>
        <select v-model="bagFont" class="font-select" @change="nextStep(4)">
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Impact">Impact</option>
        </select>
      </div>

      <div v-if="currentStep >= 4" class="form-group">
        <label>Step 4 — Select Packaging Type</label>
        <select v-model="bagPackaging" class="font-select" @change="nextStep(5)">
          <option value="normal">Normal</option>
          <option value="matte">Matte</option>
          <option value="glossy">Glossy</option>
          <option value="eco">Eco</option>
          <option value="paper">Paper</option>
          <option value="premium">Premium Gold</option>
        </select>
      </div>

      <div v-if="currentStep >= 5" class="form-group">
        <label>Step 5 — Select Pattern</label>
        <select v-model="bagPattern" class="font-select" @change="nextStep(6)">
          <option value="none">None</option>
          <option value="waves">Waves</option>
          <option value="dots">Dots</option>
          <option value="stripes">Stripes</option>
          <option value="diagonal">Diagonal</option>
          <option value="grid">Grid</option>
        </select>
      </div>

      <div v-if="currentStep >= 6" class="form-group">
        <label>Step 6 — Inspiration</label>
        <textarea class="text-area" v-model="inspiration" @input="nextStep(7)"></textarea>
      </div>

      <div v-if="currentStep >= 7" class="form-group">
        <label>Step 7 — Key Flavours</label>

        <div v-for="(kf, index) in keyFlavours" :key="index" class="keyflavour-row">
          <input class="text-input" v-model="keyFlavours[index]" @input="nextStep(8)" />
          <button
            class="remove-btn"
            v-if="keyFlavours.length > 1"
            @click="removeKeyFlavour(index)"
          >
            −
          </button>
        </div>

        <button class="add-btn" @click="addKeyFlavour">Add Key Flavour</button>
      </div>

      <div v-if="currentStep >= 8" class="form-group">
        <label>Step 8 — Select Flavour Image</label>
        <input type="file" accept="image/*" @change="onFlavourUpload" />
      </div>

      <button v-if="currentStep >= 8" class="save-btn" @click="saveBag">
        Save My Bag
      </button>

      <button v-if="currentStep >= 8" class="reset-btn" @click="resetDesign">
        Reset Design
      </button>
    </div>

    <div v-if="showSuccess" class="modal-overlay">
      <div class="modal">
        <button class="close" @click="closeModal">×</button>
        <h2>Bag saved successfully!</h2>
        <router-link to="/dashboard" class="dashboard-btn">
          Return to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import BagPreview from "../components/BagPreview.vue"

const currentStep = ref(1)
const showSuccess = ref(false)

const bagColor = ref("#ffffff")
const bagName = ref("")
const bagFlavour = ref("")
const bagFont = ref("Arial")
const bagPackaging = ref("normal")
const bagPattern = ref("none")
const inspiration = ref("")
const keyFlavours = ref([""])

function nextStep(step) {
  if (currentStep.value < step) currentStep.value = step
}

function addKeyFlavour() {
  keyFlavours.value.push("")
}

function removeKeyFlavour(index) {
  keyFlavours.value.splice(index, 1)
}

function onFlavourUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  const img = new Image()
  const reader = new FileReader()

  reader.onload = () => {
    img.src = reader.result
  }

  img.onload = () => {
    const size = 512
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    const scale = Math.min(size / img.width, size / img.height)
    const w = img.width * scale
    const h = img.height * scale
    const x = (size - w) / 2
    const y = (size - h) / 2

    ctx.drawImage(img, x, y, w, h)

    bagFlavour.value = canvas.toDataURL("image/jpeg", 0.7)
    nextStep(9)
  }

  reader.readAsDataURL(file)
}

async function saveBag() {
  const token = localStorage.getItem("token")
  const userEmail = localStorage.getItem("userEmail")

  if (!token || !userEmail) return

  const body = {
    name: bagName.value,
    image: bagFlavour.value,
    bagColor: bagColor.value,
    font: bagFont.value,
    pattern: bagPattern.value,
    packaging: bagPackaging.value,
    inspiration: inspiration.value,
    keyFlavours: keyFlavours.value,
    user: userEmail
  }

  try {
    await axios.post(
      "https://lays-api-1.onrender.com/api/v1/bag",
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    showSuccess.value = true
  } catch (error) {
    console.error(error)
    alert("Error saving bag. Please try again.")
  }
}

function resetDesign() {
  currentStep.value = 1
  bagColor.value = "#ffffff"
  bagName.value = ""
  bagFlavour.value = ""
  bagFont.value = "Arial"
  bagPackaging.value = "normal"
  bagPattern.value = "none"
  inspiration.value = ""
  keyFlavours.value = [""]
}

function closeModal() {
  showSuccess.value = false
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
  flex: 1;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.config {
  width: 380px;
  padding: 40px 30px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 25px;
  overflow-y: auto;
  border-left: 1px solid #ddd;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.color-picker {
  width: 80px;
  height: 35px;
  border-radius: 8px;
}

.font-select,
.text-input,
.text-area {
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #ccc;
}

.text-area {
  height: 100px;
}

.keyflavour-row {
  display: flex;
  gap: 8px;
}

.add-btn,
.remove-btn,
.reset-btn,
.save-btn {
  padding: 10px;
  border-radius: 6px;
  border: none;
}

.add-btn {
  background: #4caf50;
  color: white;
}

.remove-btn {
  background: #e53935;
  color: white;
}

.reset-btn {
  background: #1976d2;
  color: white;
}

.save-btn {
  background: #ffcc00;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  position: relative;
  width: 320px;
}

.close {
  position: absolute;
  top: 10px;
  right: 14px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.dashboard-btn {
  margin-top: 20px;
  display: inline-block;
  padding: 12px 20px;
  background: #ffd400;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  color: #222;
}
</style>
