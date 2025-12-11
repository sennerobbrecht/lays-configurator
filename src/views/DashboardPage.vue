<template>
  <section class="dashboard">

    <div class="hero-wrapper">
      <img src="@/assets/lays.png" alt="Lays" class="hero-image" />
    </div>

    <h1>Welcome to the Lays Configurator</h1>

    <p class="subtitle">
      Create your own custom Lays bag or explore new flavour combinations.
    </p>

    <router-link to="/create" class="btn primary">
      Create New Bag
    </router-link>

    <!-- Simple Logout Button -->
    <button class="logout" @click="logout">
      Logout
    </button>

  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Redirect als niet ingelogd
if (!localStorage.getItem('token')) {
  router.push('/login')
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 80px auto;
  text-align: center;
  padding: 0 20px;
}

.hero-wrapper {
  width: 350px;
  height: 180px;
  background: #ffcc00;
  border-radius: 16px;
  margin: 0 auto 40px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
  border: 3px solid #f2b900;
}

.hero-image {
  width: 260px;
  user-select: none;
}

.primary {
  background: #ffcc00;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  color: #333;
  font-weight: 700;
  font-size: 18px;
  transition: 0.25s;
  display: inline-block;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
}

.primary:hover {
  background: #ffd633;
  transform: translateY(-2px);
}

.logout {
  margin-top: 25px;
  background: #e74c3c;
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: 0.25s;
}

.logout:hover {
  background: #ff5e4d;
  transform: translateY(-2px);
}
</style>
