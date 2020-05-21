<template lang="pug">
div
  b-row
    b-col
      h1 {{ registered ? 'Login' : 'Register'}}
    b-col
      b-button(variant="info" @click="registered = !registered") {{ registered ? 'Not registered?' : 'Already registered?' }}
  b-form(@submit="onSubmit")
    b-form-group(label="Username:" label-for="input-username")
      b-form-input(id="input-username" v-model="user.username" placeholder="Enter username" required)
    b-form-group(label="Password:" label-for="input-password")
      b-form-input(id="input-password" v-model="user.password" placeholder="Enter password" required)
    b-form-group(v-if="!registered" label="Confirm Password:" label-for="input-password") 
      b-form-input(id="input-confirm-pw" v-model="user.confirmPW" placeholder="Confirm password" required)
    b-button(type="submit" variant="primary") Submit
</template>

<script>
export default {
  data() {
    return {
      user: { 
        username: null,
        email: 'test@gmail.com',
        password: null,
        confirmPW: null
      },
      registered: true
    }
  },
  methods: {
    test() {

    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.registered) {
        if (this.user.username && this.user.password) {
          this.$store.dispatch('login', this.user);
          this.$router.push('/user');
        } else {
          alert('You must enter a username and password.')
        }
      }else {
        if (this.user.password !== this.user.confirmPW) {
          alert('Passwords must match');
        }else if (this.user.username && this.user.password && this.user.email) {
          this.$store.dispatch('register', this.user);
          this.$router.push('/user');
        } else {
          alert('Leave no fields blank');
        }
      }
    }
  }
}
</script>

<style>

</style>