<template>
  <div>
    <div class="header">
      <h1>SquadParty</h1>
      <div v-if="spotifyUser" class="header__user">
        <img
          :src="spotifyUser.images[0].url"
          :alt="`Utilisateur ${spotifyUser.id}`"
        />

        <nuxt-link :to="{ name: 'profile' }">{{ spotifyUser.id }}</nuxt-link>
      </div>
      <a v-else :href="loginUrl">Connexion avec Spotify</a>
    </div>
    <Nuxt />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    loginUrl() {
      return `${process.env.SERVER_URL}/login`
    },
    ...mapState({
      spotifyUser: (state) => state.spotify.user,
    }),
  },
  created() {
    if (process.client) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      const urlParams = new URLSearchParams(window.location.search)
      const spotifyAccessToken = urlParams.get('access_token')
      if (spotifyAccessToken) {
        this.$cookies.set('spotify_access_token', spotifyAccessToken)
      }
    }
    const spotifyAccessToken = this.$cookies.get('spotify_access_token')
    if (spotifyAccessToken) {
      this.$axios
        .get(`${process.env.SPOTIFY_BASE_API_URL}/me`, {
          credentials: true,
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        })
        .then((res) => {
          this.setSpotifyUser(res.data)
        })
        .catch((err) => {
          console.error(err) // @TODO gérer le cas d'erreur
        })
    }
  },
  mounted() {
    const client = new this.$colyseus.Client(process.env.WEBSOCKET_URL)
    this.setClient(client)
  },
  methods: {
    ...mapMutations({
      setClient: 'client/SET_CLIENT',
      setSpotifyUser: 'spotify/SET_USER',
    }),
  },
}
</script>

<style lang="scss" scoped>
.header__user {
  display: flex;
  align-items: center;

  img {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }

  p {
    text-decoration: underline;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 24px;
    margin: 0;
  }
}
</style>
