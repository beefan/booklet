<template lang="pug">
  b-container#flip
    b-row#booklet-info
      div {{ title }}
      div {{ author }} 
      div pos(act: {{ curr.act + 1}} | scene: {{ curr.scene + 1 }} | paragraph: {{ curr.para + 1 }} | sentence: {{ curr.sent + 1}})
    b-row
      div#stage
    nav-slider#controls
    b-row#controls
      b-col(xs="2")
        b-button(variant="dark" @click="prev()")
          b-icon-chevron-double-left
      b-col(xs="6")
        b-form-input.speed-range(type="range" v-model="timing" min="0" max="2" step="0.1")
      b-col(xs="2")
        b-button(:variant="going ? 'danger' : 'success'" @click="controlFlow") 
          b-icon-pause-fill(v-if="going")
          b-icon-play(v-if="!going")
      b-col(xs="2")
        b-button(variant="dark" @click="next()")
          b-icon-chevron-double-right
</template>

<script>
import NavSlider from '../components/navSlider.vue'
export default {
  components: {
    'nav-slider': NavSlider
  },
  data() {
    return {
      going: false,
      timing: 1,
      wait: 250,
      word: "begin",
      page: "begin the first page",
      changed: false
    };
  },
  methods: {
    change() {
      this.changed = true;
    },
    prev() {
      this.change();
      this.$store.commit('prevPage')
    },
    next() {
      this.change();
      this.$store.commit('nextPage')
    },
    setWord(word) {
      this.$store.commit('setWord', word)
    },
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

      if (this.curr.para == 0 && this.curr.sent == 0 && this.curr.word == 0) {
        this.showPagePause().then(() => this.runThroughSentence());
      } else {
        this.runThroughSentence();
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
            v.setWord(word);
            document.getElementById("stage").innerHTML = v.createPageElement(
              words,
              word
            );
            if (!v.going) {
              return;
            }else if (word + 1 < words.length) {
              if (!v.changed){
                focusWord(word + 1);
              }else {
                v.changed = false;
                v.setWord(0)
                v.updateCanvas();
              }
            } else {
              //set up next page
              v.next();
              v.updateCanvas();
            }
          });
        };

        focusWord(v.curr.word);
      }
    },
    showPagePause() {
      document.getElementById("stage").innerHTML = '<b-icon-circle-half id="pause-it" />';
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
    curr() {
      return this.$store.state.curr;
    },
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
  font-size: 7.5vw
  .highlighted-word
    background-color: yellow
  margin: 5%
#flip
  padding: 0
  margin: 0
#booklet-info
  display: flex
  flex-flow: column
  justify-content: center
  margin: 2%
  border-bottom: 2px solid black
#pause-it
  margin: 40%
  font-size: 3rem
#controls
  position: fixed
  bottom: 0
  width: 100%
</style>
