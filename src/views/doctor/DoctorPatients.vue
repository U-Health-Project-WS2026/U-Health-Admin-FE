<<template>
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
      <h1>Patient Management</h1>
      <p>Search and view registered patients in U-Health.</p>
    </section>

    <section class="card">
      <p v-if="error" class="error">{{ error }}</p>

      <!-- Search row -->
      <div class="search-row">
        <input v-model="searchInput" placeholder="Search by name..." />
        <button @click="applySearch">Search</button>
        <button class="ghost-btn" @click="clearSearch">Reset</button>
      </div>

      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Sex</th>
          <th>Location</th>
          <th style="width: 140px;">Action</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="p in filteredPatients" :key="p.patient_id">
          <td>{{ p.first_name }} {{ p.last_name }}</td>
          <td>{{ p.age ?? '—' }}</td>
          <td>{{ formatSex(p.sex) }}</td>
          <td>{{ p.location ?? '—' }}</td>
          <td>
            <router-link :to="`/doctor/patient-detail/${p.patient_id}`">View</router-link>
          </td>
        </tr>

        <tr v-if="filteredPatients.length === 0">
          <td colspan="5" class="muted">No patients found.</td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

type Patient = {
  patient_id: number
  first_name: string
  last_name: string
  age?: number
  sex?: number | string
  location?: string
}

const patients = ref<Patient[]>([])
const error = ref('')

const searchInput = ref('')
const searchApplied = ref('')

function applySearch() {
  searchApplied.value = searchInput.value
}

function clearSearch() {
  searchInput.value = ''
  searchApplied.value = ''
}

async function fetchPatients() {
  try {
    error.value = ''

    const token = localStorage.getItem('token')
    if (!token) {
      error.value = 'No token found. Please login again.'
      patients.value = []
      return
    }

    const res = await api.get('/admin/patients', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })

    const list = res.data?.data ?? []
    patients.value = Array.isArray(list) ? list : []

    // Debug: damit du siehst, ob wirklich Daten ankommen
    console.log('PATIENTS FROM API:', patients.value)
  } catch (e: any) {
    const status = e?.response?.status
    const msg = e?.response?.data?.message
    console.error('PATIENTS ERROR:', status, e?.response?.data)
    error.value = `Could not load patients (${status ?? 'no status'})${msg ? ': ' + msg : ''}`
    patients.value = []
  }
}

onMounted(fetchPatients)

const filteredPatients = computed(() => {
  const q = searchApplied.value.trim().toLowerCase()
  if (!q) return patients.value

  return patients.value.filter(p =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(q)
  )
})

function formatSex(sex: Patient['sex']) {
  if (sex === undefined || sex === null || sex === '') return '—'
  if (sex === 1 || sex === '1') return 'Male'
  if (sex === 0 || sex === '0') return 'Female'
  return String(sex)
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
.card { max-width: 1000px; margin: 20px auto 40px; padding: 20px; border-radius: 8px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.search-row { display: flex; gap: 10px; align-items: center; margin-bottom: 15px; }
input { padding: 8px; border-radius: 6px; border: 1px solid #ccc; width: 420px; }

button { padding: 8px 12px; background-color: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer; }
button:hover { background-color: #145ea8; }

.ghost-btn { background: transparent; color: #1976d2; border: none; padding: 0; font-weight: 500; }
.ghost-btn:hover { text-decoration: underline; background: transparent; }

table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px; border-bottom: 1px solid #eee; }
th { text-align: left; color: #1976d2; }
tbody tr:hover { background-color: #f5f9ff; }
.muted { color: #777; text-align: center; padding: 12px; }
.error { color: #c62828; margin-bottom: 10px; }
</style>
