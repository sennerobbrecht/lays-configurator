<template>
  <section class="dashboard">
    <h1>Your Created Bags</h1>

    <div class="bag-list">
      <div
        v-for="bag in bags"
        :key="bag._id"
        class="bag-card"
      >
        <h2>{{ bag.name }}</h2>
        <p>{{ bag.keyFlavours.join(", ") }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const bags = ref([]);

const loadBags = async () => {
  const res = await fetch("https://lays-api-1.onrender.com/api/v1/bag");
  bags.value = await res.json();
};

onMounted(loadBags);
</script>
