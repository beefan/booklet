import Vue from "vue";
import Vuex from "vuex";
const apis = require("./apis.js");

Vue.use(Vuex);
//return ;
const store = new Vuex.Store({
  state: {
    booklet: [],
    isReading: false,
    curr: { scene: 0, sent: 0, word: 0 },
    splitP: function(scene) {
      // (?<=(?<!p.m|a.m|Dr|Mr|Mrs)[.?!"] )/)
      // below solution does not handle p.m. Mr. i.e. ... in sentence
      // look behinds don't work in javascript?
      let sentences = scene.match(/[^.?!]+[.!?]+[\])'"`’”]*/g);
      return sentences ? sentences : [scene];
    }
  },
  getters: {
    getBooklet: state => {
      return state.booklet;
    },
    getCurr: state => {
      return state.curr;
    },
    isReading: state => {
      return state.isReading;
    }
  },
  mutations: {
    navigate(state, payload) {
      state.curr = {
        scene: payload.scene,
        sent: payload.sent,
        word: 0
      };
    },
    toggleRead(state) {
      state.isReading = !state.isReading;
    },
    setBooklet(state, payload) {
      state.booklet = payload;
    },
    setWord(state, word) {
      state.curr.word = word;
    },
    nextPage(state) {
      let totalScenes = state.booklet.scenes.length - 1;
      let thisScene = state.booklet.scenes[state.curr.scene];

      let sentInScene = state.splitP(thisScene.text).length - 1;

      if (state.curr.sent < sentInScene) {
        state.curr = {
          scene: state.curr.scene,
          sent: state.curr.sent + 1,
          word: 0
        };
      } else if (state.curr.scene < totalScenes) {
        state.curr = {
          scene: state.curr.scene + 1,
          sent: 0,
          word: 0
        };
      } else {
        state.curr = { scene: 0, sent: 0, word: 0 };
      }
    },
    prevPage(state) {
      if (state.curr.sent - 1 >= 0) {
        state.curr = {
          scene: state.curr.scene,
          sent: state.curr.sent - 1,
          word: 0
        };
      } else if (state.curr.scene - 1 >= 0) {
        state.curr = {
          scene: state.curr.scene - 1,
          sent: 0,
          word: 0
        };
      } else {
        state.curr = { scene: 0, sent: 0, word: 0 };
      }
    }
  },
  actions: {
    async loadBooklet(state, payload) {
      const vm = this;
      apis.getBooklet(payload.id).then(res => {
        vm.commit("setBooklet", res);
      });
    },
    saveBooklet(state, payload) {
      apis.saveBooklet(payload);
    }
  }
});

export default store;
