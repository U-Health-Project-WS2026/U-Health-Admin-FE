<template>
  <div class="page">

    <router-link to="/doctor/patients" class="back-link">
      ← Back to Patients
    </router-link>

    <section v-if="patient" class="card">

      <template v-if="editing">

        <h2>Edit Patient</h2>

        <div class="field">
          <label>First Name</label>
          <input v-model="editPatient.first_name" />
        </div>

        <div class="field">
          <label>Last Name</label>
          <input v-model="editPatient.last_name" />
        </div>

        <div class="field">
          <label>Age</label>
          <input v-model="editPatient.age" type="number" />
        </div>

        <div class="field">
          <label>Sex</label>
          <input v-model="editPatient.sex" />
        </div>

        <div class="field">
          <label>Location</label>
          <input v-model="editPatient.location" />
        </div>

        <div class="button-row">
          <button @click="updatePatient">Save</button>
          <button class="ghost-btn" @click="cancelEdit">Cancel</button>
        </div>

      </template>

      <template v-else>

        <h2>{{ patient.first_name }} {{ patient.last_name }}</h2>

        <div class="info-row">
          <strong>Age:</strong>
          <span>{{ patient.age ?? '—' }}</span>
        </div>

        <div class="info-row">
          <strong>Sex:</strong>
          <span>{{ formatSex(patient.sex) }}</span>
        </div>

        <div class="info-row">
          <strong>Location:</strong>
          <span>{{ patient.location ?? '—' }}</span>
        </div>

        <hr />

        <h3>User Information</h3>

        <div class="info-row">
          <strong>Username:</strong>
          <span>{{ patient.user_info?.username ?? '—' }}</span>
        </div>

        <div class="info-row">
          <strong>Email:</strong>
          <span>{{ patient.user_info?.email ?? '—' }}</span>
        </div>

        <div class="info-row">
          <strong>Email Verified:</strong>
          <span>
            {{ patient.user_info?.email_verified_at ? 'Yes' : 'No' }}
          </span>
        </div>

        <div class="button-row">
          <button @click="startEdit">Edit</button>
        </div>

      </template>

    </section>

    <p v-if="error" class="error">{{ error }}</p>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()

const patient = ref<any>(null)
const editPatient = ref<any>({})
const editing = ref(false)
const error = ref('')

onMounted(fetchPatient)

async function fetchPatient() {
  try {
    const res = await api.get(`/admin/patients/${route.params.id}`)
    patient.value = res.data?.data ?? res.data
  } catch {
    error.value = 'Could not load patient.'
  }
}

function startEdit() {
  editing.value = true
  editPatient.value = {
    first_name: patient.value.first_name,
    last_name: patient.value.last_name,
    age: patient.value.age,
    sex: patient.value.sex,
    location: patient.value.location
  }
}

function cancelEdit() {
  editing.value = false
}

async function updatePatient() {
  try {
    await api.put(`/admin/patients/${patient.value.id}`, editPatient.value)
    editing.value = false
    fetchPatient()
  } catch {
    error.value = 'Could not update patient.'
  }
}

function formatSex(sex: any) {
  if (sex === 1 || sex === '1') return 'Male'
  if (sex === 0 || sex === '0') return 'Female'
  return sex ?? '—'
}
</script>

<style scoped>
.page { font-family: Arial; padding: 40px; }

.card {
  max-width: 700px;
  margin: 20px auto;
  padding: 25px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.field {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

input {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.button-row {
  margin-top: 15px;
}

button {
  margin-right: 10px;
  padding: 6px 10px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background: #145ea8;
}

.ghost-btn {
  background: transparent;
  color: #1976d2;
}

.error { color: #c62828; }
.back-link { color: #1976d2; text-decoration: none; }
</style>
