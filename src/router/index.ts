import { createRouter, createWebHistory } from 'vue-router'

import DoctorLogin from '@/views/doctor/DoctorLogin.vue'
import DoctorForgotPassword from "@/views/doctor/DoctorForgotPassword.vue";
import DoctorResetPassword from '@/views/doctor/DoctorResetPassword.vue'
import DoctorDashboard from "@/views/doctor/DoctorDashboard.vue";
import DoctorPatients from "@/views/doctor/DoctorPatients.vue";
import DoctorChangePassword from "@/views/doctor/DoctorChangePassword.vue";
import DoctorBookings from "@/views/doctor/DoctorBookings.vue";
import DoctorDiseases from "@/views/doctor/DoctorDiseases.vue";
import DoctorMedications from "@/views/doctor/DoctorMedications.vue";
import DoctorPatientDetail from "@/views/doctor/DoctorPatientDetail.vue";
import DoctorTreatments from "@/views/doctor/DoctorTreatments.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/doctor/login' },
    { path: '/doctor/login', component: DoctorLogin },
    {path: '/doctor/reset-password',
      name: 'DoctorResetPassword',
      component: () => import('@/views/doctor/DoctorResetPassword.vue')},
    {path: '/doctor/forgot-password', name: 'DoctorForgotPassword',
      component: () => import('@/views/doctor/DoctorForgotPassword.vue')},
    {path: '/doctor/change-current-password', name: 'DoctorChangePassword',
      component: () => import('@/views/doctor/DoctorChangePassword.vue')},
    { path: '/doctor/dashboard', component: DoctorDashboard},
    {path: '/doctor/patients', component: DoctorPatients },
    {path: '/doctor/patient-detail/:id', name: 'DoctorPatientDetail', component: DoctorPatientDetail,
      meta:{requiresAuth: true}  },
    {path: '/doctor/bookings', component: DoctorBookings },
    {path: '/doctor/diseases', component: DoctorDiseases },
    {path: '/doctor/medications', component: DoctorMedications },
    {path: '/doctor/treatments', component: DoctorTreatments }
  ],
})

export default router
