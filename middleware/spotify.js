export default function ({ app, redirect, store }) {
  const spotifyAccessToken = app.$cookies.get('access_token')
  if (spotifyAccessToken) {
    return app.$axios
      .get(`${process.env.SPOTIFY_BASE_API_URL}/me`, {
        credentials: true,
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      })
      .then((res) => {
        store.commit('spotify/SET_USER', res.data, { root: true })
      })
      .catch((err) => {
        const status = err.response.status
        if (status === 401) {
          //  dispatch('refreshToken')
          redirect('/login')
        }
      })
  } else {
    redirect('/login')
  }
}
