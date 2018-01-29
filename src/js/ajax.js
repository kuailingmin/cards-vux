import { AjaxPlugin } from 'vux';
import store from '../vuex/store';
import router from '../router/index';
const axios = AjaxPlugin.$http;
const axiosObejct = axios.create({
  timeout: 30000,
  responseType: 'json',
  baseURL: process.env.NODE_ENV === 'development' ? 'http://cardshopapi.koudaiqifu.cn' : ''
});
axiosObejct.interceptors.request.use(
  config => {
    config.headers = Object.assign(config.headers ? config.headers : {}, {
      token: store.state.user.token
    });
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
axiosObejct.interceptors.response.use(
  res => {
    return res.data;
  },
  error => {
    if (error.response) {
      let {status, data: {status: {code}}} = error.response;
      switch (status) {
        case 400:
          return new Error('无效请求：\n');
        case 401:
          if (code === '110') {
            localStorage.setItem('token', '');
            store.commit('user/setToken', '');
            router.push('/login');
          }
          break;
        case 403:
          if (code === '110') {
            localStorage.setItem('token', '');
            store.commit('user/setToken', '');
            router.push('/login');
          }
          break;
        case 404:
          return new Error('404访问的地址不存在');
      }
    }
    return Promise.reject(error.response.data);
  }
);
export default axiosObejct;
