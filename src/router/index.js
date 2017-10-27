import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/home.vue'
import Theme from '../pages/theme.vue'
import ChoosePhoto from '../pages/choosePhoto.vue'

Vue.use(Router)

const routes = [
  {path: '/', component: Home},
  {name: 'theme', path: '/theme', component: Theme},
  {name: 'choosePhoto', path: '/choosePhoto', component: ChoosePhoto}
]

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes
})
