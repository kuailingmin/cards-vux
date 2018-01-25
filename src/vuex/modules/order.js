import { axios } from '../../js';
import qs from 'qs';
const state = {
  orders: [],
  page: 1
};
const actions = {
  async getOrders ({ commit, state }, { page, orderStatus }) {
    const orders = [...state.orders];
    const { result, status } = await axios.post('/order/get-order-list', qs.stringify({ 'page': state.page, 'order_status': orderStatus }));
    if (status.code === '00000') {
      orders.push(...result.list);
      commit('setOrders', { orders, page: state.page++ });
    } else {
      return status.msg;
    }
  }
};
const mutations = {
  setOrders (state, data) {
    state.orders = data.orders;
    state.page = data.page;
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
