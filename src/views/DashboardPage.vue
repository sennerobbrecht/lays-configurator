<template>
  <section class="dashboard">

    <div class="hero-wrapper">
      <img src="@/assets/lays.png" alt="Lays" class="hero-image" />
    </div>

    <h1>Welcome to the Lays Configurator</h1>
    <p class="subtitle">Create your own custom Lays bag or review your creations.</p>

    <router-link to="/create" class="btn primary">Create New Bag</router-link>

    <button class="logout" @click="logout">Logout</button>

    <!-- USER BAGS -->
    <h2 class="section-title">Your Creations</h2>

    <div v-if="loading" class="loading">Loading bags...</div>

    <div v-else class="bag-grid">

      <div
        v-for="bag in myBags"
        :key="bag._id"
        class="bag-card"
      >
        <img
          class="bag-image"
          :src="getBagPreview(bag.image)"
          alt="Bag Preview"
        />

        <h3 class="bag-name">{{ bag.name }}</h3>
        <p class="bag-user">Created on {{ formatDate(bag.createdAt) }}</p>

        <router-link :to="`/update/${bag._id}`" class="view-btn">
          UpdateBag
        </router-link>
      </div>

    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

if (!localStorage.getItem("token")) {
  router.push("/login")
}

const loading = ref(true)
const myBags = ref([])

const email = localStorage.getItem("userEmail")


onMounted(() => {
  loadBags()
})

async function loadBags() {
  try {
    const res = await axios.get("https://lays-api-1.onrender.com/api/v1/bag")
    myBags.value = res.data.filter(b => b.user === email)
  } catch (e) {
    console.error("Failed to load bags", e)
  } finally {
    loading.value = false
  }
}

function getBagPreview(image) {
  if (!image) return "/placeholder.png"
  return image.startsWith("data:") ? image : `/uploads/${image}`
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

const logout = () => {
  localStorage.clear()
  router.push("/login")
}
</script>

<style scoped>
.dashboard {
  max-width: 1100px;
  margin: 80px auto;
  text-align: center;
  padding: 0 20px;
}

.section-title {
  margin-top: 45px;
  font-size: 24px;
  font-weight: 700;
}

.loading {
  margin-top: 20px;
  font-size: 18px;
  font-style: italic;
}

.bag-grid {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 28px;
}

.bag-card {
  background: white;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  transition: 0.25s;
}

.bag-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(0,0,0,0.18);
}

.bag-image {
  width: 100%;
  height: 260px;
  object-fit: contain;
  background: #f3f3f3;
  border-radius: 10px;
}

.bag-name {
  margin-top: 14px;
  font-size: 20px;
  font-weight: 700;
}

.bag-user {
  margin: 4px 0 12px 0;
  font-size: 14px;
  opacity: 0.7;
}

.view-btn {
  display: inline-block;
  padding: 10px 16px;
  background: #ffcc00;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-weight: bold;
  transition: 0.2s;
}

.view-btn:hover {
  background: #ffdb4d;
  transform: translateY(-2px);
}

.primary {
  background: #ffcc00;
  padding: 16px 32px;
  border-radius: 12px;
  color: #333;
  font-weight: 700;
  font-size: 18px;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 20px;
}

.logout {
  margin-top: 20px;
  background: #e74c3c;
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
</style>
