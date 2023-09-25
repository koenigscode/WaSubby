<template>
    <div class="login">
      <div class="main">
        <label>Login</label>
        <input type="text" v-model="email" placeholder="Enter E-Mail" />
        <input type="password" v-model="password" placeholder="Enter password" />
        <button v-on:click="Login">Login</button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
  }
}
</script>
<style scoped>
.login{
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: "Jost", sans-serif;
    background: linear-gradient(to bottom, #000428, #004e92);
  }

.main {
  width: 200%;
  height: 500px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 5px 20px 50px #00072D;
}

.main input {
    width: 20%;
    height: 40px;
    background: #fbfaf5;
    justify-content: center;
    display: flex;
    margin: 20px auto;
    padding: 10px;
    border: none;
    outline: none;
    border-radius: 5px;
}

.main button {
    width: 18%;
    height: 40px;
    margin: 10px auto;
    justify-content: center;
    display: block;
    color: #fff;
    background: #436998;
    font-size: 1em;
    font-weight: bold;
    margin-top: 20px;
    border: none;
    border-radius: 5px;
    transition: 0.5s;
    cursor: pointer;
}

label {
    color: #fff;
    font-size: 2.3em;
    justify-content: center;
    display: flex;
    margin: 60px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.5s ease-in-out
}
</style>
