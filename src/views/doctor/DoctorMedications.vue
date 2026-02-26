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
      <h1>Medication Management</h1>
      <p>Create, search and manage medications.</p>
    </section>

    <section class="card">
      <!-- Create -->
      <h2>Create Medication</h2>
      <div class="form-row">
        <input v-model="newName" placeholder="Medication name" />
        <input v-model="newDose" placeholder="Dosage (e.g. 500mg)" />
        <button @click="addMedication">Add</button>
      </div>

      <!-- Search -->
      <h2>Search</h2>
      <input v-model="search" placeholder="Search medication..." />

      <!-- Table -->
      <h2>Medications</h2>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Dosage</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="m in filteredMedications" :key="m.id">
          <td>{{ m.name }}</td>
          <td>{{ m.dose }}</td>
          <td>
            <button @click="selectMedication(m)">View</button>
            |
            <button @click="removeMedication(m.id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- View -->
      <div v-if="selectedMedication" class="details">
        <h3>Medication Details</h3>
        <p><strong>Name:</strong> {{ selectedMedication.name }}</p>
        <p><strong>Dosage:</strong> {{ selectedMedication.dose }}</p>
        <button @click="selectedMedication = null">Close</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Medication {
  id: number
  name: string
  dose: string
}

const medications = ref<Medication[]>([
  { id: 1, name: 'Ibuprofen', dose: '400mg' },
  { id: 2, name: 'Metformin', dose: '500mg' }
])

const newName = ref('')
const newDose = ref('')
const search = ref('')
const selectedMedication = ref<Medication | null>(null)

function addMedication() {
  if (!newName.value.trim()) return

  medications.value.push({
    id: Date.now(),
    name: newName.value,
    dose: newDose.value
  })

  newName.value = ''
  newDose.value = ''
}

function removeMedication(id: number) {
  medications.value = medications.value.filter(m => m.id !== id)
  if (selectedMedication.value?.id === id) selectedMedication.value = null
}

function selectMedication(m: Medication) {
  selectedMedication.value = m
}

const filteredMedications = computed(() =>
  medications.value.filter(m =>
    m.name.toLowerCase().includes(search.value.toLowerCase())
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

.form-row input {
  margin-right: 8px;
  margin-bottom: 10px;
  padding: 6px;
}

button {
  padding: 6px 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.details {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #eee;
}
</style>
