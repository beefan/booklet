<template lang="pug">
  b-container#app
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
  margin-top: 60px;
}
</style>
