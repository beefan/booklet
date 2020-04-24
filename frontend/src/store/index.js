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
      console.log('getter was successfully called from store');
      console.log('booklet value in the store: ');
      console.log(state.booklet);
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
    setBooklet(state, payload) {
      console.log('setBooklet mutation called succesfully');
      console.log('payload');
      console.log(payload);
      state.booklet = payload;
    }
  },
  actions: {
    //like mutations but async allowed
    //used for api calls
    //this.$store.dispatch('xxx') in child components
    async updateBooklet(state, payload) {
      const vm = this;
      console.log('dispatch successful. calling api get booklet now...');
      apis.getBooklet(payload.id).then( res => {
        vm.commit('setBooklet', res);
        console.log('inside the api then ');
        console.log(res);
      });

    }
  }
});

export default store;