<template>
  <div class="page">
    <nav class="navbar">
      <div class="left">
        <img src="@/assets/lays.png" class="logo" />
        <h1 class="app-title">Lays Creator Hub</h1>
      </div>

      <div class="center">
        <router-link to="/create" class="nav-link">Create</router-link>
        <router-link to="/vote" class="nav-link">Vote</router-link>
        <router-link to="/dashboard" class="nav-link active">My Bags</router-link>
      </div>

      <button class="logout" @click="logout">Logout</button>
    </nav>

    <section class="hero">
      <div class="hero-content">
        <h2>Create. Vote. Enjoy.</h2>
        <p>Your personalized Lays flavor adventure starts here.</p>

        <div class="hero-buttons">
          <router-link to="/create" class="btn yellow">Create a Bag</router-link>
          <router-link to="/vote" class="btn red">Vote Bags</router-link>
        </div>
      </div>

      <img src="@/assets/lays.png" class="hero-img" />
    </section>

    <section class="section">
      <h2>Your Creations</h2>

      <div v-if="loading" class="loading">Loading your bags...</div>

      <div v-else class="bag-grid">
        <div v-for="bag in myBags" :key="bag._id" class="bag-card">
          <img :src="getBagPreview(bag.image)" class="bag-img" />
          <div class="bag-info">
            <h3>{{ bag.name }}</h3>
            <p>Created on {{ formatDate(bag.createdAt) }}</p>
            <router-link :to="`/update/${bag._id}`" class="edit-btn">Edit Bag</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()
const loading = ref(true)
const myBags = ref([])
const email = localStorage.getItem("userEmail")

if (!localStorage.getItem("token")) router.push("/")

onMounted(() => {
  loadBags()
})

async function loadBags() {
  try {
    const res = await axios.get("https://lays-api-1.onrender.com/api/v1/bag")
    myBags.value = res.data.filter(b => b.user === email)
  } finally {
    loading.value = false
  }
}

function getBagPreview(image) {
  return image?.startsWith("data:") ? image : `/uploads/${image}`
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

function logout() {
  localStorage.clear()
  router.push("/")
}
</script>

<style scoped>
.page {
  background: #faf7f2;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
}

.navbar {
  height: 75px;
  padding: 0 50px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #eee3d0;
  position: sticky;
  top: 0;
  z-index: 90;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 48px;
}

.app-title {
  font-size: 22px;
  font-weight: 800;
  color: #c8102e;
}

.center {
  display: flex;
  gap: 30px;
}

.nav-link {
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  color: #444;
  padding-bottom: 4px;
  transition: 0.2s;
}

.nav-link:hover {
  color: #111;
}

.active {
  color: #e61c23;
  border-bottom: 3px solid #e61c23;
}

.logout {
  background: #e61c23;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 8%;
  background: #fff3d1;
  border-bottom: 2px solid #f0e5c5;
}

.hero-content {
  max-width: 500px;
}

.hero-content h2 {
  font-size: 44px;
  font-weight: 900;
  color: #c8102e;
}

.hero-content p {
  font-size: 17px;
  margin-top: 10px;
  color: #444;
}

.hero-buttons {
  margin-top: 25px;
  display: flex;
  gap: 20px;
}

.btn {
  padding: 14px 26px;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: 0.2s;
}

.yellow {
  background: #ffd400;
  color: #222;
}

.yellow:hover {
  background: #ffdf52;
}

.red {
  background: #e61c23;
  color: white;
}

.red:hover {
  background: #ff3d3d;
}

.hero-img {
  width: 50%;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.section {
  padding: 60px 8%;
  text-align: center;
}

.section h2 {
  font-size: 32px;
  font-weight: 900;
}

.loading {
  margin-top: 20px;
  font-size: 18px;
}

.bag-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
}

.bag-card {
  background: white;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: 0.25s;
}

.bag-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.18);
}

.bag-img {
  width: 100%;
  height: 260px;
  object-fit: contain;
  background: #f3f3f3;
  border-radius: 12px;
}

.bag-info {
  margin-top: 14px;
  text-align: left;
}

.bag-info h3 {
  font-size: 18px;
  font-weight: 800;
}

.bag-info p {
  font-size: 14px;
  opacity: 0.7;
}

.edit-btn {
  margin-top: 12px;
  display: inline-block;
  padding: 10px 18px;
  background: #ffd400;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  color: #222;
  transition: 0.2s;
}

.edit-btn:hover {
  background: #ffdf52;
}
</style>
