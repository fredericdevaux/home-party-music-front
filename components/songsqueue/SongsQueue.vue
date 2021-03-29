<template>
  <ul v-if="songsQueue.length" class="songs-queue">
    <songs-queue-item
      v-for="(song, index) in songsQueue"
      :key="index"
      :is-added="true"
      :song="song"
    />
  </ul>
  <p v-else class="text-center p-3.5">
    Il n'y a pas de musiques dans la file d'attente
  </p>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SongQueueList',
  computed: {
    ...mapState({ songsQueue: (state) => state.room.songsQueue }),
  },
}
</script>

<style scoped></style>
