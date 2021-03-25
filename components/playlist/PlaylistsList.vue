<template>
  <div>
    <div v-if="playlists.length" class="playlists_list">
      <playlist-item
        v-for="playlist in playlists"
        :key="playlist.id"
        class="mt-2"
        :playlist="playlist"
      />
    </div>
    <div v-else>
      <p>Vous n'avez pas encore de playlists !</p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Playlists',
  computed: {
    ...mapState({
      playlists: (state) => state.spotify.playlists,
    }),
  },
  created() {
    if (!this.playlists.length) {
      this.$axios
        .get(`${process.env.SPOTIFY_BASE_API_URL}/me/playlists`, {
          credentials: true,
          headers: {
            Authorization: `Bearer ${this.$cookies.get('access_token')}`,
          },
        })
        .then((res) => {
          this.setPlaylists(res.data.items)
        })
    }
  },
  methods: {
    ...mapMutations({
      setPlaylists: 'spotify/SET_PLAYLISTS',
    }),
  },
}
</script>

<style lang="scss" scoped></style>
