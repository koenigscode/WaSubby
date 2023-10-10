<template>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#">WaSubby</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="/">Home</b-nav-item>
            <b-nav-item href="/media">Media Player</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>Account</em>
              </template>
              <b-dropdown-item v-if="isLoggedIn()" href="my-page">My Page</b-dropdown-item>
              <b-dropdown-item v-if="!isLoggedIn()" href="login">Login</b-dropdown-item>
              <b-dropdown-item v-if="!isLoggedIn()" href="sign-up">Sign Up</b-dropdown-item>
              <b-dropdown-item v-if="isLoggedIn()" href="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
</template>

<script>
export default {
  mounted() {
    // Since we're saving the auth token in localStorage (for persistence),
    // it's not reactive.
    // So we re-render the component when the drop-down is shown, so that
    // isLoggedIn is re-called in the template
    this.$root.$on('bv::dropdown::show', bvEvent => {
      this.$forceUpdate()
    })
  },
  methods: {
    logout: function () {
      localStorage.setItem('Authorization', null)
      console.log('logged out')
      this.$router.push({ name: 'Login' })
    },
    isLoggedIn: function () {
      return localStorage.getItem('Authorization') !== null
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
