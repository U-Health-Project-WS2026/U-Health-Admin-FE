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
      <h1>Booking Management</h1>
      <p>Manage doctor appointments.</p>
    </section>

    <section class="card">

      <h2>Create Booking</h2>

      <div class="form-row">
        <input v-model="newPatient" placeholder="Patient name" />
        <input v-model="newDate" type="date" />
        <button @click="addBooking">Add</button>
      </div>

      <h2>Search</h2>
      <input v-model="search" placeholder="Search booking..." />

      <h2>Bookings</h2>

      <table>
        <thead>
        <tr>
          <th>Patient</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="b in filteredBookings" :key="b.id">
          <td>{{ b.patient }}</td>
          <td>{{ b.date }}</td>
          <td>
            <button @click="removeBooking(b.id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>

    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  router.push('/doctor/login')
}

interface Booking {
  id: number
  patient: string
  date: string
}

const bookings = ref<Booking[]>([
  { id: 1, patient: 'Anna Schmidt', date: '2026-03-01' },
  { id: 2, patient: 'Max Mustermann', date: '2026-03-02' }
])

const newPatient = ref('')
const newDate = ref('')
const search = ref('')

function addBooking() {
  if (!newPatient.value || !newDate.value) return

  bookings.value.push({
    id: Date.now(),
    patient: newPatient.value,
    date: newDate.value
  })

  newPatient.value = ''
  newDate.value = ''
}

function removeBooking(id: number) {
  bookings.value = bookings.value.filter(b => b.id !== id)
}

const filteredBookings = computed(() =>
  bookings.value.filter(b =>
    b.patient.toLowerCase().includes(search.value.toLowerCase())
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
