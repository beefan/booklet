<template lang="pug">
  b-container#flip
    b-row
      div#stage
    b-row#controls
      b-col(sm="2")
        label(for="speed-range") speed
      b-col(sm="8")
        b-form-input.speed-range(type="range" v-model="timing" min="0" max="2" step="0.1")
      b-col(sm="2")
        b-button(:variant="going ? 'danger' : 'success'" @click="controlFlow") 
          b-icon-pause-fill(v-if="going")
          b-icon-play(v-if="!going")
</template>

<script>
export default {
  data() {
    return {
      going: false,
      timing: 1,
      wait: 250,
      word: "begin",
      page: "begin the first page",
      curr: { act: 0, scene: 0, para: 0, sent: 0, word: 0 }
    };
  },
  methods: {
    controlFlow() {
      this.going = !this.going;
      if (this.going) {
        this.updateCanvas();
      }
    },
    updateCanvas() {
      //end of booklet
      if (this.curr.act < 0) {
        //visually notify and return
        this.page = "end";
        return;
      }

      if (this.curr.para == 0) {
        console.log('showing page pause')
        this.showPagePause().then(() => this.runThroughSentence());
      } else {
        this.runThroughSentence();
        console.log('running through sentence')
      }
    },
    runThroughSentence() {
      let v = this;

      if (v.going) {
        let words = v.sceneText.split(" ");
        let timeFunc = () =>
          new Promise(resolve => setTimeout(resolve, v.pause));

        let focusWord = word => {
          timeFunc().then(() => {
            v.curr.word = word;
            document.getElementById("stage").innerHTML = v.createPageElement(
              words,
              word
            );
            if (word + 1 < words.length) {
              focusWord(word + 1);
            } else {
              //set up next page
              v.curr = v.next;
              v.updateCanvas();
            }
          });
        };
        focusWord(v.curr.word);
      }
    },
    showPagePause() {
      document.getElementById("stage").innerHTML = " ";
      return new Promise(resolve => setTimeout(resolve, this.pause * 4));
    },
    createPageElement(words, i) {
      let frontString = words
        .filter((value, index) => {
          if (index < i) {
            return value;
          }
        })
        .join(" ");
      let backString = words
        .filter((value, index) => {
          if (index > i) {
            return value;
          }
        })
        .join(" ");
      let sceneText =
        frontString +
        ' <span class="highlighted-word">' +
        words[i] +
        "</span> " +
        backString;
      return sceneText;
    }
  },
  computed: {
    title() {
      return this.$store.state.booklet.title;
    },
    author() {
      return this.$store.state.booklet.author;
    },
    acts() {
      return this.$store.state.booklet.acts;
    },
    pause() {
      return this.timing * this.wait;
    },
    sceneText() {
      if (this.curr.act < 0) {
        return "";
      }
      let sentence = this.acts[this.curr.act][this.curr.scene][this.curr.para][
        this.curr.sent
      ];
      return sentence;
    },
    next() {
      let totalActs = this.acts.length - 1;
      let thisAct = this.acts[this.curr.act];

      let scenesInAct = thisAct.length - 1;
      let thisScene = thisAct[this.curr.scene];

      let paraInScene = thisScene.length - 1;
      let thisPara = thisScene[this.curr.para];

      let sentsInPara = thisPara.length - 1;
      //let thisSentence = thisPara[this.curr.sent];

      if (this.curr.sent + 1 <= sentsInPara) {
        return {
          act: this.curr.act,
          scene: this.curr.scene,
          para: this.curr.para,
          sent: this.curr.sent + 1,
          word: 0
        };
      } else if (this.curr.para + 1 <= paraInScene) {
        return {
          act: this.curr.act,
          scene: this.curr.scene,
          para: this.curr.para + 1,
          sent: 0,
          word: 0
        };
      } else if (this.curr.scene + 1 <= scenesInAct) {
        return {
          act: this.curr.act,
          scene: this.curr.scene + 1,
          para: 0,
          sent: 0,
          word: 0
        };
      } else if (this.curr.act + 1 <= totalActs) {
        return {
          act: this.curr.act + 1,
          scene: 0,
          para: 0,
          sent: 0,
          word: 0
        };
      } else {
        //end of booklet
        //restart for testing
        return { act: 0, scene: 0, para: 0, sent: 0, word: 0 };
      }
    }
  },
  created() {
    this.$store.dispatch("updateBooklet", { id: 4 });
  }
};
</script>

<style lang="sass">
#stage
  width: 100%
  height: 80%
  .highlighted-word
    background-color: yellow
#flip
  padding: 0
  margin: 0
</style>
