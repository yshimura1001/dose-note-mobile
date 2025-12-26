import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/record'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/record'
      },
      {
        path: 'record',
        component: () => import('@/views/RecordPage.vue')
      },
      {
        path: 'view',
        component: () => import('@/views/ViewPage.vue')
      },
      {
        path: 'kusurin',
        component: () => import('@/views/KusurinAIPage.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/SettingsPage.vue')
      }
    ]
  },
  {
    path: '/settings/medicines',
    component: () => import('@/views/MedicineManagementPage.vue')
  },
  {
    path: '/settings/tasks',
    component: () => import('@/views/TaskManagementPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
