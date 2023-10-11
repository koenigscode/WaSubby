<template>
    <div> <b-alert variant="danger" :show="alert !== null">{{ alert }}</b-alert>
        <div class="admin-page">
            <div class="main">
            <label>Admin Page</label>
            <form @submit.prevent="deleteAccount()">
              <div class="align-next">
              <input type="text" v-model="email" required placeholder="Email to delete" />
              <button type="submit">Delete Account</button>
            </div>
            </form>
            <div class="row">
              <b-button size="lg" variant="primary">DELETE ALL</b-button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AdminPage',
  data: function () {
    return {
      alert: null
    }
  },
  methods: {
    deleteAccount: async function () {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_ENDPOINT}/users/delete-account`, {
          email: this.email,
          password: this.password
        })
        if (response.data.token) {
          console.log('Deleted Account')
          axios.defaults.headers.common = { Authorization: `Bearer ${response.data.token}` }
          this.$router.push({ name: 'home' })
        }
      } catch (err) {
        this.alert = err.response.data.message
      }
    },
    updateAccount: async function () {
      try {
        const res = await axios.post(`${process.env.VUE_APP_API_ENDPOINT}/users/change-info`, {
          email: this.email,
          password: this.password
        })
        if (res.status === 200) {
          this.$router.push({ name: 'Login' })
        }
      } catch (err) {
        this.alert = err.response.data.message
      }
    }
  }
}
</script>
<style>
.admin-page {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: bottom;
    min-height: 100vh;
    font-family: "Jost", sans-serif;
    background: linear-gradient(to bottom, var(--account-dark), var(--account-light));
}

.main {
    width: 48%;
    height: 500px;
    overflow: hidden;
    margin-right: 10px;
    border-radius: 10px;
    box-shadow: 5px 20px 50px #00072D;
}

.main input {
    width: 40%;
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
    width: 30%;
    height: 40px;
    margin: 10px auto;
    justify-content: center;
    display: block;
    color: #fff;
    font-size: 1em;
    font-weight: bold;
    margin-top: 20px;
    border-radius: 5px;
    transition: 0.5s;
    cursor: pointer;
}

label {
    color: #fff;
    font-size: 2.3em;
    margin: 60px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.5s ease-in-out
}

.theme {
    color: white;
}

.align-next {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.align-next input {
  margin-right: 10px;
  width: 50%;
}

.align-next button {
  width: auto;
}

</style>
