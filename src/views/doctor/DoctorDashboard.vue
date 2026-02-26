<template>
  <div class="page">

    <nav class="navbar">
      <div class="nav-left">
        <router-link to="/doctor/dashboard" class="nav-link">Dashboard</router-link>
        <router-link to="/doctor/patients" class="nav-link">Patients</router-link>
        <router-link to="/doctor/diseases" class="nav-link">Diseases</router-link>
        <router-link to="/doctor/medications" class="nav-link">Medications</router-link>
        <router-link to="/doctor/treatments" class="nav-link">Treatments</router-link>
        <router-link to="/doctor/change-password" class="nav-link">Change Password</router-link>
      </div>

      <button class="logout-btn" @click="logout">
        Logout
      </button>
    </nav>

    <section class="hero">
      <h1>Doctor Dashboard</h1>
      <p>Overview of your activity in U-Health.</p>
    </section>

    <section class="cards">

      <div class="card">
        <h3>Total Patients</h3>
        <p class="number">42</p>
      </div>

      <div class="card">
        <h3>Open Treatments</h3>
        <p class="number">7</p>
      </div>

      <div class="card">
        <h3>Appointments Today</h3>
        <p class="number">5</p>
      </div>

    </section>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/doctor/login')
  }
})

function logout() {
  localStorage.removeItem('token')
  router.push('/doctor/login')
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  gap: 18px;
}

.nav-link {
  text-decoration: none;
  color: #1976d2;
  font-weight: 500;
}

.nav-link:hover {
  text-decoration: underline;
}

/* LOGOUT */
.logout-btn {
  padding: 6px 12px;
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.logout-btn:hover {
  background-color: #c62828;
}

/* HERO */
.hero {
  text-align: center;
  padding: 60px 20px 40px;
}

.hero h1 {
  color: #1976d2;
  font-size: 34px;
  margin-bottom: 10px;
}

.hero p {
  color: #555;
}

/* CARDS */
.cards {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 30px;
}

.card {
  width: 220px;
  padding: 25px;
  border-radius: 8px;
  background: white;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}

.card h3 {
  color: #1976d2;
  margin-bottom: 15px;
  font-size: 16px;
}

.number {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

@media (max-width: 900px) {
  .cards {
    flex-direction: column;
    align-items: center;
  }
}
</style>
