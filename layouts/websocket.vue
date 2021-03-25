<template>
  <div class="bg-black h-screen text-white">
    <div
      class="text-white w-full px-8 pt-1 pb-1 mx-auto flex flex-row justify-between items-center fixed"
    >
      <h1 class="text-4xl">SquadParty</h1>
      <div v-if="spotifyUser" class="flex flex-row items-center">
        <img
          v-if="spotifyUser.images.length"
          class="w-12 rounded-full mr-6"
          :src="spotifyUser.images[0].url"
          :alt="`Utilisateur ${spotifyUser.id}`"
        />

        <nuxt-link class="underline" :to="{ name: 'profile' }">{{
          spotifyUser.id
        }}</nuxt-link>
      </div>
      <a v-else :href="loginUrl">Connexion avec Spotify</a>
    </div>
    <div class="pt-16 h-full">
      <Nuxt />
    </div>
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
  mounted() {
    const client = new this.$colyseus.Client(process.env.WEBSOCKET_URL)
    this.setClient(client)
  },
  methods: {
    ...mapMutations({
      setClient: 'client/SET_CLIENT',
    }),
  },
}
</script>

<style>
body {
  font-family: Roboto;
}
input {
  color: black;
}
</style>
