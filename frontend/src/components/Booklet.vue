<template lang="pug">
div
    h1 booklet
    p data: {{ $store.getBooklet }}
</template>

<script>
export default {
  created() {
    this.$store.commit("updateBooklet", { id: 4 });
  }
};
</script>

<style></style>
