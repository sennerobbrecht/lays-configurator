<template>
  <div class="auth-wrapper">
    <h1 class="title">Login</h1>

    <form @submit.prevent="loginUser" class="auth-form">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />

      <button type="submit" class="btn-yellow">
        Login
      </button>

      <div v-if="errorMessage" class="error-box">
        {{ errorMessage }}
      </div>
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
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const loginUser = async () => {
  errorMessage.value = ''

  try {
    const res = await axios.post(
      'https://lays-api-1.onrender.com/api/v1/user/login',
      {
        email: email.value,
        password: password.value
      }
    )

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('userEmail', email.value)

    router.push('/dashboard')
  } catch (err) {
    errorMessage.value =
    err.response?.data?.error || 'Incorrect email or password'
  }
}
</script>

<style scoped>
.auth-wrapper {
  max-width: 520px;
  margin: 140px auto;
  padding: 40px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  text-align: center;
}

.title {
  font-size: 42px;
  font-weight: 900;
  margin-bottom: 30px;
}

.auth-form input {
  width: 100%;
  margin: 14px 0;
  padding: 16px 18px;
  font-size: 18px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.auth-form input:focus {
  outline: none;
  border-color: #ffcc00;
}

.btn-yellow {
  margin-top: 20px;
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 800;
  background: #ffcc00;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.btn-yellow:hover {
  background: #ffdb4d;
}

.error-box {
  margin-top: 16px;
  padding: 14px;
  background: #ffe5e5;
  color: #b30000;
  border-radius: 10px;
  font-weight: 600;
}

.link {
  margin-top: 22px;
  font-size: 16px;
}
</style>
