import Vue from "vue";
import Vuex from "vuex";
const apis = require("./apis.js");

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    //variables here to maintain state of
    booklet: [],
    curr: { act: 0, scene: 0, para: 0, sent: 0, word: 0 }
  },
  getters: {
    //vuex supports getter properties for various elements of state
    getBooklet: state => {
      console.log("getter was successfully called from store");
      console.log("booklet value in the store: ");
      console.log(state.booklet);
      return state.booklet;
    },
    getCurr: state => {
      return state.curr;
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
      console.log("setBooklet mutation called succesfully");
      console.log("payload");
      console.log(payload);
      state.booklet = payload;
    },
    setWord(state, word) {
      state.curr.word = word;
    },
    nextPage(state) {
      let totalActs = state.booklet.acts.length - 1;
      let thisAct = state.booklet.acts[state.curr.act];

      let scenesInAct = thisAct.length - 1;
      let thisScene = thisAct[state.curr.scene];

      let paraInScene = thisScene.length - 1;
      let thisPara = thisScene[state.curr.para];

      let sentsInPara = thisPara.length - 1;

      if (state.curr.sent + 1 <= sentsInPara) {
        state.curr = {
          act: state.curr.act,
          scene: state.curr.scene,
          para: state.curr.para,
          sent: state.curr.sent + 1,
          word: 0
        };
      } else if (state.curr.para + 1 <= paraInScene) {
        state.curr = {
          act: state.curr.act,
          scene: state.curr.scene,
          para: state.curr.para + 1,
          sent: 0,
          word: 0
        };
      } else if (state.curr.scene + 1 <= scenesInAct) {
        state.curr = {
          act: state.curr.act,
          scene: state.curr.scene + 1,
          para: 0,
          sent: 0,
          word: 0
        };
      } else if (state.curr.act + 1 <= totalActs) {
        state.curr = {
          act: state.curr.act + 1,
          scene: 0,
          para: 0,
          sent: 0,
          word: 0
        };
      } else {
        //end of booklet
        //restart for testing
        state.curr = { act: 0, scene: 0, para: 0, sent: 0, word: 0 };
      }
    },
    prevPage(state) {
      if (state.curr.sent - 1 >= 0) {
        state.curr = {
          act: state.curr.act,
          scene: state.curr.scene,
          para: state.curr.para,
          sent: state.curr.sent - 1,
          word: 0
        };
      } else if (state.curr.para - 1 >= 0) {
        state.curr = {
          act: state.curr.act,
          scene: state.curr.scene,
          para: state.curr.para - 1,
          sent: 0,
          word: 0
        };
      } else if (state.curr.scene - 1 >= 0) {
        state.curr = {
          act: state.curr.act,
          scene: state.curr.scene - 1,
          para: 0,
          sent: 0,
          word: 0
        };
      } else if (state.curr.act - 1 >= 0) {
        state.curr = {
          act: state.curr.act - 1,
          scene: 0,
          para: 0,
          sent: 0,
          word: 0
        };
      } else {
        state.curr = { act: 0, scene: 0, para: 0, sent: 0, word: 0 };
      }
    }
  },
  actions: {
    //like mutations but async allowed
    //used for api calls
    //this.$store.dispatch('xxx') in child components
    async updateBooklet(state, payload) {
      const vm = this;
      console.log("dispatch successful. calling api get booklet now...");
      apis.getBooklet(payload.id).then(res => {
        vm.commit("setBooklet", res);
        console.log("inside the api then ");
        console.log(res);
      });
    }
  }
});

export default store;
