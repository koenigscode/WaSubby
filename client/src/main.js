import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

Vue.prototype.$httpClient = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT
})

Vue.prototype.$httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Authorization')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)

Vue.prototype.$isChrome = window.chrome !== undefined

Vue.config.errorHandler = function (err, vm, info) {
  console.log(err)
  console.log(err.response.status)
  if (err.response && err.response.status === 401) {
    localStorage.removeItem('Authorization')
    router.push('/login')
  }
}
// Check if the user has a selected theme in local storage and set the class accordingly.
const selectedTheme = localStorage.getItem('selectedTheme')
if (selectedTheme) {
  document.documentElement.classList.add(selectedTheme)
}

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
