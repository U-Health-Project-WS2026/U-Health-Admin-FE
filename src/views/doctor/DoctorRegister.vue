<template>
  <div class="page">
    <nav class="navbar">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/doctor/login" class="nav-link">Sign-In</router-link>
    </nav>

    <section class="hero">
      <h1>Welcome to U-Health</h1>
      <p>Create your doctor account.</p>
    </section>

    <section class="login-section">
      <h2>Doctor Sign-Up</h2>

      <form @submit.prevent="register">
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="name" type="text" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>

        <button type="submit">Create Account</button>
      </form>

      <div class="forgot-password">
        <router-link to="/doctor/login">Already have an account? Sign-In</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

function register() {
  // mock register flow
  router.push('/doctor/login')
}
</script>

<style scoped>
.page { font-family: Arial, sans-serif; background: white; min-height: 100vh; }
.navbar { padding: 15px 40px; border-bottom: 1px solid #eee; }
.nav-link { margin-right: 20px; text-decoration: none; color: #1976d2; font-weight: 500; }

.hero { text-align: center; padding: 60px 20px 40px; }
.hero h1 { color: #1976d2; font-size: 36px; }
.hero p { color: #555; }

.login-section { max-width: 400px; margin: 30px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
.login-section h2 { text-align: center; margin-bottom: 20px; color: #1976d2; }

.form-group { margin-bottom: 15px; }
input { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc; }
button { width: 100%; padding: 10px; background-color: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer; }

.forgot-password { text-align: center; margin-top: 15px; }
</style>

