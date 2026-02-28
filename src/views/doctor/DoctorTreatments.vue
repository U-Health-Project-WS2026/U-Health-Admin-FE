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
      <h1>Treatment Management</h1>
      <p>Create and review treatments.</p>
    </section>

    <section class="card">
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <!-- CREATE -->
      <div class="form-grid">
        <div class="field">
          <label>Patient</label>
          <select v-model.number="form.patient_id">
            <option :value="0" disabled>Select patient...</option>
            <option v-for="p in patients" :key="p.patient_id" :value="p.patient_id">
              {{ p.first_name }} {{ p.last_name }} (ID: {{ p.patient_id }})
            </option>
          </select>
        </div>

        <div class="field">
          <label>Date of Treatment</label>
          <input type="date" v-model="form.date_of_treatment" />
        </div>

        <div class="field">
          <label>Diagnosis</label>
          <input v-model="form.diagnosis" placeholder="e.g. Influenza" />
        </div>

        <div class="field">
          <label>Type of Treatment</label>
          <input v-model="form.type_of_treatment" placeholder="e.g. Medication / Therapy" />
        </div>

        <div class="field full">
          <label>Diseases (ICD code or name, comma separated)</label>
          <input v-model="diseasesInput" placeholder="e.g. J10, flu" />
        </div>
      </div>

      <!-- MEDICATIONS -->
      <div class="meds">
        <div class="meds-header">
          <h3>Medications</h3>
          <button @click="addMedicationRow">Add Medication</button>
        </div>

        <div v-for="(m, idx) in form.medications" :key="idx" class="med-row">
          <input v-model="m.medication_name" placeholder="Medication name (e.g. Ibuprofen)" />
          <input v-model="m.dosis" placeholder="Dose (e.g. 200mg)" />
          <input v-model="m.amount" placeholder="Amount (e.g. 10)" />
          <button class="danger-btn" @click="removeMedicationRow(idx)">Remove</button>
        </div>

        <p v-if="form.medications.length === 0" class="muted">No medications added.</p>
      </div>

      <div class="actions">
        <button @click="createTreatment">Create Treatment</button>
        <button class="ghost-btn" @click="resetForm">Reset</button>
      </div>

      <hr />

      <!-- LIST -->
      <div class="list-header">
        <h3>Existing Treatments</h3>
        <button class="ghost-btn" @click="fetchTreatments">Refresh</button>
      </div>

      <table>
        <thead>
        <tr>
          <th>Treatment ID</th>
          <th>Patient ID</th>
          <th>Date</th>
          <th>Diagnosis</th>
          <th>Type</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="t in treatments" :key="t.treatment_id ?? t.id">
          <td>{{ t.treatment_id ?? t.id }}</td>
          <td>{{ t.patient_id }}</td>
          <td>{{ formatDate(t.date_of_treatment) }}</td>
          <td>{{ t.diagnosis }}</td>
          <td>{{ t.type_of_treatment }}</td>
        </tr>

        <tr v-if="treatments.length === 0">
          <td colspan="5" class="muted">No treatments found.</td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const error = ref('')
const success = ref('')

const patients = ref<any[]>([])
const treatments = ref<any[]>([])

const diseasesInput = ref('')

const form = ref({
  patient_id: 0,
  diagnosis: '',
  type_of_treatment: '',
  date_of_treatment: '',
  diseases: [] as string[],
  medications: [] as Array<{ medication_name: string; dosis: string; amount: string }>
})

onMounted(async () => {
  await fetchPatients()
  await fetchTreatments()
})

async function fetchPatients() {
  try {
    const res = await api.get('/admin/patients')
    patients.value = res.data?.data ?? []
  } catch {
    // nicht abbrechen, nur leise
  }
}

async function fetchTreatments() {
  try {
    error.value = ''
    const res = await api.get('/admin/treatments')
    treatments.value = res.data?.data ?? res.data ?? []
  } catch (e: any) {
    error.value = 'Could not load treatments.'
  }
}

function addMedicationRow() {
  form.value.medications.push({
    medication_name: '',
    dosis: '',
    amount: ''
  })
}

function removeMedicationRow(idx: number) {
  form.value.medications.splice(idx, 1)
}

function resetForm() {
  success.value = ''
  error.value = ''
  form.value.patient_id = 0
  form.value.diagnosis = ''
  form.value.type_of_treatment = ''
  form.value.date_of_treatment = ''
  diseasesInput.value = ''
  form.value.medications = []
}

async function createTreatment() {
  try {
    error.value = ''
    success.value = ''

    const diseases = diseasesInput.value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

    const payload: any = {
      patient_id: form.value.patient_id,
      diagnosis: form.value.diagnosis.trim(),
      type_of_treatment: form.value.type_of_treatment.trim(),
      date_of_treatment: form.value.date_of_treatment,
      diseases,
      medications: form.value.medications
          .filter(m => m.medication_name.trim())
          .map(m => ({
            medication_name: m.medication_name.trim(),
            dosis: m.dosis.trim(),
            amount: m.amount.trim()
          }))
    }

    if (!payload.patient_id || !payload.diagnosis || !payload.type_of_treatment || !payload.date_of_treatment) {
      error.value = 'Patient, date, diagnosis and type of treatment are required.'
      return
    }

    await api.post('/admin/treatments', payload)

    success.value = 'Treatment created successfully.'
    resetForm()
    await fetchTreatments()
  } catch (e: any) {
    const msg = e?.response?.data?.message
    error.value = msg ? String(msg) : 'Could not create treatment.'
  }
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString()
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 18px;
}

.field { display: flex; flex-direction: column; gap: 6px; }
.field.full { grid-column: 1 / -1; }

label { color: #1976d2; font-weight: 600; font-size: 13px; }

input, select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.meds { margin: 10px 0 15px; }
.meds-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.meds-header h3 { margin: 0; color: #1976d2; }

.med-row { display: grid; grid-template-columns: 1.2fr 1fr 0.8fr auto; gap: 10px; margin-bottom: 10px; }

.actions { display: flex; gap: 10px; margin-top: 10px; }

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

hr { margin: 18px 0; border: none; border-top: 1px solid #eee; }

.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.list-header h3 { margin: 0; color: #1976d2; }

table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px; border-bottom: 1px solid #eee; }
th { text-align: left; color: #1976d2; }
tbody tr:hover { background-color: #f5f9ff; }

.muted { color: #777; text-align: center; }
.error { color: #c62828; margin-bottom: 10px; }
.success { color: #2e7d32; margin-bottom: 10px; font-weight: 600; }
</style>
