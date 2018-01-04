import {axios} from '../../js'
const state = {
  inited: false,
  list: []
}

const actions = {
  async getProducts ({
    commit,
    rootState
  }, {page, pageSize, category, orderType, order}) {
    const {
      result,
      status: {
        code,
        msg
      }
    } = await axios.get('/card-shop', {
      params: {
        store_id: rootState.global.storeId,
        page,
        page_size: pageSize,
        category_id: category,
        order_by_type: orderType,
        order_by: order
      }
    })
    if (code === '00000') {
      commit('pushList', result.list)
    } else {
      return new Error(msg)
    }
  },
  async loadMore ({commit, rootState}, {page, pageSize}) {

  }
}

const mutations = {
  pushList (state, data) {
    if (data.length > 0) {
      state
        .list
        .push(...data)
    }
  },
  resetList (state) {
    state.list = []
  },
  setInit (state, data) {
    state.inited = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
