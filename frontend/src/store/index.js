import Vue from "vue";
import Vuex from "vuex";
const apis = require("./apis.js");

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    booklet: [],
    curr: { act: 0, scene: 0, para: 0, sent: 0, word: 0 }
  },
  getters: {
    getBooklet: state => {
      return state.booklet;
    },
    getCurr: state => {
      return state.curr;
    }
  },
  mutations: {
    setBooklet(state, payload) {
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
    async updateBooklet(state, payload) {
      const vm = this;
      apis.getBooklet(payload.id).then(res => {
        vm.commit("setBooklet", res);
      });
    }
  }
});

export default store;
