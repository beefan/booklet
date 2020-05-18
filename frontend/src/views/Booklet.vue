<template lang="pug">
  b-container#flip
    b-row#booklet-info
      div {{ title }}
      div {{ author }} 
    b-row
      div#stage . . .
    b-row#controls
      b-col(xs="10")
        b-form-input.speed-range(type="range" v-model="timing" min="0" max="2" step="0.1")
      b-col(xs="2")
        b-button(:variant="going ? 'danger' : 'success'" @click="controlFlow") 
          b-icon-pause-fill(v-if="going")
          b-icon-play(v-if="!going")
    nav-slider
</template>

<script>
import NavSlider from "../components/navSlider.vue";
export default {
  components: {
    "nav-slider": NavSlider
  },
  data() {
    return {
      going: false,
      changed: false,
      timing: 1,
      wait: 250,
      format: {
          color: '#2c3e50',
          hltColor: 'yellow',
          bgColor: 'white',
          speed: 'normal' // slower, slow, fast, faster (also possible)
        },
      defaultFormat: {
          color: '#2c3e50',
          hltColor: 'yellow',
          bgColor: 'white',
          speed: 'normal' // slower, slow, fast, faster (also possible)
        }
    };
  },
  methods: {
    change() {
      this.changed = true;
    },
    prev() {
      this.change();
      this.$store.commit("prevPage");
    },
    next() {
      this.change();
      this.$store.commit("nextPage");
    },
    setWord(word) {
      this.$store.commit("setWord", word);
    },
    controlFlow() {
      this.going = !this.going;
      if (this.going) {
        this.updateCanvas();
      }
    },
    updateCanvas() {
      //end of booklet
      if (this.curr.scene < 0) {
        //visually notify and return
        this.page = "end";
        return;
      }

      if (this.curr.sent === 0) {
        this.showPagePause().then(() => this.runThroughSentence());
      }else {
        this.runThroughSentence();
      }

      // if this is the first word of a new scene
      // we should just pause and let the user click 
      // the next. Or, they can turn on autoplay.
      // TODO ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
    },
    runThroughSentence() {
      let v = this;

      if (v.going) {
        let words = v.pageText.split(" ");

        const timer = () =>
          new Promise(resolve => setTimeout(resolve, v.pause));

        const focusWord = word => {
          if (!v.arraysEqual(words, v.pageText.split(" "))) {
            v.change();
          }

          timer().then(() => {
            v.setWord(word);
            document.getElementById("stage").innerHTML = v.createPageElement(
              words,
              word
            );
            if (!v.going) {
              return;
            } else if (word + 1 < words.length) {
              if (!v.changed) {
                focusWord(word + 1);
              } else {
                v.changed = false;
                v.setWord(0);
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
    arraysEqual(a, b) {
      let result = true;
      a.forEach((val, index) => {
        if (val !== b[index]) {
          result = false;
        }
      });
      return result;
    },
    showPagePause() {
      document.getElementById("stage").innerHTML = "<div id='pause-it'> . . . </div>";
      return new Promise(resolve => setTimeout(resolve, this.pause));
    },
    createPageElement(words, i) {
      const scene = this.scenes[this.curr.scene];
      this.setThisFormat(scene.format);

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
     return  `<p style="color:${this.format.color}; background-color:${this.format.bgColor}"> 
                ${frontString} 
                <span style="background-color:${this.format.hltColor}">
                  ${words[i]}
                </span> 
                ${backString}
                </p>`;
    },
    setThisFormat(format) {
        this.format.color = format.color ? format.color : this.defaultFormat.color;
        this.format.bgColor = format.bgColor ? format.bgColor : this.defaultFormat.bgColor;
        this.format.hltColor = format.hltColor ? format.hltColor : this.defaultFormat.hltColor;
        this.format.speed = format.speed ? format.speed : this.defaultFormat.speed;
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
    scenes() {
      return this.$store.state.booklet.scenes;
    },
    pause() {
      let weight = 1;
      switch(this.format.speed) {
        case 'slow':
          weight = .9;
          break;
        case 'slower':
          weight = .8;
          break;
        case 'fast':
          weight = 1.1;
          break;
        case 'faster':
          weight = 1.2;
          break;
        case 'normal':
        default:
          break;
      }

      return (2 - this.timing) * this.wait * weight;
    },
    pageText() {
      if (this.curr.scene < 0) {
        return "";
      }
      const scene = this.scenes[this.curr.scene];
      const sentences = this.$store.state.splitP(scene.text);
      return sentences[this.curr.sent];
    },
  },
  created() {
    if (!this.scenes) {
      this.$store.dispatch('loadBooklet', {id: 4})
    }
  }
};
</script>

<style lang="sass">
#stage
  width: 100%
  font-size: 6.5vw
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
  margin-left: 2%
  margin-right: 2%
</style>
