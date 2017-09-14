import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/home.vue'
import Page1 from '../pages/page1.vue'
import Page2 from '../pages/page2.vue'

Vue.use(Router)

const routes = [
  {path: '/', component: Home},
  {path: '/page1', component: Page1},
  {path: '/page2', component: Page2}
]

export default new Router({
  mode: 'history',
  routes
})
