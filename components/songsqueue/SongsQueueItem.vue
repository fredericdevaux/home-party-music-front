<template>
  <li
    class="song-queue-result-item flex items-center p-1.5 border-b"
    :class="{ 'cursor-pointer hover:bg-purple-600': !isAdded }"
    @click="addSong(song)"
  >
    <img class="w-10" :src="cover" alt="" />

    <div class="ml-1.5 overflow-hidden text-gray-500">
      <h5 class="whitespace-nowrap overflow-ellipsis overflow-hidden">
        <span class="text-white">{{ song.name }}</span> - {{ artists }}
      </h5>
      <p
        v-if="song.queueBy"
        class="text-gray-500 text-xs whitespace-nowrap overflow-ellipsis overflow-hidden"
      >
        Proposé par {{ song.queueBy.username }}
      </p>
    </div>
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
      if (this.isAdded) return null
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
