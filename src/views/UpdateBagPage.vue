<template>
  <div class="layout">
    <div class="preview">
      <BagPreview
        v-if="loaded"
        :color="bag.bagColor"
        :name="bag.name"
        :flavour="bag.image"
        :font="bag.font"
        :packaging="bag.packaging"
        :pattern="bag.pattern"
      />
    </div>

    <div class="panel" v-if="loaded">

      <h1>Edit Bag</h1>

      <div class="form">

        <div class="form-group">
          <label>Bag Name</label>
          <input v-model="bag.name" class="input" />
        </div>

        <div class="form-group">
          <label>Bag Color</label>
          <input type="color" v-model="bag.bagColor" class="color-input" />
        </div>

        <div class="form-group">
          <label>Font</label>
          <select v-model="bag.font" class="input">
            <option>Arial</option>
            <option>Verdana</option>
            <option>Georgia</option>
            <option>Courier New</option>
            <option>Impact</option>
          </select>
        </div>

        <div class="form-row">
          <div>
            <label>Packaging</label>
            <select v-model="bag.packaging" class="input">
              <option>normal</option>
              <option>matte</option>
              <option>glossy</option>
              <option>eco</option>
              <option>paper</option>
              <option>premium</option>
            </select>
          </div>

          <div>
            <label>Pattern</label>
            <select v-model="bag.pattern" class="input">
              <option>none</option>
              <option>waves</option>
              <option>dots</option>
              <option>stripes</option>
              <option>diagonal</option>
              <option>grid</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Inspiration</label>
          <textarea v-model="bag.inspiration" class="textarea"></textarea>
        </div>

        <div class="form-group">
          <label>Key Flavours</label>

          <div
            class="flavour-row"
            v-for="(f, i) in bag.keyFlavours"
            :key="i"
          >
            <input v-model="bag.keyFlavours[i]" class="input" />
            <button class="btn-red" @click="removeFlavour(i)">✕</button>
          </div>

          <button class="btn-green" @click="addFlavour">
            + Add Flavour
          </button>
        </div>

        <div class="form-group">
          <label>Flavour Image</label>
          <input type="file" accept="image/*" @change="uploadImage" />
        </div>

        <button class="btn-save" @click="saveBag">
          Save Changes
        </button>

        <router-link class="btn-back" to="/dashboard">
          Back to Dashboard
        </router-link>

      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
import BagPreview from "../components/BagPreview.vue"

const route = useRoute()
const router = useRouter()

const bag = ref({})
const loaded = ref(false)

onMounted(() => loadBag())

async function loadBag() {
  try {
    const res = await axios.get(
      `https://lays-api-1.onrender.com/api/v1/bag/${route.params.id}`
    )

    bag.value = res.data
    loaded.value = true
  } catch {
    router.push("/dashboard")
  }
}

function uploadImage(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    bag.value.image = reader.result
  }
  reader.readAsDataURL(file)
}

function addFlavour() {
  bag.value.keyFlavours.push("")
}

function removeFlavour(i) {
  bag.value.keyFlavours.splice(i, 1)
}

async function saveBag() {
  const token = localStorage.getItem("token")

  try {
    await axios.put(
      `https://lays-api-1.onrender.com/api/v1/bag/${route.params.id}`,
      bag.value,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    alert("Bag updated!")
  } catch {
    alert("Failed to save")
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background: #f7f7f7;
}

.preview {
  flex: 1;
  background: #ececec;
  display: flex;
  justify-content: center;
  align-items: center;
}

.panel {
  width: 420px;
  background: white;
  padding: 35px;
  overflow-y: auto;
  border-left: 1px solid #ccc;
}

h1 {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 25px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.input,
.textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 2px solid #ddd;
  font-size: 15px;
}

.textarea {
  resize: none;
  height: 90px;
}

.color-input {
  width: 80px;
  height: 40px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.flavour-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-green {
  background: #4caf50;
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn-red {
  background: #e53935;
  border: none;
  color: white;
  padding: 6px 10px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save {
  background: #ffcc00;
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
}

.btn-back {
  display: block;
  width: 100%;
  text-align: center;
  padding: 12px;
  margin-top: 10px;
  border-radius: 8px;
  background: #ddd;
  color: #333;
  text-decoration: none;
  font-weight: bold;
}
</style>
