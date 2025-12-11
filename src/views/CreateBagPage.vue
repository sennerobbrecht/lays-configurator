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

        <div
          v-for="(kf, index) in keyFlavours"
          :key="index"
          class="keyflavour-row"
        >
          <input class="text-input" v-model="keyFlavours[index]" @input="nextStep(8)" />
          <button
            class="remove-btn"
            v-if="keyFlavours.length > 1"
            @click="removeKeyFlavour(index)"
          >
            −
          </button>
        </div>

        <button class="add-btn" @click="addKeyFlavour">
          Add Key Flavour
        </button>
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
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import BagPreview from "../components/BagPreview.vue"

const currentStep = ref(1)

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
  const reader = new FileReader()
  reader.onload = () => {
    bagFlavour.value = reader.result
    nextStep(9)
  }
  reader.readAsDataURL(file)
}

async function saveBag() {
  const token = localStorage.getItem("token")
  const userEmail = localStorage.getItem("userEmail")

  if (!token || !userEmail) {
    alert("You must be logged in!")
    return
  }

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
    alert("Bag saved successfully!")
  } catch (err) {
    console.error(err)
    alert("Saving failed")
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

h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 15px;
  font-weight: 600;
}

.color-picker {
  width: 80px;
  height: 35px;
  border: 2px solid #ccc;
  border-radius: 8px;
}

.font-select,
.text-input,
.text-area {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #ccc;
  font-size: 15px;
}

.text-area {
  height: 100px;
  resize: none;
}

.keyflavour-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn,
.remove-btn,
.reset-btn,
.save-btn {
  padding: 10px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 15px;
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
  width: 100%;
}

.save-btn {
  background: #ffcc00;
  color: #333;
  width: 100%;
  font-weight: bold;
  margin-top: 10px;
}
</style>
