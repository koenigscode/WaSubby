<template>
  <div id="app">
    <div id="nav">
      <top-header />
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>
<script>
import TopHeader from './components/TopHeader.vue'
export default {
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
  --button: #1870d5;
  --letter: white;

}
:root.light-theme {
  --account-dark: #ff855b;
  --account-light: #ffb150;
  --button: #ffb347;
  --letter: black;
}

</style>
