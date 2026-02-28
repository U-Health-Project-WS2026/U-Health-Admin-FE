<template>
  <div class="page">
    <nav class="navbar">
      <router-link to="/doctor/login" class="nav-link">Back to Login</router-link>
    </nav>

    <section class="hero">
      <h1>Forgot Password</h1>
      <p>Enter your email to receive a password reset link.</p>
    </section>

    <section class="card">
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <div class="field">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="you@example.com" />
      </div>

      <button @click="sendLink">Send Reset Link</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

const email = ref('')
const error = ref('')
const success = ref('')

async function sendLink() {
  try {
    error.value = ''
    success.value = ''

    if (!email.value.trim()) {
      error.value = 'Email is required.'
      return
    }

    const res = await api.post('/forgot-password', { email: email.value.trim() })
    success.value = res.data?.status ?? 'Reset link sent. Please check your email.'
  } catch (e: any) {
    const msg = e?.response?.data?.message
    error.value = msg ? String(msg) : 'Could not send reset link.'
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
