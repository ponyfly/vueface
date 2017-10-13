import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/home.vue'
import Upload from '../pages/upload.vue'


Vue.use(Router)

const routes = [
  {path: '/', component: Upload}
]

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes
})
