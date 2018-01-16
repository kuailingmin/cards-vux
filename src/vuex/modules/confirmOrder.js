import {axios} from '../../js';
import qs from 'qs';
const state = {
  confirmOrderInitData: [],
  orderId: '',
  isCreditEnough: true,
  ids: ''
};
const actions = {
  async confirmOrderInit ({commit, rootState}, params) {
    const { result, status: {code, msg} } = await axios.post('/order/preorder', qs.stringify({'ids': params.ids}));
    if (code === '00000') {
      commit('confirmOrderGetInitData', result);
    } else {
      return msg;
    }
  },
  async isConfirmOrder ({commit, rootState}, params) {
    const { result, status: {code, msg} } = await axios.post('/order/pay', qs.stringify({'ids': params.ids, 'address_id': params.address_id}));
    if (code === '00000') {
      commit('getOrderId', result.order_sn);
    } else {
      return msg;
    }
  }
};
const mutations = {
  confirmOrderGetInitData (state, data) {
    state.confirmOrderInitData = data;
  },
  getOrderId (state, data) {
    state.orderId = data;
  },
  getIsCreditEnough (state, data) {
    state.isCreditEnough = data;
  },
  getIds (state, data) {
    state.ids = data;
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
