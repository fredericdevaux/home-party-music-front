<template>
  <div
    class="blindtest-genre-card cursor-pointer"
    @click="getGenreSongs(genre.id)"
  >
    <img :src="genre.icons[0].url" alt="" />
    <h3>{{ genre.name }}</h3>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'BlindtestGenreCard',
  props: {
    genre: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
  },
  methods: {
    ...mapActions({
      getGenreSongs: 'blindtest/getGenreSongs',
    }),
  },
}
</script>

<style scoped></style>
