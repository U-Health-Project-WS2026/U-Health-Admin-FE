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

      <!-- CREATE -->
      <div class="create-section">
        <input v-model="newMedication.name" placeholder="Name" />
        <input v-model="newMedication.description" placeholder="Description" />
        <button @click="createMedication">Add</button>
      </div>

      <!-- SEARCH -->
      <div class="search-row">
        <input v-model="search" placeholder="Search medication..." />
        <button @click="fetchMedications">Search</button>
        <button class="ghost-btn" @click="resetSearch">Reset</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th style="width:200px;">Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="m in medications" :key="m.id">

          <!-- EDIT MODE -->
          <template v-if="editingId === m.id">
            <td><input v-model="editMedication.name" /></td>
            <td><input v-model="editMedication.description" /></td>
            <td>
              <button @click="updateMedication(m.id)">Save</button>
              <button class="ghost-btn" @click="cancelEdit">Cancel</button>
            </td>
          </template>

          <!-- NORMAL MODE -->
          <template v-else>
            <td>{{ m.name }}</td>
            <td>{{ m.description }}</td>
            <td>
              <button @click="startEdit(m)">Edit</button>
              |
              <button class="danger-btn" @click="deleteMedication(m.id)">Delete</button>
            </td>
          </template>

        </tr>

        <tr v-if="medications.length === 0">
          <td colspan="3" class="muted">No medications found.</td>
        </tr>
        </tbody>
      </table>

    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const medications = ref<any[]>([])
const search = ref('')
const error = ref('')

const newMedication = ref({
  name: '',
  description: ''
})

const editingId = ref<number | null>(null)
const editMedication = ref({
  name: '',
  description: ''
})

onMounted(fetchMedications)

async function fetchMedications() {
  try {
    error.value = ''

    const res = await api.get('/admin/medications', {
      params: search.value ? { q: search.value } : {}
    })

    medications.value = res.data?.data ?? []
  } catch {
    error.value = 'Could not load medications.'
  }
}

function resetSearch() {
  search.value = ''
  fetchMedications()
}

async function createMedication() {
  try {
    await api.post('/admin/medications', newMedication.value)
    newMedication.value = { name: '', description: '' }
    fetchMedications()
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Could not create medication.'
  }
}

function startEdit(m: any) {
  editingId.value = m.id
  editMedication.value = {
    name: m.name,
    description: m.description
  }
}

function cancelEdit() {
  editingId.value = null
}

async function updateMedication(id: number) {
  try {
    await api.put(`/admin/medications/${id}`, editMedication.value)
    cancelEdit()
    fetchMedications()
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Could not update medication.'
  }
}

async function deleteMedication(id: number) {
  try {
    await api.delete(`/admin/medications/${id}`)
    fetchMedications()
  } catch {
    error.value = 'Could not delete medication.'
  }
}
</script>

<style scoped>
.page { font-family: Arial; background: white; min-height: 100vh; }
.navbar { padding: 15px 40px; border-bottom: 1px solid #eee; }
.nav-link { margin-right: 20px; text-decoration: none; color: #1976d2; }
.hero { text-align: center; padding: 60px 20px 30px; }
.hero h1 { color: #1976d2; }

.card {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.create-section,
.search-row { margin-bottom: 15px; display: flex; gap: 10px; }

input { padding: 6px; border-radius: 4px; border: 1px solid #ccc; }

button {
  padding: 6px 10px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover { background: #145ea8; }

.ghost-btn { background: transparent; color: #1976d2; }
.danger-btn { background: transparent; color: #c62828; }

table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px; border-bottom: 1px solid #eee; }
th { text-align: left; color: #1976d2; }

.muted { color: #777; text-align: center; }
.error { color: #c62828; }
</style>
