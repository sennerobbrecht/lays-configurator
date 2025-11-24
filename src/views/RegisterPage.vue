<template>
  <div class="auth-wrapper">
    <h1>Create Account</h1>

    <form @submit.prevent="registerUser" class="auth-form">
      <input v-model="firstName" placeholder="First name" required />
      <input v-model="lastName" placeholder="Last name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />

      <button type="submit" class="btn-yellow">Register</button>
    </form>

    <p class="link">
      Already have an account?
      <router-link to="/">Login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// Form fields
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");

const registerUser = async () => {
  try {
    const res = await axios.post(
      "https://lays-api-1.onrender.com/api/v1/user/register",
      {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("REGISTER SUCCESS:", res.data);

    alert("Account created successfully! 🎉");

    // Redirect to login page
    router.push("/login");
  } catch (error) {
    console.error("REGISTER ERROR:", error.response || error);

    const msg =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Unknown error";

    alert("Registration failed: " + msg);
  }
};
</script>

<style scoped>
.auth-wrapper {
  max-width: 420px;
  margin: 120px auto;
  text-align: center;
  padding: 20px;
}

.auth-form input {
  width: 100%;
  margin: 8px 0;
  padding: 12px;
  font-size: 16px;
}

.btn-yellow {
  background: #ffcc00;
  padding: 12px;
  width: 100%;
  font-weight: bold;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  margin-top: 10px;
  font-size: 16px;
}

.link {
  margin-top: 12px;
  font-size: 15px;
}
</style>
