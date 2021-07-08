<template>
  <div
    class="
      text-white
      w-full
      px-8
      pt-2
      pb-2
      mx-auto
      flex flex-row
      justify-between
      items-center
      fixed
      z-50
      bg-black
    "
  >
    <h1 class="text-4xl">
      <nuxt-link :to="'/'"
        ><img class="w-44" src="/images/logo.png"
      /></nuxt-link>
    </h1>
    <nuxt-link class="ml-auto mr-8 underline" :to="{ name: 'store' }">Boutique</nuxt-link>
    <div v-if="spotifyUser" class="flex flex-row items-center">
      <img
        class="w-12 rounded-full mr-3"
        :src="
          spotifyUser.images.length
            ? spotifyUser.images[0].url
            : '/images/default-user.png'
        "
        :alt="`Utilisateur ${spotifyUser.id}`"
      />

      <nuxt-link class="underline" :to="{ name: 'profile' }">{{
        spotifyUser.id
      }}</nuxt-link>
    </div>
    <a v-else class='hover:bg-purple-800 bg-purple-600 rounded-md text-white p-2 font-bold' :href="loginUrl">Connexion avec Spotify</a>
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
