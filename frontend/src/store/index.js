import Vue from "vue";
import Vuex from "vuex";
const apis = require("./apis.js");

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    //variables here to maintain state of
    booklet: []
  },
  getters: {
    //vuex supports getter properties for various elements of state
    getBooklet: state => {
      return state.booklet;
    }
  },
  mutations: {
    //only way to change state in vuex is with mutations
    //store.commit('increment') to call this in other components
    //can pass another arg such as   increment (state, n) {
    //https://vuex.vuejs.org/guide/mutations.html
    // increment (state) {
    //   state.count++
    // },
    updateBooklet(state, payload) {
      state.booklet = apis.getBooklet(payload.id);
    }
  },
  actions: {
    //like mutations but async allowed
    //used for api calls
    //this.$store.dispatch('xxx') in child components
  }
});

export default store;