<template lang="pug">
b-row#slider-parent
  div#history-slider
    div.slider-item(v-for="page in pages" :class="getClass(page)" :id="page.id" @click="setPage(page)")
      p {{ renderPage(page) }}
</template>

<script>
export default {
  methods: {
    getClass(page) {
      return page.id === this.current ? "selected-page" : "";
    },
    setPage(page) {
      this.$store.commit("navigate", {
        scene: Number(page.id.substring(2)),
        sent: 0
      });
      this.scrollTo(this.current);
    },
    toggleReading() {
      this.$store.commit("toggleRead");
    },
    scrollTo(id) {
      let elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView();
      }
    },
    renderPage(page) {
      let s = Number(page.id.substring(2));
      return `Scene: ${s + 1} - ${page.body}`;
    }
  },
  computed: {
    index() {
      return this.$store.state.curr;
    },
    current() {
      let v = this;
      if (!v.index) {
        return "00";
      }
      let curr = `SN${v.index.scene}`;
      v.scrollTo(curr);
      return curr;
    },
    isReading() {
      return this.$store.state.isReading;
    },
    scenes() {
      return this.$store.state.booklet.scenes;
    },
    pages() {
      let v = this;
      if (!v.scenes) {
        return [];
      }
      let pages = [];
      v.scenes.forEach((scene, index) => {
        pages.push({ id: `SN${index}`, body: scene.body })
      });
      return pages;
    }
  },
  mounted() {
    this.scrollTo(this.current);
  }
};
</script>

<style lang="sass">
#slider-parent
  position: fixed
  bottom: 80px
  width: 100%

#history-slider
  position: relative
  display: flex
  flex-flow: row
  overflow-x: auto
  padding-top: 2%
  padding-bottom: 2%
  box-shadow: 1px 1px 2px #343a40 inset, -1px -1px 2px #343a40 inset


.slider-item
  color: white
  background: #343a40
  min-width: 12.5%
  height: 50px
  margin: 2px
  border-radius: 3px
  font-size: .6rem
  overflow: hidden
.slider-item:hover
  opacity: 60%
.selected-page
  box-shadow: 1px 1px 3px yellow inset, -1px -1px 3px yellow inset
</style>
