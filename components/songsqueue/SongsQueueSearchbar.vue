<template>
  <div class="song-queue-search-bar relative">
    <input
      v-model="songQuery"
      class="text-black"
      type="text"
      placeholder="Ta chanson"
      @input="onType"
    />
    <ul
      v-if="searchResult.length && songQuery.length >= 3"
      class="bg-black absolute w-full"
    >
      <songs-queue-item
        v-for="song in searchResult"
        :key="song.id"
        :song="song"
        @add_song="songQuery = ''"
      />
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SongsQueueSearchbar',
  data: () => ({
    songQuery: '',
    searchResult: [],
  }),
  methods: {
    onType() {
      if (this.songQuery.length < 3) return
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
          if (res.data.tracks.items.length)
            this.searchResult = res.data.tracks.items
          console.log(res)
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
}
</script>

<style scoped></style>
