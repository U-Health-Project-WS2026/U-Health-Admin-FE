import { createRouter, createWebHistory } from 'vue-router'

// Doctor Views
import DoctorLogin from '@/views/doctor/DoctorLogin.vue'
import DoctorResetPassword from '@/views/doctor/DoctorResetPassword.vue'
import DoctorChangePassword from '@/views/doctor/DoctorChangePassword.vue'
import DoctorDashboard from '@/views/doctor/DoctorDashboard.vue'
import DoctorPatients from '@/views/doctor/DoctorPatients.vue'
import DoctorPatientDetail from '@/views/doctor/DoctorPatientDetail.vue'
import DoctorTreatments from '@/views/doctor/DoctorTreatments.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/doctor/login' },

    { path: '/doctor/login', component: DoctorLogin },
    { path: '/doctor/reset-password', component: DoctorResetPassword },
    { path: '/doctor/change-password', component: DoctorChangePassword },

    { path: '/doctor/dashboard', component: DoctorDashboard },

    { path: '/doctor/patients', component: DoctorPatients },
    { path: '/doctor/patients/:id', component: DoctorPatientDetail, props: true },

    { path: '/doctor/patients/:id/treatments', component: DoctorTreatments, props: true },
  ],
})

export default router

