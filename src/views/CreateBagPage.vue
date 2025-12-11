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

      <div v-if="currentStep >= 8">
        <button class="reset-btn" @click="resetDesign">Reset Design</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
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
.layout { display: flex; width: 100%; height: 100vh; overflow: hidden; }
.preview { width: 50%; background: #e8e8e8; }
.config { width: 50%; padding: 50px 40px; background: #fff; display: flex; flex-direction: column; gap: 30px; overflow-y: auto; }
.config h1 { font-size: 28px; font-weight: 700; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
label { font-size: 16px; font-weight: 600; }
.color-picker { width: 90px; height: 40px; border: 2px solid #ccc; border-radius: 8px; }
.font-select { width: 200px; padding: 10px; border-radius: 8px; border: 2px solid #ccc; font-size: 16px; }
.text-input { padding: 10px 12px; font-size: 16px; border: 2px solid #ccc; border-radius: 8px; width: 250px; }
.text-area { padding: 12px; font-size: 16px; border: 2px solid #ccc; border-radius: 8px; width: 350px; height: 120px; resize: none; }
.keyflavour-row { display: flex; align-items: center; gap: 10px; }
.add-btn, .remove-btn, .reset-btn { padding: 10px 18px; border-radius: 6px; border: none; cursor: pointer; font-size: 16px; }
.add-btn { background: #4caf50; color: white; width: fit-content; }
.remove-btn { background: #e53935; color: white; }
.reset-btn { background: #1976d2; color: white; width: fit-content; margin-top: 20px; }
</style>
