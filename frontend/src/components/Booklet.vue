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
      page: "begin the first page"
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
      let acts = this.acts[0];
      let scenes = acts[0];
      let counter = 0;
      let pause = 2000 - 2000*this.timing;

      for (let scene of scenes) {
      setTimeout(() =>
        {
          this.page = counter + ') ' + scene;
        }, pause);
        counter++;
      }
      counter = 0;
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
