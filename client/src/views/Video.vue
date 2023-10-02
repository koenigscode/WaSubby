<template>
    <div>

        <div class="mt-5">

            <b-form v-if="!media" @submit="submitFile">
                <input type="file" ref="file" />
                <div class="mt-3"> <b-button @click="submitFile">Upload!</b-button></div>
            </b-form>

            <div v-if="loadingSubtitles">
                <b-spinner />
                <p>Subtitles are being generated...<br />
                    Depending on the size of the media, this might take up several minutes</p>
            </div>

            <audio v-show="media && mediaType === 'audio' && !loadingSubtitles" controls ref="audioplayer">
                <track v-for="subtitle in subtitles" :key="subtitle.id" :src="subtitle.path"
                    :srclang="subtitle.languageCode" :label="subtitle.languageName">
                <!-- <track kind="captions" src="TODO:" srclang="en" label="English">
                <track kind="captions" src="TODO:" srclang="de" label="German"> -->
            </audio>
            <video id="video" v-show="media && mediaType === 'video' && !loadingSubtitles" controls ref="videoplayer"
                height="600px" crossorigin="anonymous" preload="metadata">
                <track v-for="subtitle in subtitles" :key="subtitle.id" :src="subtitle.path"
                    :srclang="subtitle.languageCode" :label="subtitle.languageName">
                <!-- <track kind="captions" src="English.vtt" srclang="en" label="English">
                <track kind="captions" src="German.vtt" srclang="de" label="German"> -->
            </video>
        </div>
    </div>
</template>

<script>
import fixSubs from '@/subtitle-fix'
export default {
  data: () => ({ mediaHash: null, media: null, mediaType: null, subtitles: [], loadingSubtitles: false }),
  async mounted() {
    await this.$nextTick() // wait for DOM to render
    fixSubs()
  },
  methods: {
    async submitFile() {
      console.log(this.$refs.file.files[0])
      this.media = this.$refs.file.files[0]

      if (this.media.type.startsWith('video')) {
        this.mediaType = 'video'
      } else if (this.media.type.startsWith('audio')) {
        this.mediaType = 'audio'
      } else {
        this.$bvToast.toast('This media file type is not supported', {
          title: 'Unsupported media',
          autoHideDelay: 5000,
          variant: 'danger',
          appendToast: true
        })
        this.media = null
        return
      }

      const formData = new FormData()
      formData.append('media', this.media)
      const headers = { 'Content-Type': 'multipart/form-data' }

      const res = await this.$httpClient.post('/medias', formData, { headers })
      this.mediaHash = res.data.media
      console.log(res.data.media)

      const reader = new FileReader()
      reader.readAsDataURL(this.media)
      reader.addEventListener('load', () => {
        console.log(reader.result)
        if (this.mediaType === 'video') { this.$refs.videoplayer.src = reader.result }
        if (this.mediaType === 'audio') { this.$refs.audioplayer.src = reader.result }

        console.log(this.mediaType)
      })
      this.loadSubtitles()
    },
    showAllSubs() {
      for (const textTrack of this.$refs.videoplayer.textTracks) {
        textTrack.mode = 'showing'
      }
    },
    async loadSubtitles() {
      let res
      do { // wait while subtitle generation ongoing
        this.loadingSubtitles = true
        try {
          res = await this.$httpClient.get(`/medias/${this.mediaHash}`)
        } catch (err) {
          this.$bvToast.toast(err.message, {
            title: 'Error',
            autoHideDelay: 5000,
            variant: 'danger',
            appendToast: true
          })
        }

        // wait before checking again
        await new Promise(resolve => setTimeout(resolve, 2000))
      } while (res.data.processing)
      this.loadingSubtitles = false

      // get subtitles URLs
      res = await this.$httpClient.get(`/medias/${this.mediaHash}/subtitles`)
      console.log(res.data)
      this.subtitles = res.data
      this.showAllSubs()
      fixSubs(this.subtitles.length)
    }
  }
}
</script>
