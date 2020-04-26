<template lang="pug">
div
  b.row#booklet-header
    h3 booklet:
    h2 {{ title }}
    p ( by: {{ author }} )
  hr
  b-container#flip
    b-row
      div#stage(v-if="going") {{ page }}
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
      let v = this;

      //end of booklet
      if (v.curr.act < 0) {
        //visually notify and return
        v.page = "end";
        return;
      }
      let pause = 2000 * v.timing;

      //if going, and first scene of an act//new act
      if (v.going) {
        setTimeout(function() {
          v.page = v.sceneText;
          v.curr = v.next;
          v.updateCanvas();
        }, pause);
      }
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
    sceneText() {
      if (this.curr.act < 0) {
        return "";
      }
      let sentence = this.acts[this.curr.act]
                              [this.curr.scene]
                              [this.curr.para]
                              [this.curr.sent];
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
#booklet-header
  h2
    margin-left: 2%
    margin-right: 2%
  h3
    font-style: italic
#stage
  width: 100%
  height: 80%
</style>
