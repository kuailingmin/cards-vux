import {axios} from '../../js';
import qs from 'qs';
const state = {
  initData: []
};
const actions = {
  async init ({commit, rootState}) {
    const { result, status: {code, msg} } = await axios.get('/cart/index', {params: {}});
    if (code === '00000') {
      commit('getInitData', result);
    } else {
      return msg;
    }
  },
  async addReduce ({commit, rootState}, {num, shopId}) {
    const { status: {msg} } = await axios.post('/cart/add', qs.stringify({'shop_id': shopId, 'num': num}));
    return msg;
  },
  async isSelected ({commit, rootState}, params) {
    const { status: {code, msg} } = await axios.post('/cart/selected', qs.stringify({'ids': params.ids, 'is_selected': params.is_selected}));
    if (code === '00000') {
    } else {
      return msg;
    }
  },
  async deleteList ({commit, rootState}, params) {
    const { status: {code, msg} } = await axios.post('/cart/delete', qs.stringify({'ids': params.ids}));
    if (code === '00000') {
    } else {
      return msg;
    }
  }
};
const mutations = {
  getInitData (state, data) {
    state.initData = data;
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
