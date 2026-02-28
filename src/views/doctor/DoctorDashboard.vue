<template>
  <div class="page">
    <nav class="navbar">
      <router-link to="/doctor/dashboard" class="nav-link">Dashboard</router-link>
      <router-link to="/doctor/patients" class="nav-link">Patients</router-link>
      <router-link to="/doctor/bookings" class="nav-link">Bookings</router-link>
      <router-link to="/doctor/diseases" class="nav-link">Diseases</router-link>
      <router-link to="/doctor/medications" class="nav-link">Medications</router-link>
      <router-link to="/doctor/treatments" class="nav-link">Treatments</router-link>
      <router-link to="/doctor/change-password" class="nav-link">Change Password</router-link>
    </nav>

    <section class="hero">
      <h1>Doctor Dashboard</h1>
      <p>Overview of U-Health admin data.</p>
    </section>

    <section class="card">
      <p v-if="error" class="error">{{ error }}</p>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">Total Patients</div>
          <div class="stat-value">{{ stats.totalPatients }}</div>
        </div>

        <div class="stat">
          <div class="stat-label">Total Time Slots</div>
          <div class="stat-value">{{ stats.totalSlots }}</div>
        </div>

        <div class="stat">
          <div class="stat-label">Upcoming Booked</div>
          <div class="stat-value">{{ stats.upcomingBooked }}</div>
        </div>

        <div class="stat">
          <div class="stat-label">Booked Today</div>
          <div class="stat-value">{{ stats.bookedToday }}</div>
        </div>

        <div class="stat">
          <div class="stat-label">Free Upcoming</div>
          <div class="stat-value">{{ stats.freeUpcoming }}</div>
        </div>
      </div>

      <div class="actions">
        <button @click="loadStats">Refresh</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const error = ref('')

const stats = ref({
  totalPatients: 0,
  totalSlots: 0,
  upcomingBooked: 0,
  bookedToday: 0,
  freeUpcoming: 0
})

onMounted(loadStats)

async function loadStats() {
  try {
    error.value = ''

    const [patientsRes, bookingsRes] = await Promise.all([
      api.get('/admin/patients'),
      api.get('/admin/bookings')
    ])

    const patients = patientsRes.data?.data ?? []
    const bookings = bookingsRes.data?.data ?? []

    stats.value.totalPatients = Array.isArray(patients) ? patients.length : 0
    stats.value.totalSlots = Array.isArray(bookings) ? bookings.length : 0

    const now = new Date()
    const today = now.toISOString().slice(0, 10) // YYYY-MM-DD

    let upcomingBooked = 0
    let bookedToday = 0
    let freeUpcoming = 0

    for (const b of bookings) {
      const start = b.time_slot_start ? new Date(b.time_slot_start) : null
      const status = Number(b.status)

      if (!start || Number.isNaN(start.getTime())) continue

      const startDay = start.toISOString().slice(0, 10)

      if (status === 1 && start >= now) upcomingBooked++
      if (status === 1 && startDay === today) bookedToday++
      if (status === 0 && start >= now) freeUpcoming++
    }

    stats.value.upcomingBooked = upcomingBooked
    stats.value.bookedToday = bookedToday
    stats.value.freeUpcoming = freeUpcoming

  } catch (e: any) {
    error.value = 'Could not load dashboard statistics.'
  }
}
</script>

<style scoped>
.page { font-family: Arial, sans-serif; background: white; min-height: 100vh; }

.navbar { padding: 15px 40px; border-bottom: 1px solid #eee; }
.nav-link { margin-right: 20px; text-decoration: none; color: #1976d2; font-weight: 500; }
.nav-link:hover { text-decoration: underline; }

.hero { text-align: center; padding: 60px 20px 30px; }
.hero h1 { color: #1976d2; font-size: 34px; }
.hero p { color: #555; }

.card {
  max-width: 1100px;
  margin: 20px auto 40px;
  padding: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}

.stat-label { color: #1976d2; font-weight: 600; font-size: 13px; margin-bottom: 6px; }
.stat-value { font-size: 28px; font-weight: 700; color: #222; }

.actions { display: flex; justify-content: flex-end; }

button {
  padding: 8px 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover { background-color: #145ea8; }

.error { color: #c62828; margin-bottom: 10px; }
</style>
