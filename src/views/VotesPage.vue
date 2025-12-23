<template>
  <div class="vote-container">
    <button class="back-home" @click="$router.push('/dashboard')">
      ← Back to Home
    </button>

    <h1>Vote For Your Favorite Lays Bag</h1>

    <div class="bag-grid">
      <div v-for="bag in bags" :key="bag._id" class="bag-card">
        <div class="preview-wrapper" @click="openPreview(bag)">
          <BagPreview
            :color="bag.bagColor"
            :name="bag.name"
            :flavour="bag.image"
            :font="bag.font"
            :packaging="bag.packaging"
            :pattern="bag.pattern"
          />
        </div>

        <h2>{{ bag.name }}</h2>
        <p class="user">By {{ bag.user }}</p>

        <p class="votes">Votes: {{ voteCounts[bag._id] ?? 0 }}</p>

        <button
          class="vote-btn"
          :class="{ remove: votes[bag._id] }"
          @click="toggleVote(bag._id)"
        >
          {{ votes[bag._id] ? "Unvote" : "Vote" }}
        </button>
      </div>
    </div>

    <div v-if="activeBag" class="overlay" @click.self="activeBag = null">
      <div class="overlay-content">
        <button class="close" @click="activeBag = null">×</button>

        <div class="overlay-preview">
          <BagPreview
            :color="activeBag.bagColor"
            :name="activeBag.name"
            :flavour="activeBag.image"
            :font="activeBag.font"
            :packaging="activeBag.packaging"
            :pattern="activeBag.pattern"
          />
        </div>

        <div class="overlay-info">
          <h2>{{ activeBag.name }}</h2>
          <p class="user">By {{ activeBag.user }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import axios from "axios"
import { io } from "socket.io-client"
import BagPreview from "../components/BagPreview.vue"

const bags = ref([])
const votes = ref({})
const voteCounts = ref({})
const activeBag = ref(null)
const votedBagId = ref(null)

const socket = io("https://lays-api-1.onrender.com")

socket.on("vote-updated", data => {
  voteCounts.value[data.bagId] = data.count
})

async function loadBags() {
  const res = await axios.get("https://lays-api-1.onrender.com/api/v1/bag")
  bags.value = res.data
  loadLocalVote()
  bags.value.forEach(bag => {
    voteCounts.value[bag._id] = bag.votes || 0
  })
}

function loadLocalVote() {
  const email = localStorage.getItem("userEmail")
  const storedBagId = localStorage.getItem(`voted_${email}`)
  votedBagId.value = storedBagId
  bags.value.forEach(bag => {
    votes.value[bag._id] = bag._id === storedBagId
  })
}

function openPreview(bag) {
  activeBag.value = bag
}

async function toggleVote(bagId) {
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("userEmail")

  if (!token || !email) {
    alert("You must be logged in to vote.")
    return
  }

  if (votedBagId.value === bagId) {
    try {
      await axios.delete(
        `https://lays-api-1.onrender.com/api/v1/vote/${bagId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      votes.value[bagId] = false
      votedBagId.value = null
      localStorage.removeItem(`voted_${email}`)
    } catch {
      alert("Unvote failed.")
    }
    return
  }

  if (votedBagId.value) {
    try {
      await axios.delete(
        `https://lays-api-1.onrender.com/api/v1/vote/${votedBagId.value}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      votes.value[votedBagId.value] = false
    } catch {
      return
    }
  }

  try {
    await axios.post(
      `https://lays-api-1.onrender.com/api/v1/vote/${bagId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    votes.value[bagId] = true
    votedBagId.value = bagId
    localStorage.setItem(`voted_${email}`, bagId)
  } catch {
    alert("Voting failed.")
  }
}

onMounted(loadBags)

onUnmounted(() => {
  socket.disconnect()
})
</script>

<style scoped>
.vote-container {
  max-width: 1200px;
  margin: 40px auto;
  text-align: center;
  padding: 20px;
}

.bag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
  margin-top: 30px;
}

.bag-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0px 8px 22px rgba(0,0,0,0.12);
}

.preview-wrapper {
  width: 100%;
  height: 380px;
  background: #f4f4f4;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
}

.vote-btn.remove {
  background: #ff4d4d;
  color: white;
}

.user {
  color: #666;
  font-size: 14px;
  margin-top: -5px;
}

.votes {
  font-weight: bold;
  margin: 6px 0;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.overlay-content {
  background: white;
  border-radius: 24px;
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  max-height: 900px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px;
}

.overlay-preview {
  flex: 1;
  width: 100%;
  background: #f4f4f4;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-info {
  margin-top: 12px;
  text-align: center;
}

.close {
  position: absolute;
  top: 14px;
  right: 18px;
  font-size: 30px;
  border: none;
  background: none;
  cursor: pointer;
}

.back-home {
  position: fixed;
  top: 20px;
  left: 20px;
  background: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  z-index: 1000;
}
</style>
