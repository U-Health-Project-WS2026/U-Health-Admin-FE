import { createRouter, createWebHistory } from 'vue-router'

import DoctorLogin from '@/views/doctor/DoctorLogin.vue'
import DoctorResetPassword from '@/views/doctor/DoctorResetPassword.vue'
import DoctorRegister from "@/views/doctor/DoctorRegister.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/doctor/login' },
    { path: '/doctor/login', component: DoctorLogin },
    { path: '/doctor/reset-password', component: DoctorResetPassword },
    { path: '/doctor/register', component: DoctorRegister },
  ],
})

export default router
