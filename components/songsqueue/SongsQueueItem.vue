<template>
  <li
    class="song-queue-result-item flex items-center whitespace-nowrap overflow-hidden"
    @click="addSong(song)"
  >
    <img class="w-10" :src="cover" alt="" />
    <h5 class="ml-1.5 whitespace-nowrap overflow-ellipsis overflow-hidden">
      {{ song.name }} - <span class="text-gray-500">{{ artists }}</span>
    </h5>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'SongQueueResultItem',
  props: {
    isAdded: {
      type: Boolean,
      required: false,
      default() {
        return false
      },
    },
    song: {
      required: true,
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    cover() {
      return this.isAdded ? this.song.imageUrl : this.song.album.images[0].url
    },
    artists() {
      return this.song.artists.map((artist) => artist.name).join(', ')
    },
  },
  methods: {
    addSong(song) {
      this.$emit('add_song')
      this.addSongToQueue(song)
    },
    ...mapActions({
      addSongToQueue: 'room/addSongToQueue',
    }),
  },
}
</script>

<style scoped></style>
