<template>
    <div> <b-alert variant="danger" :show="alert !== null">{{ alert }}</b-alert>
        <div class="my-page">
          <div class="image-logo">
            <img src="../assets/waSubbyLogo.svg">
          </div>
            <div class="main">
                <form>
                    <label>My Page</label>
                    <input type="text" placeholder="My E-Mail" />
                    <input type="password" v-model="password" placeholder="My Password" />
                    <div class="theme">
                        Preffered Theme
                        <b-dropdown id="dropdown-right" right text="Select" variant="primary" class="m-2">
                            <b-dropdown-item @click="setSelectedTheme('dark')" href="#">Dark</b-dropdown-item>
                            <b-dropdown-item @click="setSelectedTheme('light-theme')" href="#">Light</b-dropdown-item>
                        </b-dropdown>
                    </div>
                    <div class="row align-items-center">
                        <div class="col-6">
                            <b-button type="submit">Save</b-button>
                        </div>
                        <form @submit.prevent="deleteAccount()" class="col-6">
                            <b-button variant="danger" type="submit">Delete</b-button>
                        </form>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyPage',
  data: function () {
    return {
      alert: null,
      email: '',
      password: '',
      selectedTheme: 'light'
    }
  },
  methods: {
    setSelectedTheme(theme) {
      this.selectedTheme = theme

      // Save the selected theme in local storage
      localStorage.setItem('selectedTheme', theme)
    },
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
  },
  computed: {
    themeClass() {
      return this.selectedTheme === 'dark' ? 'dark-theme' : 'light-theme'
    }
  }
}
</script>
<style>
.my-page {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: right;
    align-items: center;
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
    background: var(--button-light);
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

.theme {
    color: white;
}
</style>
