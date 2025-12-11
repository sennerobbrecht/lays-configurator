<template>
  <div class="vote-container">

    <h1>Vote For Your Favorite Lays Bag</h1>

    <div v-if="bags.length === 0" class="empty">Loading bags...</div>

    <div class="bag-grid">
      <div v-for="bag in bags" :key="bag._id" class="bag-card">

        <div class="image-wrapper">
          <img
            v-if="bag.image"
            :src="bag.image"
            class="bag-img"
          />
        </div>

        <h2>{{ bag.name }}</h2>
        <p class="user">By: {{ bag.user }}</p>

        <button class="vote-btn" @click="vote(bag._id)">
          Vote
        </button>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const bags = ref([])

async function loadBags() {
  try {
    const res = await axios.get("https://lays-api-1.onrender.com/api/v1/bag")
    bags.value = res.data
  } catch (err) {
    console.error("Failed to load bags:", err)
  }
}

async function vote(bagId) {
  const token = localStorage.getItem("token")
  const userEmail = localStorage.getItem("userEmail")

  if (!token || !userEmail) {
    alert("You must be logged in to vote.")
    return
  }

  try {
    await axios.post(
      `https://lays-api-1.onrender.com/api/v1/vote/${bagId}`,
      {
        user: userEmail,
        bag: bagId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    alert("Vote submitted!")

  } catch (err) {
    console.error(err)
    alert("Voting failed.")
  }
}

onMounted(loadBags)
</script>

<style scoped>
.vote-container {
  max-width: 1100px;
  margin: 40px auto;
  text-align: center;
  padding: 20px;
}

.bag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.bag-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0px 8px 22px rgba(0,0,0,0.12);
  transition: transform 0.2s ease;
}

.bag-card:hover {
  transform: translateY(-6px);
}

.image-wrapper {
  width: 100%;
  height: 260px;
  background: #f4f4f4;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bag-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vote-btn {
  margin-top: 12px;
  background: #ffcc00;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.vote-btn:hover {
  background: #ffd633;
}

.user {
  color: #666;
  font-size: 14px;
  margin-top: 5px;
}
</style>
