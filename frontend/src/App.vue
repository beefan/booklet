<template lang="pug">
  b-container#app
    div
      b-navbar(toggleable="sm" type="light" variant="light")
        b-navbar-toggle(target="nav-text-collapse")
        b-navbar-brand booklet
        b-collapse(id="nav-text-collapse" is-nav)
          b-navbar-nav
            b-nav-text {{ title }} 
              span.author-text by {{ author }}
    Booklet
</template>

<script>
import Booklet from "./components/Booklet.vue";

export default {
  name: "App",
  components: {
    Booklet
  },
  computed: {
    title() {
      return this.$store.state.booklet.title;
    },
    author() {
      return this.$store.state.booklet.author;
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0;
}

.author-text {
  font-size: .8rem;
}
</style>
