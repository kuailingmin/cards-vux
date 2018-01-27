import axios from '../../js';
const state = {
  storeId: '1000255',
  title: '',
  name: '',
  styleColor: '',
  loginImg: '',
  loginLogo: '',
  logo: ''
};

const actions = {
  async getBasicInfo ({commit, rootState}) {
    const {result, status} = await axios.get('/site/index', {params: {store_id: rootState.global.storeId}});
    if (status.code === '00000') {
      commit('setInfo', {
        name: result.store_name,
        logo: result.store_logo,
        loginLogo: result.store_login_logo,
        loginImg: result.store_login_img,
        styleColor: result.style_color
      });
    } else {
      return status.msg;
    }
  }
};
const mutations = {
  setTitle (state, title) {
    state.title = title;
  },
  setInfo (state, data) {
    for (const prop in data) {
      state[prop] = data[prop];
    }
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
