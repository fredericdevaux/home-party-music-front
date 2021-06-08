<template>
  <div @click="getGenreSongs(genre.id)" class="blindtest-genre-card cursor-pointer">
    <img :src="genre.icons[0].url" alt="">
    <h3>{{genre.name}}</h3>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'BlindtestGenreCard',
  props: {
    genre: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  methods: {
    ...mapActions({
      getGenreSongs: 'blindtest/getGenreSongs'
    })
  }
}
</script>

<style scoped>

</style>
