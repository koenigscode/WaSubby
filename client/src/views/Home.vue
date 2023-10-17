<template>
    <div id="app">
        <section>
            <div class="reveal">
                <img src="../assets/languagesBG.svg" />
            </div>
        </section>
        <section class="example">
            <div class="reveal">
                <div class="col">
                    <video controls="controls" class="corner" :src="getVideoSource" width="400" height="300"></video>
                </div>
            </div>
            <div class="col">
                <div class="reveal">
                    <h3>Try Our Service!</h3>
                    <div class="buttons container-fluid">
                        <div class="row">
                        <div class="col-lg-3 col-12">
                            <b-button pill @click="selectLanguage('Korean')">Korean</b-button>
                        </div>
                        <div class="col-lg-3 col-12">
                            <b-button pill @click="selectLanguage('German')">German</b-button>
                        </div>
                        <div class="col-lg-3 col-12">
                            <b-button pill @click="selectLanguage('Russian')">Russian</b-button>
                        </div>
                        <div class="col-lg-3 col-12">
                            <b-button pill @click="selectLanguage('Swedish')">Swedish</b-button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      example: 'Languages',
      selectedLanguage: 'Korean',
      variants: [
        {
          variantId: 2001,
          languageName: 'Korean',
          videoSource: require('../assets/KoreanExample.mp4')
        },
        {
          variantId: 2002,
          languageName: 'German',
          videoSource: require('../assets/NotRegistered.mp4') // Correct video source
        },
        {
          variantId: 2003,
          languageName: 'Russian',
          videoSource: require('../assets/NotRegistered.mp4') // Correct video source
        },
        {
          variantId: 2004,
          languageName: 'Swedish',
          videoSource: require('../assets/SwedishExample.mp4')
        }
      ]
    }
  },
  methods: {
    reveal() {
      const reveals = document.querySelectorAll('.reveal')

      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight
        const elementTop = reveals[i].getBoundingClientRect().top
        const elementVisible = 150

        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active')
        } else {
          reveals[i].classList.remove('active')
        }
      }
    },
    selectLanguage(languageName) {
      this.selectedLanguage = languageName
    }
  },
  mounted() {
    window.addEventListener('scroll', this.reveal)
  },
  computed: {
    getVideoSource() {
      const selectedVariant = this.variants.find((variant) => variant.languageName === this.selectedLanguage)
      return selectedVariant ? selectedVariant.videoSource : ''
    }
  }
}
</script>

<style>
section {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

section:nth-child(1) {
    background-image: url('../assets/Without-Languages.png');
    background-size: cover;
    min-height: 100vh;
}

section:nth-child(2) {
    background-image: url('../assets/starsBackground.svg');
    background-size: cover;
    min-height: 100vh;
}

.col h3 {
    font-weight: bold;
}

.reveal {
    position: relative;
    transform: translateY(150px);
    opacity: 0;
    transition: 1s all ease;
    max-width: 100%;
    max-height: 100vh;
}

.reveal img {
    max-width: 100%;
    height: auto;
}

.reveal.active {
    transform: translateY(0);
    opacity: 1;
}

.example {
    align-items: center;
    justify-content: left;
    display: flex;
}

.example .col {
    max-width: 100%;
}

.example video {
    max-width: 100%;
    height: auto;
}

.buttons {
    margin: 0 auto;
    padding: 20px 20px;
    max-width: 30rem;
}

/* Media query for screens with a maximum width of 768px */
@media screen and (max-width: 768px) {

    /* Below is the change for the text part */
    .col h3 {
        font-weight: bold;
        font-size: medium;
    }

    .buttons button {
        /* width: 100%; */
        margin-bottom: 0.5rem;
    }
}</style>
