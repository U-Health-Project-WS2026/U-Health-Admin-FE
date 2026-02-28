<template>
  <div class="page">
    <nav class="navbar">
      <router-link to="/doctor/dashboard" class="nav-link">Back to Dashboard</router-link>
    </nav>

    <section class="hero">
      <h1>Change Password</h1>
      <p>Update your password securely.</p>
    </section>

    <section class="card">
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <div class="field">
        <label>Current Password</label>
        <input v-model="currentPassword" type="password" placeholder="Current password" />
      </div>

      <div class="field">
        <label>New Password</label>
        <input v-model="newPassword" type="password" placeholder="New password" />
      </div>

      <button @click="changePassword">Change Password</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

const currentPassword = ref('')
const newPassword = ref('')

const error = ref('')
const success = ref('')

async function changePassword() {
  try {
    error.value = ''
    success.value = ''

    if (!currentPassword.value || !newPassword.value) {
      error.value = 'Both fields are required.'
      return
    }

    const res = await api.post('/change-password', {
      current_password: currentPassword.value,
      password: newPassword.value
    })

    success.value = res.data?.status ?? 'Password updated.'
    currentPassword.value = ''
    newPassword.value = ''
  } catch (e: any) {
    const msg = e?.response?.data?.message
    error.value = msg ? String(msg) : 'Could not change password.'
  }
}
</script>

<style scoped>
.page { font-family: Arial, sans-serif; background: white; min-height: 100vh; }
.navbar { padding: 15px 40px; border-bottom: 1px solid #eee; }
.nav-link { text-decoration: none; color: #1976d2; font-weight: 500; }
.nav-link:hover { text-decoration: underline; }
.hero { text-align: center; padding: 60px 20px 30px; }
.hero h1 { color: #1976d2; font-size: 34px; }
.hero p { color: #555; }
.card { max-width: 600px; margin: 20px auto 40px; padding: 20px; border-radius: 8px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
label { color: #1976d2; font-weight: 600; font-size: 13px; }
input { padding: 8px; border-radius: 6px; border: 1px solid #ccc; }
button { padding: 8px 12px; background-color: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer; }
button:hover { background-color: #145ea8; }
.error { color: #c62828; margin-bottom: 10px; }
.success { color: #2e7d32; margin-bottom: 10px; font-weight: 600; }
</style>
