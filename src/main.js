import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

const app = new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

if (process.env === 'DEV') window.app = app