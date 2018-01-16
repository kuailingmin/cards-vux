import {axios} from '../../js';
import qs from 'qs';
const state = {
  payLink: ''
};
const actions = {
  async init ({commit, rootState}, params) {
    const { result, status: {code, msg} } = await axios.post('/site/recharge', qs.stringify({'balance': params.balance}));
    if (code === '00000') {
      commit('getLink', result.url);
    } else {
      return msg;
    }
  }
};
const mutations = {
  getLink (state, data) {
    state.payLink = data;
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
