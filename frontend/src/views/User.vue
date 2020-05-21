<template lang="pug">
  div(v-if="user")
    div#user-info
      p Hello {{ user.username }}!
      p your email: {{ user.email }} 
    div#user-booklets
      p(v-for="(b, index) in userBooklets" v-bind:key="index") {{ b.title }}
    div#user-likes
      p(v-for="(l, index) in userLikes" v-bind:key="index") {{ l.title }}
</template>

<script>
export default {
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
  created() {
    // this.$store.dispatch('loadUserData');
  }
}
</script>

<style lang="sass">

</style>