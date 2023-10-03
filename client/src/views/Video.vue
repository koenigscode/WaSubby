<template>
    <div>

        <div class="mt-5">

            <b-form v-if="!media" @submit="submitFile">
                <input type="file" ref="file" />
                <div class="mt-3"> <b-button @click="submitFile">Upload!</b-button></div>
            </b-form>

            <div v-if="processing">
                <b-spinner />
                <p>Subtitles are being generated...<br />
                    Depending on the size of the media, this might take several minutes</p>
            </div>

            <audio v-show="media && mediaType === 'audio' && !processing" controls ref="audioplayer">
                <track kind="captions" v-for="subtitle in subtitles" :key="subtitle.id" :src="subtitle.path"
                    :srclang="subtitle.language.code" :label="subtitle.language.name">
                <!-- <track kind="captions" src="TODO:" srclang="en" label="English">
                <track kind="captions" src="TODO:" srclang="de" label="German"> -->
            </audio>
            <video id="video" v-show="media && mediaType === 'video' && !processing" controls ref="videoplayer"
                height="600px" crossorigin="anonymous" preload="metadata">
                <track kind="captions" v-for="subtitle in subtitles" :key="subtitle.id" :src="subtitle.path"
                    :srclang="subtitle.language.code" :label="subtitle.language.name">
                <!-- <track kind="captions" src="English.vtt" srclang="en" label="English">
                <track kind="captions" src="German.vtt" srclang="de" label="German"> -->
            </video>
        </div>
    </div>
</template>

<script>
import fixSubs from '@/subtitle-fix'
export default {
  data: () => ({ mediaHash: null, media: null, mediaType: null, subtitles: [], processing: false }),
  async mounted() {
    await this.$nextTick() // wait for DOM to render
    fixSubs()
  },
  updated: function () {
    fixSubs()
    this.showAllSubs()
  },
  methods: {
    async submitFile() {
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

      this.processing = true
      const res = await this.$httpClient.post('/v1/medias', formData, { headers })
      this.mediaHash = res.data.fileHash
      console.log('mediaHash:')
      console.log(this.mediaHash)

      const reader = new FileReader()
      reader.readAsDataURL(this.media)
      reader.addEventListener('load', () => {
        if (this.mediaType === 'video') { this.$refs.videoplayer.src = reader.result }
        if (this.mediaType === 'audio') { this.$refs.audioplayer.src = reader.result }

        console.log('detected mediaType: ' + this.mediaType)
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
      while (this.processing) {
        try {
          res = await this.$httpClient.get(`/v1/medias/${this.mediaHash}`)
          this.processing = res.data.processing
        } catch (err) {
          this.$bvToast.toast(err.message, {
            title: 'Error',
            autoHideDelay: 5000,
            variant: 'danger',
            appendToast: true
          })
        }
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      // wait before checking again
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.processing = false

      // get subtitles URLs
      res = await this.$httpClient.get(`/v1/medias/${this.mediaHash}/subtitles`)
      const subs = res.data
      for (const sub of subs) {
        sub.path = `${process.env.VUE_APP_API_ENDPOINT}${sub.path}`
      }
      this.subtitles = subs
      //   this.$forceUpdate()
      fixSubs(this.subtitles.length)
    }
  }
}
</script>
