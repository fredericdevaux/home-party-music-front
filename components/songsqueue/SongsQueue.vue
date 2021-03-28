<template>
  <ul v-if="songsQueue.length" class="songs-queue">
    <songs-queue-item
      v-for="song in songsQueue"
      :key="song.id"
      :is-added="true"
      :song="song"
    />
  </ul>
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
