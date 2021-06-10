<template>
  <ul v-if="songsHistory.length" class="songs-queue">
    <songs-queue-item
      v-for="(song, index) in historyQueue"
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
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'HistoryQueue',
  computed: {
    ...mapState({
      roomState: (state) => state.room.roomState,
      blindtestHistory: (state) => state.blindtest.historyTracks,
    }),
    ...mapGetters({
      songsHistory: 'room/songsHistory',
    }),
    historyQueue() {
      return this.roomState === 'blindtest'
        ? this.songsHistory
        : this.blindtestHistory
    },
  },
}
</script>

<style scoped></style>
