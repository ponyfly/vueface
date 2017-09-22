import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/home.vue'


Vue.use(Router)

const routes = [
  {path: '/', component: Home}
]

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes
})
