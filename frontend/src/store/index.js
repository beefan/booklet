import Vue from "vue";
import Vuex from "vuex";
const apis = require("./apis.js");

Vue.use(Vuex);
//return ;
const store = new Vuex.Store({
  state: {
    user: {
      id: 1,
      likes: [],
      booklets: []
    },
    booklet: {},
    editBooklet: {},
    isReading: false,
    curr: { scene: 0, sent: 0, word: 0 },
    splitP: function(scene) {
      let sentences = scene.match(/[^.?;!]+[.!;?]+[\])'"`’”]*/g);
      if (sentences) {
        // if a sentence ends in a whoopsie, combine it with the next sentence.
        const whoopsies = [
          "Mr.",
          "Dr.",
          "Ms.",
          "Mrs.",
          "p.",
          "m.",
          "p.m.",
          "a.m.",
          "a.",
          "P.",
          "www."
        ];
        const priors = ["com"];
        const result = [];

        sentences.forEach((sent, index) => {
          const sentArr = sent.split(" ");
          const lastWord = sentArr[sentArr.length - 1];
          const firstWord = sentArr[0];
          if (whoopsies.includes(lastWord)) {
            console.log("sentence ends in " + lastWord);
            if (sentences[index + 1]) {
              sentences[index + 1] = sent + sentences[index + 1];
            }
          } else if (priors.includes(firstWord)) {
            console.log("sentence begins in " + firstWord);
            result[result.length - 1] = result[result.length - 1] + sent;
          } else {
            result.push(sentences[index]);
          }
        });
        return result;
      }
      return [scene];
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
    },
    getEditBooklet: state => {
      return state.editBooklet;
    },
    getUserLikes: state => {
      return state.userLikes;
    },
    getUserBooklets: state => {
      return state.userBooklets;
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
    setEditBooklet(state, payload) {
      console.log("set edit booklet");
      state.editBooklet = payload;
    },
    setUserBooklets(state, payload) {
      state.userBooklets = payload;
    },
    setUserLikes(state, payload) {
      state.userLikes = payload;
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
      apis.saveBooklet(payload, state.user.id);
    },
    savePdfAsBooklet(state, payload) {
      apis.savePdfAsBooklet(payload, state.user.id);
    },
    async loadUserData(state) {
      const vm = this;
      console.log(state.userId);
      apis.getUserLikes(4).then(res => {
        vm.commit("setUserLikes", res);
      });
      apis.getUserBooklets(4).then(res => {
        vm.commit("setUserBooklets", res);
      });
    }
  }
});

export default store;
