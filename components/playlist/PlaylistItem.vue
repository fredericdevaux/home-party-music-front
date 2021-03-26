<template>
  <div
    class="flex flex-row items-center cursor-pointer rounded-3xl overflow-hidden p-2.5"
    :class="{ 'bg-green-600': isActive }"
    @click="
      setRoomPlaylist({ playlistId: playlist.id, playlistUri: playlist.uri })
    "
  >
    <img
      class="rounded-full overflow-hidden w-24 mr-3"
      :src="playlist.images[0].url"
      :alt="`Cover de la playlist ${playlist.name}`"
    />
    <a :class="{ 'font-bold': isActive }" target="_blank">{{
      playlist.name
    }}</a>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'PlaylistItem',
  props: {
    playlist: {
      required: true,
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    isActive() {
      return this.roomPlaylistId === this.playlist.id
    },
    ...mapState({
      roomPlaylistId: (state) => state.room.playlistId,
    }),
  },
  methods: {
    ...mapMutations({
      setRoomPlaylist: 'room/SET_PLAYLIST',
    }),
  },
}
</script>

<style scoped></style>
