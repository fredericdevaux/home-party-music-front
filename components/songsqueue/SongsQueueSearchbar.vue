<template>
  <div class="song-queue-search-bar relative">
    <input
      v-model="songQuery"
      class="p-2 text-black w-full"
      type="text"
      placeholder="Choisis la prochaine masterclass de la room"
      @input="onType"
      @keydown="navigateInResults"
    />
    <ul v-if="isOpen" class="bg-black absolute w-full z-40">
      <songs-queue-item
        v-for="(song, index) in searchResult"
        :key="song.id"
        ref="result"
        :class="{ 'bg-purple-600': activeResultIndex === index }"
        :song="song"
        @add_song="songQuery = ''"
      />
      <p v-if="!searchResult.length" class="text-center p-3.5">
        Il n'y a pas de résultats pour cette recherche
      </p>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SongsQueueSearchbar',
  data: () => ({
    songQuery: '',
    searchResult: [],
    activeResultIndex: 0,
  }),
  computed: {
    isOpen() {
      return this.songQuery.length >= 3
    },
  },
  watch: {
    isOpen(newVal) {
      if (!newVal) this.activeResultIndex = 0
    },
  },
  methods: {
    onType() {
      if (!this.isOpen) {
        this.searchResult = []
        return
      }
      this.$axios
        .get(`${process.env.SPOTIFY_BASE_API_URL}/search`, {
          params: {
            q: this.songQuery,
            type: 'track',
            limit: 5,
            market: 'FR',
          },
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        })
        .then((res) => {
          if (res.data.tracks.items.length) {
            this.searchResult = res.data.tracks.items
          } else {
            this.searchResult = []
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    navigateInResults(e) {
      if (!this.isOpen) return
      if (e.keyCode === 13) {
        this.$refs.result[this.activeResultIndex] &&
          this.$refs.result[this.activeResultIndex].addSong(
            this.searchResult[this.activeResultIndex]
          )
      }

      if (e.keyCode === 40 || e.keyCode === 38) {
        e.preventDefault()
        if (this.$refs.result.length) {
          if (
            e.keyCode === 40 &&
            this.$refs.result[this.activeResultIndex + 1]
          ) {
            this.activeResultIndex++
          } else if (
            e.keyCode === 40 &&
            !this.$refs.result[this.activeResultIndex + 1]
          ) {
            this.activeResultIndex = 0
          }

          if (
            e.keyCode === 38 &&
            this.$refs.result[this.activeResultIndex - 1]
          ) {
            this.activeResultIndex--
          } else if (
            e.keyCode === 38 &&
            !this.$refs.result[this.activeResultIndex - 1]
          ) {
            this.activeResultIndex = this.$refs.result.length - 1
          }
        }
        console.log(this.$refs.result.length, this.activeResultIndex)
      }
    },
  },
}
</script>

<style scoped></style>
