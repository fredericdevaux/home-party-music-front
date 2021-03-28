<template>
  <div
    v-if="player"
    class="flex justify-between items-center bg-gray-800 p-4 text-white w-auto mt-12 outline-none"
  >
    <div class="flex">
      <div class="flex infos items-center">
        <img :src="currentTrackCover" alt="" class="self-center w-16 mr-4" />
        <!--    <p>{{ currentTrackName }} - {{ currentTrackArtists }}</p>-->
        <div class="flex-col flex justify-center overflow-hidden">
          <p>
            {{ currentTrackName }}
          </p>
          <p>
            {{ currentTrackArtists }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="isAdmin" class="flex w-40 justify-between controls">
      <button title="Chanson précédente" @click="previous">
        <i
          ><svg
            class="w-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
            /></svg
        ></i></button
      ><button v-if="isPlaying" title="Mettre en pause" @click="pause">
        <i
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="w-10"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
        ></i>
      </button>
      <button v-else title="Lire la chanson" @click="resume">
        <i>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            class="w-10"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </i>
      </button>
      <button title="Chanson suivante" @click="next">
        <i
          ><svg
            class="w-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
            /></svg
        ></i>
      </button>
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
      songsQueue: (state) => state.room.songsQueue,
    }),
    ...mapGetters({
      isAdmin: 'room/isAdmin',
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
      !this.isAdmin && this[!newVal ? 'pause' : 'resume']()
      this.$emit('toggle_pause_video', newVal)
    },
    songsQueue(newVal) {
      newVal[0] && !this.currentTrackId && this.play(newVal[0].uri)
    },
    currentTrackId(newVal) {
      !this.isAdmin && this.play(`spotify:track:${newVal}`)
      this.songsQueue.find((song) => {
        song.id === newVal && this.deleteSongFromQueue(song.id)
      })
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
              Authorization: `Bearer ${this.$cookies.get('access_token')}`,
            },
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
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
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
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
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
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        }
      )
    },
    play(trackUri, position = 0) {
      const data = {
        position_ms: position,
      }

      data.uris = [trackUri]

      this.$axios.put(
        `${process.env.SPOTIFY_BASE_API_URL}/me/player/play?device_id=${this.deviceId}`,
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
        `${process.env.SPOTIFY_BASE_API_URL}/me/player/seek?position_ms=${position}&device_id=${deviceId}`,
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
      deleteSongFromQueue: 'room/deleteSongFromQueue',
    }),
  },
}
</script>

<style lang="scss">
.infos {
  max-width: 160px;
  p {
    @apply whitespace-nowrap overflow-ellipsis overflow-hidden;
  }
}
</style>
