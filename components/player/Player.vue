<template>
  <div
    class="flex justify-between items-center bg-gray-800 p-4 text-white w-auto mt-12 outline-none"
  >
    <div class="flex">
      <img
        src="https://raplume.eu/wp-content/uploads/2021/02/https___images.genius.com_bab985edf7b76b9ff29f7b103ce092cf.1000x1000x1.jpg"
        alt=""
        class="w-16 mr-4"
      />
      <!--    <p>{{ currentTrackName }} - {{ currentTrackArtists }}</p>-->
      <div class="flex-col flex justify-center">
        <p>CINÉ CLUB</p>
        <p>DIOSCURES</p>
      </div>
    </div>

    <div class="flex w-40 justify-between">
      <svg
        class="cursor-pointer w-10"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
        />
      </svg>

      <svg
        class="cursor-pointer w-10"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          class="cursor-pointer"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <svg
        class="cursor-pointer w-10"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 5l7 7-7 7M5 5l7 7-7 7"
        />
      </svg>
    </div>

    <div>
      <svg
        class="w-8"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="{2}"
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Player',
  data: () => ({
    player: null,
  }),
  computed: {
    ...mapState({
      username: (state) => state.user.username,
      deviceId: (state) => state.player.deviceId,
      playlistUri: (state) => state.room.playlistUri,
    }),
    ...mapGetters({
      admin: 'room/admin',
      currentTrackArtists: 'player/currentTrackArtists',
      currentTrackName: 'player/currentTrackName',
      currentTrackCover: 'player/currentTrackCover',
      currentTrackId: 'player/currentTrackId',
      currentTrackPosition: 'player/currentTrackPosition',
      isPlaying: 'player/isPlaying',
    }),
  },
  watch: {
    isPlaying(newVal) {
      this[!newVal ? 'pause' : 'resume']()
    },
    currentTrackId() {
      this.play()
    },
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
          volume: 0.5,
        })

        this.player.addListener('initialization_error', (e) => console.error(e))
        this.player.addListener('authentication_error', (e) => console.error(e))
        this.player.addListener('account_error', (e) => console.error(e))
        this.player.addListener('playback_error', (e) => console.error(e))

        this.player.addListener(
          'player_state_changed',
          ({ paused, track_window: { current_track } }) => {
            if (
              this.username === this.admin &&
              (current_track.id !== this.currentTrackId ||
                paused === this.isPlaying)
            ) {
              console.log(
                paused,
                this.isPlaying,
                current_track.id,
                this.currentTrackId
              )
              this.updateTrackState()
            }
          }
        )

        this.player.addListener('ready', (data) => {
          this.setDeviceId(data.device_id)
          let position = this.currentTrackPosition
          if (this.admin !== this.username) position = position + 3500
          this.play(position)
        })

        this.player.connect()
      }
    }
  },
  methods: {
    next() {
      this.$axios.post(
        `https://api.spotify.com/v1/me/player/next?device_id=${this.deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        }
      )
    },
    previous() {
      this.$axios.post(
        `https://api.spotify.com/v1/me/player/previous?device_id=${this.deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        }
      )
    },
    resume() {
      console.log('RESUME')
      this.$axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        }
      )
    },
    pause() {
      console.log('PAUSE')
      this.$axios.put(
        `https://api.spotify.com/v1/me/player/pause?device_id=${this.deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        }
      )
    },
    play(position = 0) {
      const data = {
        position_ms: position,
      }

      if (this.username === this.admin) {
        data.context_uri = this.playlistUri
      } else {
        data.uris = [`spotify:track:${this.currentTrackId}`]
      }

      this.$axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
        data,
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        }
      )
    },
    seek(position, deviceId) {
      this.$axios.put(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${position}&device_id=${deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        }
      )
    },
    ...mapMutations({
      setDeviceId: 'player/SET_DEVICE_ID',
    }),
    ...mapActions({
      updateTrackState: 'room/updateTrackState',
      sendTrackState: 'room/sendTrackState',
    }),
  },
}
</script>
