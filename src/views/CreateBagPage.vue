<template>
  <section class="create">
    <h1>Create Your Custom Lays Bag</h1>

    <form @submit.prevent="submitForm">

      <label>Name</label>
      <input v-model="form.name" required />

      <label>Bag Color</label>
      <input type="color" v-model="form.bagColor" />

      <label>Font</label>
      <select v-model="form.font">
        <option>Arial</option>
        <option>Verdana</option>
        <option>Roboto</option>
      </select>

      <label>Pattern</label>
      <select v-model="form.pattern">
        <option>stripes</option>
        <option>waves</option>
        <option>dots</option>
      </select>

      <label>Packaging</label>
      <select v-model="form.packaging">
        <option>plastic</option>
        <option>paper</option>
      </select>

      <label>Key Flavours</label>
      <div class="flavour-input">
        <input
          v-model="flavourInput"
          placeholder="Add flavour and press Enter"
          @keyup.enter="addFlavour"
        />
        <div class="tags">
          <span
            v-for="f in form.keyFlavours"
            :key="f"
            class="tag"
          >
            {{ f }}
          </span>
        </div>
      </div>

      <label>Your Email</label>
      <input type="email" v-model="form.user" required />

      <button type="submit">Save Bag</button>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";

const API_URL = "https://lays-api-1.onrender.com/api/v1/bag";

const form = ref({
  name: "",
  bagColor: "#ffcc00",
  font: "Arial",
  pattern: "stripes",
  packaging: "plastic",
  inspiration: "",
  keyFlavours: [],
  image: "placeholder.png",
  user: ""
});

const flavourInput = ref("");

const addFlavour = () => {
  if (flavourInput.value.trim() !== "") {
    form.value.keyFlavours.push(flavourInput.value.trim());
    flavourInput.value = "";
  }
};

const submitForm = async () => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form.value)
  });

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  window.location.href = "/success";
};
</script>

<style scoped>
.create {
  max-width: 700px;
  margin: 40px auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tag {
  background: #ffcc00;
  padding: 4px 8px;
  border-radius: 6px;
  margin-right: 5px;
}
</style>
