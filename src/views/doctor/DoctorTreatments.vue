<template>
  <div class="page">

    <nav class="navbar">
      <div class="nav-left">
        <router-link to="/doctor/dashboard" class="nav-link">Dashboard</router-link>
        <router-link to="/doctor/patients" class="nav-link">Patients</router-link>
        <router-link to="/doctor/bookings" class="nav-link">Bookings</router-link>
        <router-link to="/doctor/diseases" class="nav-link">Diseases</router-link>
        <router-link to="/doctor/medications" class="nav-link">Medications</router-link>
        <router-link to="/doctor/treatments" class="nav-link">Treatments</router-link>
      </div>

      <button class="logout-btn" @click="logout">Logout</button>
    </nav>

    <section class="hero">
      <h1>Treatment Management</h1>
      <p>Manage treatment records.</p>
    </section>

    <section class="card">
      <h2>Create Treatment</h2>

      <div class="form-row">
        <input v-model="newTreatment" placeholder="Treatment description" />
        <input v-model="newDate" type="date" />
        <button @click="addTreatment">Add</button>
      </div>

      <h2>Treatments</h2>

      <table>
        <thead>
        <tr>
          <th>Description</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="t in treatments" :key="t.id">
          <td>{{ t.description }}</td>
          <td>{{ t.date }}</td>
          <td>
            <button @click="removeTreatment(t.id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>

    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  router.push('/doctor/login')
}

interface Treatment {
  id: number
  description: string
  date: string
}

const treatments = ref<Treatment[]>([
  { id: 1, description: 'Routine check-up', date: '2026-02-20' }
])

const newTreatment = ref('')
const newDate = ref('')

function addTreatment() {
  if (!newTreatment.value || !newDate.value) return

  treatments.value.push({
    id: Date.now(),
    description: newTreatment.value,
    date: newDate.value
  })

  newTreatment.value = ''
  newDate.value = ''
}

function removeTreatment(id: number) {
  treatments.value = treatments.value.filter(t => t.id !== id)
}
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  gap: 18px;
}

.nav-link {
  text-decoration: none;
  color: #1976d2;
  font-weight: 500;
}

.nav-link:hover {
  text-decoration: underline;
}

.logout-btn {
  padding: 6px 12px;
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
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
</style>
