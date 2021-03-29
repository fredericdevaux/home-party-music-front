<template>
  <div
    class="text-white w-full px-8 pt-2 pb-2 mx-auto flex flex-row justify-between items-center fixed z-50 bg-black"
  >
    <h1 class="text-4xl"><nuxt-link :to="'/'">SquadParty</nuxt-link></h1>
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
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    loginUrl() {
      return `${process.env.SERVER_URL}/login`
    },
    ...mapState({
      spotifyUser: (state) => state.spotify.user,
    }),
  },
}
</script>
