import {axios} from '../../js';
import qs from 'qs';
const state = {
  payLink: '',
  rechargeRecords: []
};
const actions = {
  async init ({commit, rootState}, params) {
    const { result, status: {code, msg} } = await axios.post('/site/recharge', qs.stringify(params));
    if (code === '00000') {
      commit('getLink', result.url);
    } else {
      return msg;
    }
  },
  async getRechargeRecords ({commit, rootState}, params) {
    const { result, status: {code, msg} } = await axios.post('/site/recharge-list', qs.stringify(params));
    if (code === '00000') {
      commit('initGetRechargeRecords', result);
    } else {
      return msg;
    }
  },
  async initRemit ({commit, rootState}, params) {
    const { status: {code, msg} } = await axios.post('/site/add-remit', qs.stringify(params));
    if (code === '00000') {
    } else {
      return msg;
    }
  }
};
const mutations = {
  getLink (state, data) {
    state.payLink = data;
  },
  initGetRechargeRecords (state, data) {
    state.rechargeRecords = data;
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
