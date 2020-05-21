<template lang="pug">
  b-container#app
    div#nav
      b-navbar(toggleable="sm" type="dark" variant="dark")
        b-navbar-toggle(target="nav-text-collapse")
        b-navbar-brand booklet
        b-collapse(id="nav-text-collapse" is-nav)
          b-navbar-nav(v-if="loggedIn")
            b-nav-item(:to="{path: '/user'}") Home
            b-nav-item(:to="{path: '/create-new'}") Create
            b-nav-item(@click="logout") Logout
          b-navbar-nav(v-if="!loggedIn")
            b-nav-item(:to="{path: '/login'}") Login
    router-view
</template>
<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.user;
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0px;
}

#nav {
  width: 100%;

  a {
    font-weight: bold;
    color: white;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
