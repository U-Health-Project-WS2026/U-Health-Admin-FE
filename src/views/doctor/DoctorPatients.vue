<template>
  <div class="page">
    <!-- Navigation -->
    <nav class="navbar">
      <router-link to="/doctor/dashboard" class="nav-link">Dashboard</router-link>
      <router-link to="/doctor/patients" class="nav-link">Patients</router-link>
      <router-link to="/doctor/bookings" class="nav-link">Bookings</router-link>
      <router-link to="/doctor/diseases" class="nav-link">Diseases</router-link>
      <router-link to="/doctor/medications" class="nav-link">Medications</router-link>
      <router-link to="/doctor/treatments" class="nav-link">Treatments</router-link>
    </nav>

    <!-- Header -->
    <section class="hero">
      <h1>Patient Management</h1>
      <p>Create, search and manage patients in U-Health.</p>
    </section>

    <!-- Content Card -->
    <section class="card">
      <!-- Create -->
      <div class="create-section">
        <input v-model="newPatient" placeholder="New patient name" />
        <button @click="addPatient">Add</button>
      </div>

      <!-- Search -->
      <div class="search-section">
        <input v-model="search" placeholder="Search patient..." />
      </div>

      <!-- Table -->
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th style="width: 180px;">Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="patient in filteredPatients" :key="patient.id">
          <td>{{ patient.name }}</td>
          <td>
            <router-link to="/doctor/patient-detail">View</router-link>
            |
            <button class="danger-btn" @click="removePatient(patient.id)">Delete</button>
          </td>
        </tr>

        <tr v-if="filteredPatients.length === 0">
          <td colspan="2" class="muted">No patients found.</td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Patient {
  id: number
  name: string
}

const patients = ref<Patient[]>([
  { id: 1, name: 'Max Mustermann' },
  { id: 2, name: 'Anna Schmidt' }
])

const newPatient = ref('')
const search = ref('')

function addPatient() {
  if (!newPatient.value.trim()) return

  patients.value.unshift({
    id: Date.now(),
    name: newPatient.value.trim()
  })

  newPatient.value = ''
}

function removePatient(id: number) {
  patients.value = patients.value.filter(p => p.id !== id)
}

const filteredPatients = computed(() =>
  patients.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script>

<style scoped>
.page {
  font-family: Arial, sans-serif;
  background: white;
  min-height: 100vh;
}

/* NAVBAR */
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

.nav-link:hover {
  text-decoration: underline;
}

/* HERO */
.hero {
  text-align: center;
  padding: 60px 20px 30px;
}

.hero h1 {
  color: #1976d2;
  font-size: 34px;
}

.hero p {
  color: #555;
}

/* CARD */
.card {
  max-width: 700px;
  margin: 20px auto 40px;
  padding: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* INPUTS */
.create-section,
.search-section {
  margin-bottom: 15px;
}

input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-right: 8px;
  width: 60%;
}

/* BUTTONS */
button {
  padding: 8px 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background-color: #145ea8;
}

.danger-btn {
  background: transparent;
  color: #c62828;
  border: none;
  padding: 0;
  font-weight: 500;
}

.danger-btn:hover {
  text-decoration: underline;
  background: transparent;
}

/* LINKS */
a {
  color: #1976d2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* TABLE */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

th {
  text-align: left;
  color: #1976d2;
}

tbody tr:hover {
  background-color: #f5f9ff;
}

.muted {
  color: #777;
  text-align: center;
  padding: 12px;
}
</style>
