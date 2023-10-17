<template>
  <div>
    <b-alert variant="danger" :show="alert !== null">{{ alert }}</b-alert>
    <div class="my-page d-flex align-items-center justify-content-center">
      <div class="col-7 main-mypage">
        <form>
          <label>My Page</label>
          <!-- Email is set as uneditable since it does not make sense to change the email of an account -->
          <input type="text" :value="newEmail" :placeholder="email" />
          <div class="theme">
            Current Theme
            <b-dropdown id="dropdown-right" right :text="selectedTheme" variant="primary" class="m-2">
              <b-dropdown-item @click="setSelectedTheme('dark')" href="#">Dark</b-dropdown-item>
              <b-dropdown-item @click="setSelectedTheme('light-theme')" href="#">Light</b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="row align-items-center">
            <div class="col-6">
              <form @submit.prevent="updateTheme">
                <b-button type="submit" variant="success" class="w-auto">
                  <span id="apply-button">Apply</span>
                </b-button>
              </form>
              <form @submit.prevent="editAccount">
                <b-button
  type="submit"
  variant="secondary"
  class="w-auto"
  :disabled="isEditButtonDisabled"
  :class="{ 'disabled': isEditButtonDisabled }"
>
  <span>Edit</span>
</b-button>
              </form>
            </div>
            <form @submit.prevent="deleteAccount" class="col-6">
              <b-button variant="danger" type="submit" class="w-auto">
                <span>Delete Account</span>
              </b-button>
              <b-modal id="modal-1" :title="isMobile ? '🤨🤨☹️☹️😢😢😢🥹🥹🥹😭😭😭😭😭' : modalTitle">
                <p class="my-4">
                  It's sad to say goodbye, but we hope you had a nice experience using our service.
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
      newEmail: 'your@email.com',
      email: '',
      password: '',
      newTheme: '',
      selectedTheme: 'light',
      userId: localStorage.getItem('UserId'),
      modalTitle: '🤨🤨☹️☹️😢😢😢🥹🥹🥹😭😭😭😭😭'
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    setSelectedTheme(theme) {
      this.selectedTheme = theme
      this.newTheme = theme
      // Save the selected theme in local storage
      localStorage.setItem('selectedTheme', theme)
    },
    editAccount: async function () {
      try {
        const response = await this.$httpClient.put(`v1/users/${this.userId}`, {
          theme: this.newTheme,
          email: this.newEmail
        })
        if (response.status === 200) {
          console.log('Successfully changed account settings')
          location.reload()
        }
      } catch (err) {
        this.alert = err.response.data.message
      }
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
    getUser: async function () {
      try {
        const res = await this.$httpClient.get(`/v2/users/${this.userId}`)

        if (res.status === 200) {
          console.log(res)
          this.email = res.data.email
          this.selectedTheme = res.data.theme
          this.alert = null
        }
      } catch (err) {
        this.alert = err.reponse.data.message
      }
    },
    updateTheme: async function () {
      try {
        const res = await this.$httpClient.patch(`/v1/users/${this.userId}`, {
          theme: this.newTheme
        })
        if (res.status === 200 && this.newTheme != null) {
          this.$bvToast.toast('Your theme is now changed', {
            title: 'Theme Change Successful',
            autoHideDelay: 5000,
            variant: 'success',
            appendToast: true
          })
          this.alert = null
          location.reload()
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
    isEditButtonDisabled() {
      // Disable the "Edit" button if the email field is empty or unchanged
      return !this.newEmail || this.newEmail === this.email
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
    justify-content: center;
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
    align-items: center;
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

/* Add this CSS rule to style the disabled button */
.b-button.disabled {
  background-color: #ccc; /* Set the background color to gray */
  color: #777; /* Set the text color to a darker shade */
  pointer-events: none; /* Disable pointer events for the button when it's disabled */
}

}
</style>
