<template>
  <div class="page">
    <nav class="navbar">
      <router-link to="/doctor/login" class="nav-link">Back to Login</router-link>
    </nav>

    <section class="hero">
      <h1>Reset Password</h1>
      <p>Set a new password for your account.</p>
    </section>

    <section class="card">
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <div class="field">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="you@example.com" />
      </div>

      <div class="field">
        <label>Reset Token</label>
        <input v-model="token" placeholder="token from email" />
      </div>

      <div class="field">
        <label>New Password</label>
        <input v-model="password" type="password" placeholder="New password" />
      </div>

      <div class="field">
        <label>Confirm Password</label>
        <input v-model="passwordConfirmation" type="password" placeholder="Confirm password" />
      </div>

      <button @click="resetPassword">Reset Password</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const email = ref('')
const token = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const error = ref('')
const success = ref('')

async function resetPassword() {
  try {
    error.value = ''
    success.value = ''

    if (!email.value.trim() || !token.value.trim()) {
      error.value = 'Email and token are required.'
      return
    }
    if (!password.value || password.value !== passwordConfirmation.value) {
      error.value = 'Passwords do not match.'
      return
    }

    const res = await api.post('/reset-password', {
      token: token.value.trim(),
      email: email.value.trim(),
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })

    success.value = res.data?.status ?? 'Password reset successful.'
    setTimeout(() => router.push('/doctor/login'), 800)
  } catch (e: any) {
    const msg = e?.response?.data?.message
    error.value = msg ? String(msg) : 'Could not reset password.'
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
