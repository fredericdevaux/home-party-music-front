<template>
  <div v-if="player">
    <div
      class="bg-purple-300 overflow-hidden"
      :class="{ 'cursor-pointer': isAdmin }"
      @click="setSeek"
    >
      <div
        class="
          bg-purple-800
          transform
          -translate-x-full
          h-2
          pointer-events-none
        "
        :style="{ transform: `translateX(-${progressionPercentage}%)` }"
      ></div>
    </div>
    <div
      class="
        flex
        justify-between
        items-center
        bg-black
        text-white
        w-auto
        outline-none
      "
    >
      <div class="flex infos flex-grow items-center overflow-hidden">
        <img
          :src="currentTrackCover"
          alt=""
          class="self-center block w-16 h-16 mr-4"
        />
        <div class="flex-col flex justify-center overflow-hidden">
          <p v-if="currentTrackName">
            {{ currentTrackName }}
          </p>
          <p v-else>Ajoute une musique à la file d'attente pour commencer</p>
          <p v-if="currentTrackArtists" class="text-gray-500">
            {{ currentTrackArtists }}
          </p>
        </div>
      </div>

      <div class="flex justify-between controls pr-4">
        <button
          v-if="isPlaying && isAdmin"
          class="ml-1.5"
          title="Mettre en pause"
          @click="pause"
        >
          <i>
            <pause class="w-10 h-10" />
          </i>
        </button>
        <button
          v-else-if="!isPlaying && isAdmin"
          class="ml-1.5"
          title="Lire la chanson"
          :disabled="roomState !== 'default'"
          @click="resume"
        >
          <i>
            <play class="w-10 h-10" />
          </i>
        </button>
        <button
          v-if="isAdmin"
          class="ml-1.5"
          title="Chanson suivante"
          :disabled="roomState !== 'default'"
          @click="next"
        >
          <i>
            <next class="w-10 h-10" />
          </i>
        </button>
        <div
          class="ml-2.5 relative h-10"
          @mouseover="showVolumeRange = true"
          @mouseleave="showVolumeRange = false"
        >
          <div
            v-if="showVolumeRange"
            class="
              left-1/2
              origin-center
              -translate-x-1/2
              absolute
              volume-container
              transform
              -rotate-90
              p-3.5
              z-10
            "
          >
            <input
              class="
                rounded
                cursor-pointer
                overflow-hidden
                appearance-none
                bg-gray-400
                h-3
                w-128
              "
              type="range"
              min="0"
              max="100"
              step="1"
              :value="volumePercent"
              @input="setVolume($event, false)"
            />
          </div>
          <button
            @click="
              setVolume(
                $event,
                true,
                oldVolume === 0 || volumePercent !== 0 ? 0 : oldVolume
              )
            "
          >
            <i>
              <mute v-if="volumePercent <= 0" class="w-10 h-10" />
              <sound
                v-else
                class="w-10 h-10 sound"
                :class="{
                  'sound--medium': volumePercent <= 66 && volumePercent > 33,
                  'sound--low': volumePercent <= 33 && volumePercent > 0,
                }"
              />
            </i>
          </button>
        </div>
      </div>
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
import mute from '~/assets/svg/mute.svg?inline'

export default {
  name: 'Player',
  components: {
    play,
    pause,
    next,
    sound,
    mute,
  },
  data: () => ({
    player: null,
    showVolumeRange: false,
    oldVolume: 0,
    isChanging: false,
  }),
  computed: {
    progressionPercentage() {
      return 100 - (this.playerProgress * 100) / this.currentTrackDuration
    },
    ...mapState({
      username: (state) => state.user.username,
      deviceId: (state) => state.player.deviceId,
      volumePercent: (state) => state.player.volume,
      songsQueue: (state) => state.room.songsQueue,
      nextSongHistory: (state) => state.room.nextSongHistory,
      roomState: (state) => state.room.roomState,
      playerProgress: (state) => state.player.playerProgress,
    }),
    ...mapGetters({
      isAdmin: 'room/isAdmin',
      currentTrackArtists: 'player/currentTrackArtists',
      currentTrackName: 'player/currentTrackName',
      currentTrackCover: 'player/currentTrackCover',
      currentTrackId: 'player/currentTrackId',
      currentTrackUid: 'player/currentTrackUid',
      currentTrackProgress: 'player/currentTrackProgress',
      currentTrackDuration: 'player/currentTrackDuration',
      isPlaying: 'player/isPlaying',
    }),
  },
  watch: {
    roomState(newVal) {
      if (newVal === 'default' && !this.isPlaying && this.isAdmin) {
        this.play()
      } else if (newVal !== 'default' && this.isPlaying && this.isAdmin) {
        this.pause()
      }
    },
    isPlaying(newVal) {
      !this.isAdmin && this[!newVal ? 'pause' : 'resume']()
    },
    songsQueue(newVal) {
      newVal[0] && !this.currentTrackUid && this.play(newVal[0].uri)
    },
    currentTrackUid(newVal) {
      !this.isAdmin && this.play(`spotify:track:${this.currentTrackId}`)
      this.isAdmin && this.deleteSongFromQueue(this.currentTrackId)
    },
    currentTrackProgress(newVal, oldVal) {
      this.setPlayerProgress(newVal)
      if (Math.abs(newVal - oldVal) > 2000) {
        !this.isAdmin && this.seek(newVal)
      }
    },
    volumePercent(newVal, oldVal) {
      this.oldVolume = oldVal
      this.$axios.put(
        `${process.env.SPOTIFY_BASE_API_URL}/me/player/volume?volume_percent=${newVal}&device_id=${this.deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        }
      )
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
          if (this.isChanging) return
          this.isAdmin && this.updateTrackState(state)
          // dans le cas où une musique se change sans action des users
          if (
            state.track_window.previous_tracks.find(
              (x) => x.id === state.track_window.current_track.id
            )
          ) {
            this.isAdmin && this.next()
          }
        })

        this.player.addListener('ready', (data) => {
          this.setDeviceId(data.device_id)
          setInterval(() => {
            if (this.isPlaying) this.incrementPlayerProgress(100)
          }, 100)
          let position = this.currentTrackProgress
          if (!this.isAdmin) position = position + 2000
          this.currentTrackId &&
            this.play(`spotify:track:${this.currentTrackId}`, position)
        })

        this.player.connect()
      }
    }
  },
  beforeDestroy() {
    this.player && this.player.disconnect()
  },
  methods: {
    next() {
      if (this.songsQueue.length) {
        this.addSongToHistory(this.nextSongHistory)
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
      if (!this.deviceId) return
      const data = {
        position_ms: position,
      }

      data.uris = [trackUri]
      this.isChanging = true
      this.$axios
        .put(
          `${process.env.SPOTIFY_BASE_API_URL}/me/player/play?device_id=${this.deviceId}`,
          data,
          {
            credentials: true,
            headers: {
              Authorization: `Bearer ${this.$cookies.get('access_token')}`,
            },
          }
        )
        .then((res) => {
          this.isChanging = false
        })
        .catch((err) => {
          console.error(err)
          this.isChanging = false
        })
    },
    seek(position) {
      this.$axios.put(
        `${process.env.SPOTIFY_BASE_API_URL}/me/player/seek?position_ms=${position}&device_id=${this.deviceId}`,
        {},
        {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        }
      )
    },
    setSeek(e) {
      if (!this.isAdmin || this.roomState !== 'default') return null
      const seekPercentage = (e.layerX * 100) / e.target.clientWidth
      const position = Math.trunc(
        (seekPercentage * this.currentTrackDuration) / 100
      )
      this.seek(position)
    },
    setVolume(e, applyValue = false, value = 0) {
      const volumePercent = applyValue ? value : e.target.value
      this.changeVolume(volumePercent)
    },
    ...mapMutations({
      setDeviceId: 'player/SET_DEVICE_ID',
      changeVolume: 'player/CHANGE_VOLUME',
      setPlayerProgress: 'player/SET_PLAYER_PROGRESS',
      incrementPlayerProgress: 'player/INCREMENT_PLAYER_PROGRESS',
    }),
    ...mapActions({
      updateTrackState: 'room/updateTrackState',
      deleteSongFromQueue: 'room/deleteSongFromQueue',
      addSongToHistory: 'room/addSongToHistory',
    }),
  },
}
</script>

<style lang="scss">
.infos {
  p {
    @apply whitespace-nowrap overflow-ellipsis overflow-hidden;
  }
}

.sound {
  &.sound--low {
    .up-bar,
    .medium-bar {
      display: none;
    }
  }

  &.sound--medium {
    .up-bar {
      display: none;
    }
  }
}

.volume-container {
  top: -225%;
}

@media screen and (-webkit-min-device-pixel-ratio: 0) {
  input[type='range']::-webkit-slider-thumb {
    width: 15px;
    -webkit-appearance: none;
    appearance: none;
    height: 15px;
    cursor: ew-resize;
    background: #fff;
    box-shadow: -405px 0 0 400px #605e5c;
    border-radius: 50%;

    @apply cursor-pointer;
  }
}
</style>
