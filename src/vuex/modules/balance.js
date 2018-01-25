import { axios } from '../../js';
const state = {
  recordList: []
};
const actions = {
  async getRecords ({commit, rootState}, params) {
    const {result, status: {code, msg}} = await axios.get('/site/balance-info', {'params': params});
    if (code === '00000') {
      commit('setList', result);
    } else {
      return msg;
    }
  }
};
const mutations = {
  setList (state, data) {
    state.recordList = data;
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
