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
        act: Number(page.id.substring(0, 1)),
        scene: Number(page.id.substring(1, 2)),
        para: Number(page.id.substring(2, 3)),
        sent: Number(page.id.substring(3, 4))
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
      let a = Number(page.id.substring(0, 1));
      let s = Number(page.id.substring(1, 2));
      let p = Number(page.id.substring(2, 3));
      let se = Number(page.id.substring(3, 4));

      if (p === 0 && se === 0) {
        return `Act: ${a + 1}, Scene: ${s + 1} - ${page.text}`;
      }
      return page.text;
    }
  },
  computed: {
    index() {
      return this.$store.state.curr;
    },
    current() {
      let v = this;
      if (!v.index) {
        return "0000";
      }
      let curr = `${v.index.act}${v.index.scene}${v.index.para}${v.index.sent}`;
      v.scrollTo(curr);
      return curr;
    },
    isReading() {
      return this.$store.state.isReading;
    },
    acts() {
      return this.$store.state.booklet.acts;
    },
    pages() {
      let v = this;
      if (!v.acts) {
        return [];
      }
      let pages = [];
      let ac = 0;
      let sn = 0;
      let pr = 0;
      let st = 0;

      v.acts.forEach((act, index) => {
        ac = index;
        act.forEach((scene, index) => {
          sn = index;
          scene.forEach((para, index) => {
            pr = index;
            para.forEach((sent, index) => {
              st = index;
              let id = `${ac}${sn}${pr}${st}`;
              pages.push({ id: id, text: sent });
            });
          });
        });
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
