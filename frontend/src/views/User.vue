<template lang="pug">
  div(v-if="user")
    p(v-if="!userDataLoaded") {{ loadUserData() }}
    b-dropdown.user-booklets(text="Your Booklets" block variant="primary" class="m-2" menu-class="w-100")
      div(v-for="(b, index) in userBooklets" v-bind:key="index")
        b-dropdown-item(@click="loadBooklet(b)") 
          p.title {{ b.title }} 
          p.snippet {{ b.scenes[0].body }}
        b-dropdown-divider
    b-dropdown.user-booklets(text="Favorites" block variant="primary" class="m-2" menu-class="w-100")
      div(v-for="(l, index) in userLikes" v-bind:key="index")
        b-dropdown-item(@click="loadBooklet(b)") 
          p.title {{ l.title }} 
          p.snippet {{ l.scenes[0].body }}
        b-dropdown-divider
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
      this.userDataLoaded = true;
      this.$store.dispatch("loadUserData", this.user);
    },
    loadBooklet(booklet) {
      this.$store.commit("setBooklet", booklet);
      this.$router.push('/booklet');
    }
  }
}
</script>

<style lang="sass">
#user-info
  background-color: #ccc
.user-booklets
  ul
    margin-top: 27%
  .dropdown-item
    height: 100px
    overflow: hidden
    p 
      width: 100%
    .title
      font-weight: bold
    .snippet
      font-style: italic
      font-size: .8rem
      white-space: normal
</style>