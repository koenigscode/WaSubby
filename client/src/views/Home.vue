<template>
  <body id="app">
    <section>
      <div class="reveal">
        <img src="../source/languagesBG.svg" />
      </div>
    </section>
    <section class="example">
      <div class="reveal">
        <div class="col">
          <video width="600px" height="1080px" controls="controls" class="corner">
            <source src="../source/KoreanExample.mp4">
          </video>
          </div>
        </div>
        <div class="col">
          <div class="reveal">
          <h3>Try Our Service!</h3>
          <div class="buttons">
            <b-button pill varient="success">Korean</b-button>
            <b-button pill>German</b-button>
            <b-button pill>Russian</b-button>
            <b-button pill>Swedish</b-button>
          </div>
          </div>
        </div>
    </section>
  </body>
</template>

<script>
function reveal() {
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
}

window.addEventListener('scroll', reveal)

</script>

<style>
section{
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
section:nth-child(1) {
  background-image: url('../source/Without-Languages.png');
  background-size: cover;
  min-height: 100vh;
}
section:nth-child(2) {
  background-image: url('../source/starsBackground.svg');
  background-size: cover;
}

.reveal{
  position: relative;
  transform: translateY(150px);
  opacity: 0;
  transition: 1s all ease;
}

.reveal.active{
  transform: translateY(0);
  opacity: 1;
}

.example {
  align-items: center;
  justify-content: left;
  display: flex;
}

.buttons{
  display: flex;
  justify-content: space-between;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px 20px;
}

</style>
