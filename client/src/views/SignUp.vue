<template>
    <div>
        <b-alert variant="danger" :show="alert !== null">{{ alert }}</b-alert>
        <div class="register">
            <div class="main">
                <form @submit.prevent="signup()">
                    <label>Sign Up</label>
                    <!-- <input type="text" v-model="name" placeholder="Enter Name" /> -->
                    <input type="text" v-model="email" placeholder="Enter E-Mail" />
                    <input type="password" v-model="password" placeholder="Enter password" />
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SignUp',
  data: function () {
    return {
      alert: null,
      email: '',
      password: ''
    }
  },
  methods: {
    signup: async function () {
      try {
        const res = await axios.post(`${process.env.VUE_APP_API_ENDPOINT}/auth/signup`, {
          email: this.email,
          password: this.password
        })
        if (res.status === 200) {
          this.$router.push({ name: 'Login' })
        }
      } catch (err) {
        this.alert = err.response.data.message
      }
      // TODO: show error/success message
    }
  }
}
</script>

<style>
.register {
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
