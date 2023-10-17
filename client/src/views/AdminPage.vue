<template>
    <div> <b-alert variant="danger" :show="alert !== null">{{ alert }}</b-alert>
        <div class="admin-page" :class="{ 'terminated-background': isTerminated }">
            <div class="admin-main">
            <label>Admin Page</label>
              <b-button v-b-toggle.collapse-1 size="lg" variant="danger">DELETE ALL USERS</b-button>
              <b-collapse id="collapse-1" class="mt-2">
                <b-card>
                  <p class="card-text">Now I Am Become Death, the Destroyer of Worlds</p>
                  <form @submit.prevent="deleteAllAccounts()">
                  <button class="terminate-button" @click="toggleTerminated">Terminate</button>
                </form>
                </b-card>
             </b-collapse>
             <form @submit.prevent="deleteAllMedias()">
             <b-button type="submit" size="lg" variant="danger">DELETE ALL MEDIAS</b-button>
             </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'AdminPage',
  data: function () {
    return {
      alert: null,
      isTerminated: false
    }
  },
  methods: {
    deleteAllAccounts: async function () {
      const response = await this.$httpClient.delete('/v1/users/')
      if (response.status === 200) {
        console.log('Deleted all accounts')
        this.$bvToast.toast('Deleted all accounts', {
          title: 'Success',
          variant: 'success'
        })
      }
    },
    deleteAllMedias: async function () {
      const response = await this.$httpClient.delete('/v1/medias/')
      if (response.status === 200) {
        console.log('Deleted all medias')
        this.$bvToast.toast('Deleted all medias', {
          title: 'Success',
          variant: 'success'
        })
      }
    },

    toggleTerminated() {
      this.isTerminated = !this.isTerminated
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

.admin-main {
    width: 48%;
    height: 500px;
    overflow: hidden;
    margin-right: 10px;
    border-radius: 10px;
    box-shadow: 5px 20px 50px #00072D;
    background-image: url("../assets/nuclear.jpg");
}

.admin-main button {
    width: 50%;
    height: 40px;
    margin: 10px auto;
    display: block;
    color: #fff;
    font-size: 1em;
    font-weight: bold;
    margin-top: 20px;
    border-radius: 5px;
    transition: 0.5s;
    cursor: pointer;
    background: var(--button);
}

.terminate-button {
  width: auto;
    background: yellow;
    color: black;
    font-size: 1em;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.5s;
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

.terminated-background {
  background-image: url('../assets/nuclearBg.jpg');
}

@media screen and (max-width: 768px) {
  .admin-main {
    width: 80%;
    height: 400px;
    overflow: hidden;
    margin-right: 10px;
    border-radius: 10px;
    box-shadow: 5px 20px 50px #00072D;
    background-image: url("../assets/nuclear.jpg");
}
  .admin-main button {
    width: 75%;
    height: 40px;
    margin: 10px auto;
    display: block;
    color: #fff;
    font-size: 0.8em;
    font-weight: bold;
    margin-top: 20px;
    border-radius: 5px;
    transition: 0.5s;
    cursor: pointer;
    background: var(--button);
}

.terminate-button {
  width: auto;
    background: yellow;
    color: black;
    font-size: 0.5em;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.5s;
}

}

</style>
