<template>
  <div
    class="blindtest-genre-card cursor-pointer relative"
    @click="getGenreSongs(genre.id)"
  >
    <img :src="genre.icons[0].url" alt="" />
    <div
      class="bg-purple-500 opacity-80 absolute h-full w-full top-0 left-0"
    ></div>
    <h3
      class="
        font-bold
        absolute
        top-1/2
        transform
        -translate-x-1/2 -translate-y-1/2
        left-1/2
        text-center
      "
    >
      {{ genre.name }}
    </h3>
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
