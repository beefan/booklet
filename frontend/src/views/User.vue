<template lang="pug">
  div(v-if="user")
    p(v-if="!userDataLoaded") {{ loadUserData() }}
    div#user-info
      p Hello {{ user.username }}!
      p your email: {{ user.email }} 
    div#user-booklets
      p Your Booklets
      b-button(v-for="(b, index) in userBooklets" v-bind:key="index") {{ b.title }} {{ b.scenes[0].body}}
    div#user-likes
      p Favorites
      p(v-for="(l, index) in userLikes" v-bind:key="index") {{ l.title }}
</template>

<script>
export default {
  data() {
    return {
      userDataLoaded: false
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userLikes() {
      return this.$store.state.userLikes;
    },
    userBooklets() {
      return this.$store.state.userBooklets;
    }
  },
  methods:{
    loadUserData() {
      this.$store.dispatch("loadUserData", this.user);
      this.userDataLoaded = true;
    }
  }
}
</script>

<style lang="sass">

</style>