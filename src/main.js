import Vue from 'vue'
import ElementUI from 'element-ui'
import VueSimpleAlert from 'vue-simple-alert'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import App from './App.vue'

/* eslint-disable */
Vue.use(ElementUI)
Vue.use(VueSimpleAlert)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
