<template>
  <div>
    <div v-if="room" class="room flex">
      <div class="room__part flex-grow"></div>
      <div class="w-1/3">
        <p>{{ currentTrackArtists + ' - ' + currentTrackName }}</p>
        <chatroom />
      </div>
    </div>
    <div v-else>
      <label for="username">Nom d'utilisateur</label>
      <input id="username" v-model="username" type="text" name="username" />
      <button
        :disabled="!username.length && username.length < 3"
        @click="joinRoom()"
      >
        Rejoindre la room
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import Chatroom from '../../components/chatroom/Chatroom'
export default {
  name: 'Id',
  components: { Chatroom },
  middleware: 'spotify',
  layout: 'websocket',
  data: () => ({
    usernameModel: '',
    deviceId: 0,
    player: null,
  }),
  computed: {
    username: {
      get() {
        return this.usernameState
      },
      set(value) {
        this.setUsername(value)
      },
    },
    ...mapState({
      client: (state) => state.client.client,
      usernameState: (state) => state.user.username,
      room: (state) => state.room.room,
      playlistUri: (state) => state.room.playlistUri,
      trackState: (state) => state.room.trackState,
    }),
    ...mapGetters({
      admin: 'room/admin',
      currentTrackArtists: 'room/currentTrackArtists',
      currentTrackName: 'room/currentTrackName',
      currentTrackId: 'room/currentTrackId',
      currentTrackPosition: 'room/currentTrackPosition',
    }),
  },
  watch: {
    trackState(oldVal, newVal) {
      if (oldVal?.item?.id === newVal?.item?.id) {
        // changer position
        this.seek(this.currentTrackPosition, this.deviceId)
      } else {
        console.log('NEW VAL', this.currentTrackId)
      }
    },
  },
  created() {
    this.username && !this.room && this.joinRoom()
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

        this.player.on('initialization_error', (e) => console.error(e))
        this.player.on('authentication_error', (e) => console.error(e))
        this.player.on('account_error', (e) => console.error(e))
        this.player.on('playback_error', (e) => console.error(e))

        this.player.on('player_state_changed', (state) => {
          console.log(state)
          ;((this.usernameState === this.admin &&
            state.track_window.current_track.id === this.currentTrackId &&
            Math.abs(state.position - this.currentTrackPosition) > 1000) ||
            state.track_window.current_track.id !== this.currentTrackId) &&
            this.sendTrackState()
        })

        this.player.on('ready', (data) => {
          console.log('ready', 'COUCOU')
          this.deviceId = data.device_id
          this.play(this.deviceId, this.currentTrackPosition)
        })

        this.player.connect()
      }
    }
  },
  methods: {
    joinRoom() {
      this.client
        .joinById(this.$route.params.id, {
          username: this.username,
        })
        .then((room) => {
          this.setRoom(room)
          setTimeout(() => {
            console.log(this.currentTrackId)
            this.play(this.deviceId, this.currentTrackPosition)
          }, 2000)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    play(deviceId, offsetTrack = 0, position = 0) {
      const data = {
        position_ms: position,
      }

      if (this.usernameState === this.admin) {
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
      setUsername: 'user/SET_USERNAME',
      setTrackState: 'room/SET_TRACK_STATE',
    }),
    ...mapActions({
      setRoom: 'room/setRoom',
      sendTrackState: 'room/sendTrackState',
    }),
  },
  head() {
    return {
      script: [
        {
          hid: 'spotify-player',
          src: 'https://sdk.scdn.co/spotify-player.js',
          defer: true,
        },
      ],
    }
  },
}
</script>
