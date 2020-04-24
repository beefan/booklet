<template lang="pug">
div
  b.row
    h1 booklet
  hr
  p data: {{ $store.getBooklet.title }}
</template>

<script>
export default {
  created() {
    this.$store.commit("updateBooklet", { id: 4 });
  }
};
</script>

<style lang="sass">

</style>
