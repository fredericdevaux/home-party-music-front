<template>
  <div>
    <img :src="currentTrackCover" alt="" />
    <p>{{ currentTrackName }} - {{ currentTrackArtists }}</p>
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
