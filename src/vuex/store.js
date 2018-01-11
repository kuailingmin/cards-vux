import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import global from './modules/global'
import index from './modules/index'
import products from './modules/products'
import help from './modules/help'
import order from './modules/order'
import cart from './modules/cart'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    global,
    index,
    products,
    help,
    order,
    cart
  }
})
