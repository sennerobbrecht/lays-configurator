<template>
  <router-view />
</template>

<script setup>
import axios from "axios";
import { onMounted } from "vue";

+
onMounted(() => {
  axios
    .get("https://lays-api-1.onrender.com/api/v1/user/ping", {
      timeout: 60000,
    })
    .then(() => console.log("Backend warmed up ✔️"))
    .catch(() => console.log("Backend waking up... ⏳"));
});
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
