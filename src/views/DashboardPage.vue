<template>
  <section class="dashboard">

    <img src="@/assets/lays.png" alt="Lays Logo" class="hero-image" />

    <h1>Welcome to the Lays Configurator</h1>
    <p class="subtitle">
      Create your own custom Lays bag or explore your creations.
    </p>

    <div class="actions">
      <router-link to="/create" class="btn primary">Create New Bag</router-link>
    </div>

  </section>
</template>

<script setup>
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 50px auto;
  text-align: center;
  padding: 0 20px;
}

.hero-image {
  width: 180px;
  margin-bottom: 25px;
  user-select: none;
}

h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  color: #555;
  margin-bottom: 40px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  padding: 14px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
}

.primary {
  background: #ffcc00;
  color: #333;
}

.primary:hover {
  background: #ffda2f;
}
</style>
