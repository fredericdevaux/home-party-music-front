<template>
  <div class="blindtest h-full text-white">
    <div class="genres grid grid-cols-3 gap-1.5" v-if="isAdmin && blindtestState === 'choosing' && genres && genres.length">
      <blindtest-genre-card :key="genre.id" v-for="genre in genres" :genre="genre" />
    </div>
    <div v-else-if="!isAdmin && blindtestState === 'choosing'">
      L'admin choisi un genre
    </div>
    <div v-if="blindtestState === 'load_songs'">
      Tracks loading
    </div>
    <div class="text-center" v-if="blindtestState === 'playing'">
      Round {{round}} <span v-if="audio">({{currentTime}} / 30)</span>
      <input type="text" placeholder="Proposition">
      <audio ref="audio">
        <source :src="currentTrack.previewUrl">
      </audio>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Blindtest',
  data: () => ({
    genres: [],
    audio: null,
    currentTime: 0
  }),
  computed: {
    ...mapState({
      blindtestState: (state) => state.blindtest.blindtestState,
      round: (state) => state.blindtest.round,
      currentTrack: (state) => state.blindtest.currentTrack
    }),
    ...mapGetters({
      isAdmin: 'room/isAdmin',
    })
  },
  watch: {
    currentTrack(newVal) {
      console.log(newVal)
      if (newVal.previewUrl) {
        this.audio = new Audio(newVal.previewUrl)
        this.audio.addEventListener('timeupdate', () => { this.currentTime = this.audio.currentTime.toFixed() })
        this.audio.play();
      }
    }
  },
  created() {
    this.$axios.get(`${process.env.SPOTIFY_BASE_API_URL}/browse/categories`, {
      params: {
        country: 'FR',
        limit: 12
      },
      credentials: true,
      headers: {
        Authorization: `Bearer ${this.$cookies.get('access_token')}`,
      },
    }).then(res => {
      console.log(res)
      this.genres = res.data.categories.items
    }).catch(err => {
      console.error(err)
    })
  }
}
</script>

<style scoped>

</style>
