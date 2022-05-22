import Vue from 'vue'
import VueRouter from 'vue-router'
import linkgame from '../components/linkgame.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'linkgame',
    component: linkgame
  },
]

const router = new VueRouter({
  routes
})

export default router
