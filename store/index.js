export const strict = false
export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  async nuxtServerInit({ commit, state }) {
    /* try {
      // if (state.isConnected) {
      const spotifyAccessToken = this.$cookies.get('access_token')
      await this.$axios
        .get(
          `${process.env.SPOTIFY_BASE_API_URL}/me/player/currently-playing`,
          {
            headers: {
              credentials: true,
              Authorization: `Bearer ${spotifyAccessToken}`,
            },
          }
        )
        .then((res) => {
          commit('SET_NOW_PLAYING', res.data)
          commit('SET_IS_PLAYING', res.data.is_playing)
        })
      // commit('SET_NOW_PLAYING', item)
      // commit('SET_NOW_PLAYING', is_playing)
      //    }
    } catch (err) {
      console.error(err)
    } */
  },
}
