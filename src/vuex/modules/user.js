import { axios } from '../../js';
import qs from 'qs';
// 用户 Store
const state = {
  token: '',
  isRead: {},
  userInfo: {}
};
const actions = {
  async login ({commit, rootState}, params) {
    const {result, status: {code, msg}} = await axios.post('/site/login', qs.stringify(params));
    if (code === '00000') {
      localStorage.setItem('token', result.token);
      commit('setToken', result.token);
    } else {
      return msg;
    }
  },
  async register ({commit, rootState}, params) {
    const {status} = await axios.post('/site/register', qs.stringify(params));
    if (status.code === '00000') {
    } else {
      return status.msg;
    }
  },
  async sendCode ({commit, rootState}, params) {
    const {status} = await axios.post('/site/send-code', qs.stringify(params));
    if (status.code !== '00000') {
      return status.msg;
    }
  },
  async getInfo ({commit, rootState}, params) {
    const {result, status: {code, msg}} = await axios.get('/site/user-info', {'params': params});
    if (code === '00000') {
      commit('setInfo', result);
    } else {
      return msg;
    }
  },
  async initGetIsRead ({commit, rootState}, params) {
    const {result, status: {code, msg}} = await axios.get('/site/is-read-by-intention', {'params': params});
    if (code === '00000') {
      commit('getIsRead', result);
    } else {
      return msg;
    }
  },
  async resetPwd ({commit, rootState}, {mobile, password, code}) {
    const {status: {msg}} = await axios.post('/site/reset-pwd', qs.stringify({
      store_id: rootState.global.storeId,
      mobile,
      password,
      code
    }));
    return msg;
  }
};
const mutations = {
  setInfo (state, data) {
    state.userInfo = data;
  },
  setToken (state, data) {
    state.token = data;
  },
  getIsRead (state, data) {
    state.isRead = data;
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
