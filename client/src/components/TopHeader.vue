<template>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#">WaSubby</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="/">Home</b-nav-item>
            <b-nav-item href="#">Video Player</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>Account</em>
              </template>
              <b-dropdown-item href="login">Log In</b-dropdown-item>
              <b-dropdown-item href="sign-up">Sign Up</b-dropdown-item>
              <b-dropdown-item href="my-page">My Page</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
</template>

<script>

</script>

<style lang="scss" scoped>
</style>
