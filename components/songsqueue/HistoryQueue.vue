<template>
  <ul v-if="songsHistory.length" class="songs-queue">
    <songs-queue-item
      v-for="(song, index) in songsHistory"
      :key="index"
      :is-added="true"
      :song="song"
    />
  </ul>
  <p v-else class="text-center p-3.5">
    Il n'y a pas de musiques dans l'historique
  </p>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HistoryQueue',
  computed: {
    ...mapGetters({
      songsHistory: 'room/songsHistory',
    }),
  },
}
</script>

<style scoped></style>
