<template>
  <div class="page">
    <header class="top">
      <h1>Doctor Dashboard</h1>
      <p class="muted">Overview of today's work (mock data).</p>
    </header>

    <section class="cards">
      <div class="card">
        <h3>Today’s Appointments</h3>
        <div class="value">{{ stats.todayAppointments }}</div>
      </div>

      <div class="card">
        <h3>Open Slots</h3>
        <div class="value">{{ stats.openSlots }}</div>
      </div>

      <div class="card">
        <h3>Patients</h3>
        <div class="value">{{ stats.patients }}</div>
      </div>
    </section>

    <section class="actions">
      <router-link class="btn" to="/doctor/patients">Patient Management</router-link>
      <router-link class="btn secondary" to="/doctor/change-password">Change Password</router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
const stats = {
  todayAppointments: 6,
  openSlots: 3,
  patients: 42,
}
</script>

<style scoped>
.page { max-width: 920px; margin: 32px auto; padding: 0 16px; }
.top { margin-bottom: 18px; }
.muted { color: #666; margin: 6px 0 0; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 18px 0; }
.card { border: 1px solid #e5e5e5; border-radius: 10px; padding: 14px; }
.value { font-size: 28px; font-weight: 700; margin-top: 8px; }
.actions { display: flex; gap: 10px; margin-top: 18px; }
.btn { display:inline-block; padding: 10px 12px; border-radius: 8px; border: 1px solid #222; text-decoration:none; color:#222; }
.btn.secondary { border-color:#999; color:#444; }
@media (max-width: 860px) { .cards { grid-template-columns: 1fr; } }
</style>

