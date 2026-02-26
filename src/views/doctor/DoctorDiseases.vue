<template>
  <div class="page">

    <nav class="navbar">
      <router-link to="/doctor/dashboard" class="nav-link">Dashboard</router-link>
      <router-link to="/doctor/patients" class="nav-link">Patients</router-link>
      <router-link to="/doctor/bookings" class="nav-link">Bookings</router-link>
      <router-link to="/doctor/diseases" class="nav-link">Diseases</router-link>
      <router-link to="/doctor/medications" class="nav-link">Medications</router-link>
      <router-link to="/doctor/treatments" class="nav-link">Treatments</router-link>
    </nav>

    <section class="hero">
      <h1>Disease Management</h1>
      <p>Create, search, view and delete diseases (UI only).</p>
    </section>

    <section class="card">

      <!-- Create -->
      <h2 class="section-title">Create Disease</h2>
      <form @submit.prevent="addDisease">

        <div class="form-group">
          <label>Disease Name</label>
          <input v-model="newName" type="text" required />
        </div>

        <div class="form-group">
          <label>Description</label>
          <input v-model="newDescription" type="text" />
        </div>

        <button type="submit">Add Disease</button>
      </form>

      <hr />

      <!-- Search -->
      <h2 class="section-title">Search</h2>
      <input v-model="search" placeholder="Search disease..." />

      <!-- Table -->
      <h2 class="section-title">Diseases</h2>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="d in filteredDiseases" :key="d.id">
          <td>{{ d.name }}</td>
          <td>{{ d.description }}</td>
          <td>
            <button class="link-btn" @click="viewDisease(d)">View</button>
            |
            <button class="danger-btn" @click="deleteDisease(d.id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- View -->
      <div v-if="selected" class="details">
        <h3>Disease Details</h3>
        <p><strong>Name:</strong> {{ selected.name }}</p>
        <p><strong>Description:</strong> {{ selected.description || '-' }}</p>

        <button class="secondary" @click="selected = null">Close</button>
      </div>

    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Disease {
  id: number
  name: string
  description: string
}

const diseases = ref<Disease[]>([
  { id: 1, name: 'Hypertension', description: 'High blood pressure' },
  { id: 2, name: 'Diabetes', description: 'Chronic metabolic disease' }
])

const newName = ref('')
const newDescription = ref('')
const search = ref('')
const selected = ref<Disease | null>(null)

function addDisease() {
  if (!newName.value) return

  diseases.value.unshift({
    id: Date.now(),
    name: newName.value,
    description: newDescription.value
  })

  newName.value = ''
  newDescription.value = ''
}

function deleteDisease(id: number) {
  diseases.value = diseases.value.filter(d => d.id !== id)
  if (selected.value?.id === id) selected.value = null
}

function viewDisease(d: Disease) {
  selected.value = d
}

const filteredDiseases = computed(() =>
  diseases.value.filter(d =>
    d.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script>

<style scoped>
.page {
  font-family: Arial, sans-serif;
  background: white;
  min-height: 100vh;
}

.navbar {
  padding: 15px 40px;
  border-bottom: 1px solid #eee;
}

.nav-link {
  margin-right: 20px;
  text-decoration: none;
  color: #1976d2;
  font-weight: 500;
}

.hero {
  text-align: center;
  padding: 60px 20px 30px;
}

.hero h1 {
  color: #1976d2;
}

.card {
  max-width: 800px;
  margin: 20px auto 40px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.section-title {
  color: #1976d2;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 12px;
}

input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

button {
  padding: 8px 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.link-btn {
  background: transparent;
  color: #1976d2;
  border: none;
}

.danger-btn {
  background: transparent;
  color: #c62828;
  border: none;
}

.details {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}
</style>
