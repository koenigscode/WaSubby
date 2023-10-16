<template>
    <div> <b-alert variant="danger" :show="alert !== null">{{ alert }}</b-alert>
        <div class="my-page">
          <div class="col-5">
          <div class="image-logo">
            <img src="../assets/waSubbyLogo.svg" width="500" height="900">
          </div>
          </div>
          <div class="col-7 main-mypage">
                <form>
                    <label>My Page</label>
                    <!-- Email is set as uneditable since it does not make sense to change the email of an account -->
                    <input type="text" placeholder="My E-Mail" v-model="email" readonly/>
                    <input type="password" v-model="newPassword" placeholder="New Password" />
                    <div class="theme">
                        Preffered Theme
                        <b-dropdown id="dropdown-right" right text="Select" variant="primary" class="m-2">
                            <b-dropdown-item @click="setSelectedTheme('dark')" href="#">Dark</b-dropdown-item>
                            <b-dropdown-item @click="setSelectedTheme('light-theme')" href="#">Light</b-dropdown-item>
                        </b-dropdown>
                    </div>
                    <div class="row align-items-center">
                        <div class="col-6">
                          <form @submit.prevent="updateAccount()">
                            <button type="submit">Save</button>
                          </form>
                        </div>
                        <form @submit.prevent="deleteAccount()" class="col-6">
                            <button v-b-modal.modal-1 type="submit">Delete</button>
                            <b-modal id="modal-1" :title="isMobile ? '🤨🤨☹️☹️😢😢😢🥹🥹🥹😭😭😭😭' : modalTitle">
                              <p class="my-4">
                                It's sad to say goodbye but we hope you had a nice experience using our service.
                                Our team would like to thank you for using our service and hope to see you again!!
                              </p>
                              <p class="my-4">
                                Tack! 감사합니다! Danke! Спасибо!
                              </p>
                            </b-modal>
                        </form>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'MyPage',
  data: function () {
    return {
      alert: null,
      email: '',
      password: '',
      newPassword: '',
      selectedTheme: 'light',
      userId: localStorage.getItem('UserId'),
      modalTitle: '🤨🤨☹️☹️😢😢😢🥹🥹🥹😭😭😭😭😭'
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
        const response = await this.$httpClient.delete(`/v1/users/${this.userId}`)
        if (response.status === 200) {
          console.log('Your account is now deleted')
          localStorage.removeItem('Authorization')
          localStorage.removeItem('UserId')
          this.$router.push({ name: 'Home' })
        }
      } catch (err) {
        this.alert = err.response.data.message
      }
    },
    updateAccount: async function () {
      try {
        const res = await this.$httpClient.patch(`/v1/users/${this.userId}`, {
          password: this.newPassword // Use the new password
        })
        if (res.status === 200) {
          this.$bvToast.toast('Your password is now changed', {
            title: 'Password Change Successful',
            autoHideDelay: 5000,
            variant: 'success',
            appendToast: true
          })
          this.alert = null
          this.newPassword = '' // Clear the new password field
        }
      } catch (err) {
        this.alert = err.response.data.message
      }
    }
  },
  computed: {
    themeClass() {
      return this.selectedTheme === 'dark' ? 'dark-theme' : 'light-theme'
    },
    isMobile() {
      return window.innerWidth <= 768
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

.main-mypage {
    width: 48%;
    height: 500px;
    overflow: hidden;
    margin-right: 10px;
    border-radius: 10px;
    box-shadow: 5px 20px 50px #00072D;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-mypage input {
    width: 80%;
    height: auto;
    background: #fbfaf5;
    justify-content: center;
    display: flex;
    margin: 20px auto;
    padding: 10px;
    border: none;
    outline: none;
    border-radius: 5px;
}

.main-mypage button {
    width: 70%;
    height: 40px;
    margin: 10px auto;
    justify-content: center;
    display: block;
    color: #fff;
    background: var(--button);
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

.image-logo {
  text-align: left;
}

.image-logo img {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  height: auto;
}
/* Media query for screens with a maximum width of 768px */
@media screen and (max-width: 768px) {
  .main-mypage {
    width: 48%;
    height: 500px;
    overflow: hidden;
    margin-right: 10px;
    border-radius: 10px;
    box-shadow: 5px 20px 50px #00072D;
    display: flex;
    align-items: center;
    justify-content: center;
}
}
</style>
