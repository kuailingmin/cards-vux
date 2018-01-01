import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import global from './modules/global'
import index from './modules/index'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    global,
    index
  }
})
