<template>
  <div class="auth-wrapper">
    <h1>Login</h1>

    <form @submit.prevent="loginUser" class="auth-form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />

      <button type="submit" class="btn-yellow">Login</button>
    </form>

    <p class="link">
      Don’t have an account?
      <router-link to="/register">Register</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const password = ref('')

const loginUser = async () => {
  try {
    const res = await axios.post(
      'https://lays-api-1.onrender.com/api/v1/user/auth',
      {
        email: email.value,
        password: password.value
      }
    )

    const token = res.data.token
    localStorage.setItem('token', token)
    localStorage.setItem('userEmail', email.value)

    alert('Logged in!')
  } catch {
    alert('Login failed')
  }
}
</script>

<style scoped>
.auth-wrapper {
  max-width: 420px;
  margin: 120px auto;
  text-align: center;
}
.auth-form input {
  width: 100%;
  margin: 8px 0;
  padding: 12px;
}
.btn-yellow {
  background: #ffcc00;
  padding: 12px;
  width: 100%;
  font-weight: bold;
  cursor: pointer;
  border: none;
  border-radius: 6px;
}
</style>
