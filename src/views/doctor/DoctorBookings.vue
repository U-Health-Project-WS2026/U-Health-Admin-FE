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
      <h1>Booking Management</h1>
      <p>Create, search and manage time slots.</p>
    </section>

    <section class="card">

      <!-- CREATE -->
      <div class="create-section">
        <input type="datetime-local" v-model="newSlot.start" />
        <input type="datetime-local" v-model="newSlot.end" />
        <button type="button" @click="createSlot">Add</button>
      </div>

      <!-- SEARCH -->
      <div class="search-section">
        <input v-model="searchName" placeholder="Search by patient name..." />
        <input v-model="searchId" placeholder="Search by patient ID..." />

        <button type="button" @click="fetchBookings">Search</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <table>
        <thead>
        <tr>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
          <th>Patient</th>
          <th style="width: 180px;">Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="b in bookings" :key="b.booking_id">

          <!-- EDIT MODE -->
          <template v-if="editingId === b.booking_id">
            <td><input type="datetime-local" v-model="editSlot.start" /></td>
            <td><input type="datetime-local" v-model="editSlot.end" /></td>
            <td colspan="3">
              <button type="button" @click="updateSlot(b.booking_id)">Save</button>
              <button type="button" class="ghost-btn" @click="cancelEdit">Cancel</button>
            </td>
          </template>

          <!-- NORMAL MODE -->
          <template v-else>
            <td>{{ formatDate(b.time_slot_start) }}</td>
            <td>{{ formatDate(b.time_slot_end) }}</td>
            <td>
              <span :class="b.status === 1 ? 'booked' : 'free'">
                {{ b.status === 1 ? 'Booked' : 'Free' }}
              </span>
            </td>
            <td>
              <span v-if="b.patients">
                {{ b.patients.first_name }} {{ b.patients.last_name }}
              </span>
              <span v-else>—</span>
            </td>
            <td>
              <button type="button" @click="startEdit(b)" v-if="b.status === 0">Edit</button>
              |
              <button type="button" class="danger-btn" @click="deleteSlot(b.booking_id)">Delete</button>
            </td>
          </template>

        </tr>

        <tr v-if="bookings.length === 0">
          <td colspan="5" class="muted">No bookings found.</td>
        </tr>
        </tbody>
      </table>

    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const bookings = ref<any[]>([])
const error = ref('')

const searchName = ref('')
const searchId = ref('')

const newSlot = ref({ start: '', end: '' })

const editingId = ref<number | null>(null)
const editSlot = ref({ start: '', end: '' })

onMounted(fetchBookings)


async function fetchBookings() {
  try {
    error.value = ''

    const res = await api.get('/admin/bookings')
    const all = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])

    const nameQ = searchName.value.trim().toLowerCase()
    const idQ = searchId.value.trim()

    bookings.value = all.filter((b: any) => {
      // patient info can be b.patients or b.patient depending on your resource
      const p = b?.patients ?? b?.patient ?? null

      const first = String(p?.first_name ?? '').toLowerCase()
      const last = String(p?.last_name ?? '').toLowerCase()
      const full = `${first} ${last}`.trim()

      const pid = String(b?.patient_id ?? p?.patient_id ?? '')

      const matchName = !nameQ || full.includes(nameQ)
      const matchId = !idQ || pid === idQ

      return matchName && matchId
    })
  } catch (e: any) {
    console.error('BOOKINGS ERROR:', e?.response?.status, e?.response?.data)
    error.value = 'Could not load bookings.'
  }
}

async function createSlot() {
  try {
    await api.post('/admin/bookings', {
      time_slot_start: newSlot.value.start,
      time_slot_end: newSlot.value.end
    })

    newSlot.value.start = ''
    newSlot.value.end = ''
    fetchBookings()

  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Could not create slot.'
  }
}

function startEdit(b: any) {
  editingId.value = b.booking_id
  editSlot.value.start = b.time_slot_start
  editSlot.value.end = b.time_slot_end
}

function cancelEdit() {
  editingId.value = null
}

async function updateSlot(id: number) {
  try {
    await api.put(`/admin/bookings/${id}`, {
      time_slot_start: editSlot.value.start,
      time_slot_end: editSlot.value.end
    })

    cancelEdit()
    fetchBookings()

  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Could not update slot.'
  }
}

async function deleteSlot(id: number) {
  try {
    await api.delete(`/admin/bookings/${id}`)
    fetchBookings()
  } catch {
    error.value = 'Could not delete slot.'
  }
}

function formatDate(date: string) {
  if (!date) return '—'
  return new Date(date).toLocaleString()
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

.create-section,
.search-section {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 8px 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover { background-color: #145ea8; }

.ghost-btn { background: transparent; color: #1976d2; }

.danger-btn { background: transparent; color: #c62828; }

table { width: 100%; border-collapse: collapse; }

th, td { padding: 10px; border-bottom: 1px solid #eee; }

th { text-align: left; color: #1976d2; }

tbody tr:hover { background-color: #f5f9ff; }

.booked { color: #c62828; font-weight: 600; }

.free { color: #2e7d32; font-weight: 600; }

.muted { color: #777; text-align: center; }

.error { color: #c62828; }
</style>
