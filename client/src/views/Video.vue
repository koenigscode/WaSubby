<template>
    <div>

        <b-alert variant="danger" :show="alert !== null">{{ alert }}</b-alert>
        <div class="mt-5">
            <b-form v-if="!media" @submit="submitFile">
                <input type="file" ref="file" />
                <div class="mt-3"> <b-button @click="submitFile">Upload!</b-button></div>
            </b-form>

            <audio v-show="media && mediaType === 'audio'" controls ref="audioplayer">
                <track kind="captions" src="TODO:" srclang="en" label="English">
                <track kind="captions" src="TODO:" srclang="de" label="German">
            </audio>
            <video id="video" v-show="media && mediaType === 'video'" controls ref="videoplayer" height="600px" crossorigin="anonymous"
  preload="metadata" >
                <track kind="captions" src="English.vtt" srclang="en" label="English">
                <track kind="captions" src="German.vtt" srclang="de" label="German">
            </video>
        </div>
    </div>
</template>

<!-- ID is set so that we can dynmically load this style, -->
<!-- as browsers need a workaround for displaying multiple -->
<!-- subtitles at the same time -->
<style id="videoStyle" ref="videoStyle">
video::cue {
    background-color: transparent;
    text-shadow: 1px 1px 2px #666666;
  }

  /* fix cue overlap for Chrome */
  video::-webkit-media-text-track-display {
    position: relative !important;
    transform: none !important;
  }
</style>

<script>
import fixSubs from '@/subtitle-fix'
export default {
  data: () => ({ mediaHash: null, media: null, mediaType: null, alert: null }),
  async mounted() {
    await this.$nextTick() // wait for DOM to render
    fixSubs()
  },
  //   async updated() {
  //     await this.$nextTick() // wait for DOM to render
  //     fixSubs()
  //   },
  methods: {
    async submitFile() {
      console.log(this.$refs.file.files[0])
      this.media = this.$refs.file.files[0]

      if (this.media.type.startsWith('video')) {
        this.mediaType = 'video'
      } else if (this.media.type.startsWith('audio')) {
        this.mediaType = 'audio'
      } else {
        this.alert = 'This media file type is not supported'
        this.media = null
        return
      }
      this.alert = null

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
      for (const textTrack of this.$refs.videoplayer.textTracks) {
        textTrack.mode = 'showing'
      }
    }
  }
}
</script>
