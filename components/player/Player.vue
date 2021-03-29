<template>
  <div
    v-if="player"
    class="flex justify-between items-center bg-black text-white w-auto outline-none"
  >
    <div class="flex infos flex-grow items-center overflow-hidden">
      <img
        :src="currentTrackCover"
        alt=""
        class="self-center block w-16 h-16 mr-4"
      />
      <div class="flex-col flex justify-center overflow-hidden">
        <p>
          {{ currentTrackName }}
        </p>
        <p class="text-gray-500">
          {{ currentTrackArtists }}
        </p>
      </div>
    </div>

    <div class="flex justify-between controls pr-4">
      <button
        class="ml-1.5"
        v-if="isPlaying && isAdmin"
        title="Mettre en pause"
        @click="pause"
      >
        <i>
          <pause class="w-10 h-10"/>
        </i>
      </button>
      <button
        class="ml-1.5"
        v-else-if="!isPlaying && isAdmin"
        title="Lire la chanson"
        @click="resume"
      >
        <i>
          <play class="w-10 h-10"/>
        </i>
      </button>
      <button v-if="isAdmin" class="ml-1.5" title="Chanson suivante" @click="next">
        <i>
          <next class="w-10 h-10"/>
        </i>
      </button>
      <button class="ml-2.5">
        <i>
          <sound class="w-10 h-10"/>
        </i>
      </button>
    </div>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import play from '~/assets/svg/play.svg?inline'
import pause from '~/assets/svg/pause.svg?inline'
import next from '~/assets/svg/next.svg?inline'
import sound from '~/assets/svg/sound.svg?inline'

export default {
  name: 'Player',
  components: {
    play,
    pause,
    next,
    sound
  },
  data: () => ({
    player: null
  }),
  computed: {
    ...mapState({
      username: (state) => state.user.username,
      deviceId: (state) => state.player.deviceId,
      songsQueue: (state) => state.room.songsQueue
    }),
    ...mapGetters({
      isAdmin: 'room/isAdmin',
      currentTrackArtists: 'player/currentTrackArtists',
      currentTrackName: 'player/currentTrackName',
      currentTrackCover: 'player/currentTrackCover',
      currentTrackId: 'player/currentTrackId',
      currentTrackPosition: 'player/currentTrackPosition',
      isPlaying: 'player/isPlaying'
    })
  },
  watch: {
    isPlaying(newVal, oldVal) {
      !this.isAdmin && this[!newVal ? 'pause' : 'resume']()
      this.$emit('toggle_pause_video', newVal)
    },
    songsQueue(newVal) {
      newVal[0] && !this.currentTrackId && this.play(newVal[0].uri)
    },
    currentTrackId(newVal) {
      !this.isAdmin && this.play(`spotify:track:${newVal}`)
      this.deleteSongFromQueue(newVal)
    }
  },
  created() {
    if (process.client) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      const spotifyScript = document.createElement('script')
      spotifyScript.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js')
      // eslint-disable-next-line nuxt/no-globals-in-created
      document.head.appendChild(spotifyScript)
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.onSpotifyPlayerAPIReady = () => {
        // eslint-disable-next-line no-undef
        this.player = new Spotify.Player({
          name: 'Squadparty',
          getOAuthToken: (cb) => {
            cb(this.$cookies.get('access_token'))
          },
          volume: 0.5
        })

        this.player.addListener('initialization_error', (e) => console.error(e))
        this.player.addListener('authentication_error', (e) => console.error(e))
        this.player.addListener('account_error', (e) => console.error(e))
        this.player.addListener('playback_error', (e) => console.error(e))

        this.player.addListener('player_state_changed', (state) => {
          this.isAdmin && this.updateTrackState()
          if (
            state.track_window.previous_tracks.find(
              (x) => x.id === state.track_window.current_track.id
            )
          ) {
            this.next()
          }
        })

        this.player.addListener('ready', (data) => {
          this.setDeviceId(data.device_id)
          let position = this.currentTrackPosition
          if (!this.isAdmin) position = position + 2000
          this.currentTrackId &&
          this.play(`spotify:track:${this.currentTrackId}`, position)
        })

        this.player.connect()
      }
    }
  },
  methods: {
    next() {
      if (this.songsQueue.length) {
        this.play(this.songsQueue[0].uri)
      } else {
        this.$axios.post(
          `${process.env.SPOTIFY_BASE_API_URL}/me/player/next?device_id=${this.deviceId}`,
          {},
          {
            credentials: true,
            headers: {
              Authorization: `Bearer ${this.$cookies.get('access_token')}`
            }
          }
        )
      }
    },
    previous() {
      this.$axios.post(
        `${process.env.SPOTIFY_BASE_API_URL}/me/player/previous?device_id=${this.deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`
          }
        }
      )
    },
    resume() {
      this.$axios.put(
        `${process.env.SPOTIFY_BASE_API_URL}/me/player/play?device_id=${this.deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`
          }
        }
      )
    },
    pause() {
      this.$axios.put(
        `${process.env.SPOTIFY_BASE_API_URL}/me/player/pause?device_id=${this.deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`
          }
        }
      )
    },
    play(trackUri, position = 0) {
      const data = {
        position_ms: position
      }

      data.uris = [trackUri]

      this.$axios.put(
        `${process.env.SPOTIFY_BASE_API_URL}/me/player/play?device_id=${this.deviceId}`,
        data,
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`
          }
        }
      )
    },
    seek(position, deviceId) {
      this.$axios.put(
        `${process.env.SPOTIFY_BASE_API_URL}/me/player/seek?position_ms=${position}&device_id=${deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`
          }
        }
      )
    },
    ...mapMutations({
      setDeviceId: 'player/SET_DEVICE_ID'
    }),
    ...mapActions({
      updateTrackState: 'room/updateTrackState',
      sendTrackState: 'room/sendTrackState',
      deleteSongFromQueue: 'room/deleteSongFromQueue'
    })
  }
}
</script>

<style lang="scss">
.infos {
  p {
    @apply whitespace-nowrap overflow-ellipsis overflow-hidden;
  }
}
</style>
