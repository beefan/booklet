<template lang="pug">
  b-container#app
    div
      b-navbar(toggleable="sm" type="dark" variant="dark")
        b-navbar-toggle(target="nav-text-collapse")
        b-navbar-brand booklet
        b-collapse(id="nav-text-collapse" is-nav)
          b-navbar-nav
            b-nav-item Home 
            b-nav-item About
    Booklet
</template>

<script>
import Booklet from "./components/Booklet.vue";

export default {
  name: "App",
  components: {
    Booklet
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
</style>
