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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const email = ref('')
const token = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const error = ref('')
const success = ref('')
const loading = ref(false)

onMounted(() => {
  token.value = String(route.params.token ?? '')
  email.value = String(route.query.email ?? '')
})

async function resetPassword() {
  try {
    error.value = ''
    success.value = ''
    loading.value = true

    const e = email.value.trim()
    const t = token.value.trim()

    if (!e || !t) {
      error.value = 'Email and token are required.'
      return
    }
    if (!password.value || password.value !== passwordConfirmation.value) {
      error.value = 'Passwords do not match.'
      return
    }

    const res = await api.post('/reset-password', {
      token: t,
      email: e,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })

    success.value = String(res.data?.status ?? 'Password reset successful.')
    setTimeout(() => router.push('/doctor/login'), 800)
  } catch (err: any) {
    // Laravel gibt oft { message: "...", errors: { email: [...], password: [...] } }
    const data = err?.response?.data
    const msg = data?.message

    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0]
      const firstMsg = firstKey ? data.errors[firstKey]?.[0] : null
      error.value = String(firstMsg ?? msg ?? 'Could not reset password.')
    } else {
      error.value = String(msg ?? 'Could not reset password.')
    }
  } finally {
    loading.value = false
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
