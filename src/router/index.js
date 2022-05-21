import Vue from 'vue'
import VueRouter from 'vue-router'
import link from '../components/link.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'link',
    component: link
  },
]

const router = new VueRouter({
  routes
})

export default router
