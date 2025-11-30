import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'HomeView', component: () => import('@/views/HomeView.vue') },
  { path: '/map', name: 'MapView', component: () => import('@/views/MapView.vue') },
  { path: '/route', name: 'ItineraryView', component: () => import('@/views/ItineraryView.vue') },
  { path: '/spot', name: 'AttractionsRecommendView', component: () => import('@/views/AttractionsRecommendView.vue') },
  { path: '/setting', name: 'UserCenterView', component: () => import('@/views/UserCenterView.vue') },
  { path: '/about', name: 'AboutView', component: () => import('@/views/AboutView.vue') },
  { path: '/login', name: 'LoginView', component: () => import('@/views/LoginView.vue') },
  { path: '/signin', name: 'SigninView', component: () => import('@/views/SigninView.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
