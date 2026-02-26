<template>
  <div class="page">
    <nav class="navbar">
    </nav>

    <section class="hero">
      <h1>Welcome to U-Health</h1>
      <p>Manage patients, treatments and appointments digitally and efficiently.</p>
    </section>

    <section class="login-section">
      <h2>Doctor Login</h2>

      <form @submit.prevent="login">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>

        <div class="forgot-password">
          <router-link to="/doctor/reset-password">
            Forgot password?
          </router-link>
        </div>

        <button type="submit">Login</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

function login() {
  // Mock auth: set a token so protected pages can validate access
  localStorage.setItem('token', 'mock-doctor-token')

  router.push('/doctor/dashboard')
}
</script>

<style scoped>
.page {
  font-family: Arial, sans-serif;
  background: white;
  min-height: 100vh;
}

/* NAVBAR */
.navbar {
  padding: 15px 40px;
  border-bottom: 1px solid #eee;
}

.nav-link {
  margin-right: 20px;
  text-decoration: none;
  color: #1976d2;
  font-weight: 500;
}

.nav-link:hover {
  text-decoration: underline;
}

/* HERO */
.hero {
  text-align: center;
  padding: 60px 20px 40px;
}

.hero h1 {
  color: #1976d2;
  font-size: 36px;
  margin-bottom: 10px;
}

.hero p {
  color: #555;
  font-size: 16px;
}

/* LOGIN */
.login-section {
  max-width: 400px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.login-section h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #1976d2;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.forgot-password {
  text-align: right;
  margin-bottom: 15px;
}

.forgot-password a {
  font-size: 14px;
  color: #1976d2;
  text-decoration: none;
}

/* DOCTOR MENU */
.doctor-menu {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 50px 0;
}

.menu-card {
  padding: 20px 30px;
  border: 1px solid #1976d2;
  border-radius: 8px;
  text-decoration: none;
  color: #1976d2;
  font-weight: 500;
  transition: 0.2s;
}

.menu-card:hover {
  background: #1976d2;
  color: white;
}
</style>





