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
    }),
  },
  created() {
    if (process.client) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.onSpotifyPlayerAPIReady = () => {
        // eslint-disable-next-line no-undef
        this.player = new Spotify.Player({
          name: 'Squadparty',
          getOAuthToken: (cb) => {
            cb(this.$cookies.get('access_token'))
          },
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
                paused !== this.paused)
            ) {
              this.sendTrackState()
              console.log('on send la trackState')
            }
          }
        )

        this.player.addListener('ready', (data) => {
          this.setDeviceId(data.device_id)
          this.play(this.deviceId, 0)
        })

        this.player.connect()
      }
    }
  },
  methods: {
    play(deviceId, position = 0) {
      const data = {
        position_ms: position,
      }

      if (this.username === this.admin) {
        data.context_uri = this.playlistUri
      } else {
        data.uris = [`spotify:track:${this.currentTrackId}`]
      }

      this.$axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
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
      sendTrackState: 'room/sendTrackState',
    }),
  },
}
</script>
