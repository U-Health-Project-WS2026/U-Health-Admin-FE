<template>
  <div class="page">

    <nav class="navbar">
      <router-link to="/doctor/dashboard" class="nav-link">Dashboard</router-link>
      <router-link to="/doctor/patients" class="nav-link">Patients</router-link>
      <router-link to="/doctor/bookings" class="nav-link">Bookings</router-link>
      <router-link to="/doctor/diseases" class="nav-link">Diseases</router-link>
      <router-link to="/doctor/medications" class="nav-link">Medications</router-link>
      <router-link to="/doctor/treatments" class="nav-link">Treatments</router-link>

      <button class="logout-btn" @click="logout">Logout</button>
    </nav>

    <section class="hero">
      <h1>Doctor Dashboard</h1>
      <p>Overview of system statistics.</p>
    </section>

    <section class="stats-grid">

      <div class="stat-card">
        <div class="stat-title">Total Patients</div>
        <div class="stat-value">{{ totalPatients }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-title">Total Time Slots</div>
        <div class="stat-value">{{ totalSlots }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-title">Upcoming Bookings</div>
        <div class="stat-value">{{ upcomingBooked }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-title">Booked Today</div>
        <div class="stat-value">{{ bookedToday }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-title">Free Upcoming</div>
        <div class="stat-value">{{ freeUpcoming }}</div>
      </div>

    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const totalPatients = ref(0)
const totalSlots = ref(0)
const upcomingBooked = ref(0)
const freeUpcoming = ref(0)
const bookedToday = ref(0)

function logout() {
  localStorage.removeItem('token')
  router.push('/doctor/login')
}

async function loadDashboard() {
  try {
    // ---- PATIENTS ----
    const patientsRes = await api.get('/admin/patients')
    const patients = Array.isArray(patientsRes.data)
        ? patientsRes.data
        : (patientsRes.data?.data ?? [])
    totalPatients.value = patients.length

    // ---- BOOKINGS ----
    const bookingsRes = await api.get('/admin/bookings')
    const bookings = Array.isArray(bookingsRes.data)
        ? bookingsRes.data
        : (bookingsRes.data?.data ?? [])

    totalSlots.value = bookings.length

    const now = new Date()

    const toStatus = (s: any) => Number(s)
    const toDate = (v: any) => {
      const d = new Date(v)
      return Number.isNaN(d.getTime()) ? null : d
    }

    upcomingBooked.value = bookings.filter((b: any) => {
      const start = toDate(b?.time_slot_start)
      return start && toStatus(b?.status) === 1 && start >= now
    }).length

    freeUpcoming.value = bookings.filter((b: any) => {
      const start = toDate(b?.time_slot_start)
      return start && toStatus(b?.status) === 0 && start >= now
    }).length

  } catch (e) {
    console.error('Dashboard load error', e)
  }
}

// ---- BOOKED TODAY SEPARAT ----
async function fetchBookedToday() {
  try {
    const res = await api.get('/admin/bookings/today')

    const raw = res.data?.message ?? res.data?.count ?? res.data
    const n = Number(raw)

    bookedToday.value = Number.isFinite(n) ? n : 0

  } catch (e: any) {
    console.error('BOOKED TODAY ERROR:', e?.response?.status, e?.response?.data)
    bookedToday.value = 0
  }
}

onMounted(async () => {
  await loadDashboard()
  await fetchBookedToday()
})
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
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #1976d2;
  font-weight: 500;
}

.logout-btn {
  margin-left: auto;
  background: transparent;
  border: none;
  color: #c62828;
  cursor: pointer;
}

.hero {
  text-align: center;
  padding: 60px 20px 30px;
}

.hero h1 {
  color: #1976d2;
  font-size: 34px;
}

.stats-grid {
  max-width: 1100px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  padding: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
}

.stat-title {
  color: #555;
  font-size: 14px;
}

.stat-value {
  margin-top: 8px;
  color: #1976d2;
  font-size: 28px;
  font-weight: 700;
}
</style>
