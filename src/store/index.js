import Vue from 'vue'
import Vuex from 'vuex'

const state = {
  blocksCount: 20,
  blockWidth: 100,
  blockHeight: 100,
}

const mutations = {
  SET_BLOCK_COUNT(state, payload) {
    state.blocksCount = payload
  }
}

Vue.use(Vuex);

export const store = new Vuex.Store({
  state,
  mutations
})

