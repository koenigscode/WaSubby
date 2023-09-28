<template>
  <body id="app">
    <section></section>
    <section>
      <b-container class="bv-example-row">
        <b-row>
          <b-col cols="10">
          </b-col>
          <b-col>2 of 2</b-col>
        </b-row>
      </b-container>
    </section>
  </body>
</template>

<script>

</script>

<style>
section{
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
section:nth-child(1) {
  background-color: #6171a9;
}
section:nth-child(2) {
  background-color: #42455a;
  background-size: cover;
}

</style>
