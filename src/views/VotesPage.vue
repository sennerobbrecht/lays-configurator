<template>
  <div class="vote-container">

    <h1>Vote For Your Favorite Lays Bag</h1>

    <div class="bag-grid">
      <div v-for="bag in bags" :key="bag._id" class="bag-card">

        <div class="preview-wrapper">
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
        <p class="user">By: {{ bag.user }}</p>

        <button
          class="vote-btn"
          :class="{ remove: votes[bag._id] }"
          @click="toggleVote(bag._id)"
        >
          {{ votes[bag._id] ? "Unvote" : "Vote" }}
        </button>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import BagPreview from "../components/BagPreview.vue"

const bags = ref([])
const votes = ref({})

async function loadBags() {
  const res = await axios.get("https://lays-api-1.onrender.com/api/v1/bag")
  bags.value = res.data
  loadLocalVotes()
}

function loadLocalVotes() {
  const email = localStorage.getItem("userEmail")
  bags.value.forEach(bag => {
    votes.value[bag._id] = localStorage.getItem(`voted_${email}_${bag._id}`) === "true"
  })
}

async function toggleVote(bagId) {
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("userEmail")

  if (!token || !email) {
    alert("You must be logged in to vote.")
    return
  }

  if (!votes.value[bagId]) {
    try {
      await axios.post(
        `https://lays-api-1.onrender.com/api/v1/vote/${bagId}`,
        { user: email, bag: bagId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      votes.value[bagId] = true
      localStorage.setItem(`voted_${email}_${bagId}`, "true")
    } catch {
      alert("Voting failed.")
    }
  } else {
    try {
      await axios.delete(
        `https://lays-api-1.onrender.com/api/v1/vote/${bagId}`,
        {
          data: { user: email, bag: bagId },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      votes.value[bagId] = false
      localStorage.removeItem(`voted_${email}_${bagId}`)
    } catch {
      alert("Unvote failed.")
    }
  }
}

onMounted(loadBags)
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
  overflow: hidden;
}

.preview-wrapper {
  width: 100%;
  height: 380px;
  background: #f4f4f4;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.vote-btn.remove {
  background: #ff4d4d;
  color: white;
}

h2 {
  margin-top: 12px;
}

.user {
  color: #666;
  font-size: 14px;
  margin-top: -5px;
}
</style>
