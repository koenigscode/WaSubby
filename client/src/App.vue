<template>
  <div id="app">
    <div id="nav">
      <top-header :isLightTheme="isLightTheme" @toggle-theme="toggleTheme" />
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>
<script>
import TopHeader from './components/TopHeader.vue'
export default {
  mounted() {
    const initUserTheme = this.getMediaPreference()
    this.isLightTheme = initUserTheme === 'light-theme'
  },

  data() {
    return {
      isLightTheme: true // Set the initial theme to light mode
    }
  },
  methods: {
    toggleTheme() {
      this.isLightTheme = !this.isLightTheme
      // Save the theme preference in localStorage or Vuex store if needed
    }
  },
  components: {
    'top-header': TopHeader
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
:root {
  --account-dark: #000428;
  --account-light: #004e92;

}
:root.light-theme {
  --account-dark: #ff855b;
  --account-light: #ffb150;
}

</style>
