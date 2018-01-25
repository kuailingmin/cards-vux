import {axios} from '../../js';
import qs from 'qs';
const state = {
  initData: [],
  categoryData: [
    {children: []}
  ],
  tempData: [],
  intentionList: {},
  intentionDetail: {}
};
const actions = {
  async init ({commit, rootState}, params) {
    const { result, status: {code, msg} } = await axios.get('/index.php/card-shop', {'params': params});
    if (code === '00000') {
      commit('getInitData', result);
    } else {
      return msg;
    }
  },
  async initCategoryData ({commit, rootState}, params) {
    const { result, status: {code, msg} } = await axios.get('/index.php/card-category', {'params': params});
    if (code === '00000') {
      result.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((subItem, i) => {
            subItem.checked = 0;
          });
        }
      });
      commit('getCategoryData', result);
    } else {
      return msg;
    }
  },
  async initGetIntentionList ({commit, rootState}, params) {
    const { result, status: {code, msg} } = await axios.post('/intention-list/index', qs.stringify(params));
    if (code === '00000') {
      commit('getIntentionList', result);
    } else {
      return msg;
    }
  },
  async submitIntentionList ({commit, rootState}, params) {
    const { status: {code, msg} } = await axios.post('/intention-list/add', qs.stringify(params));
    if (code === '00000') {
    } else {
      return msg;
    }
  },
  async initGetIntentionDetail ({commit, rootState}, params) {
    const { result, status: {code, msg} } = await axios.post('/site/get-intention-info', qs.stringify(params));
    if (code === '00000') {
      commit('getIntentionDetail', result);
    } else {
      return msg;
    }
  }
};
const mutations = {
  getInitData (state, data) {
    state.initData = data;
  },
  getCategoryData (state, data) {
    state.categoryData = data;
  },
  getIntentionList (state, data) {
    state.intentionList = data;
  },
  getTempData (state, data) {
    state.tempData = data;
  },
  getIntentionDetail (state, data) {
    state.intentionDetail = data;
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
