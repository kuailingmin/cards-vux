// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import FastClick from 'fastclick'
import store from './vuex/store'
import { sync } from 'vuex-router-sync'
import { WechatPlugin, BusPlugin } from 'vux'
import * as api from './api/api'
import './js/rem.js'
FastClick.attach(document.body)
if (process.env.NODE_ENV === 'development') {
  Vue.config.productionTip = false
  Vue.config.devtools = true
}
Vue.prototype.$api = api
Vue.use(WechatPlugin)
Vue.use(Vuex)
Vue.use(BusPlugin)
if (!Vue.prototype.$vux) {
  Vue.prototype.$vux = Vue.$vux
}
sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
