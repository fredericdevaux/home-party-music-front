export default async function ({ app, redirect, store, route }) {
  const spotifyAccessToken = app.$cookies.get('access_token')
  const loginRedirect = `${process.env.SERVER_URL}/login?to=${route.path}`
  if (spotifyAccessToken) {
    await app.$axios
      .get(`${process.env.SPOTIFY_BASE_API_URL}/me`, {
        credentials: true,
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      })
      .then((res) => {
        store.commit('spotify/SET_USER', res.data, { root: true })
        store.commit('user/SET_ID', res.data.id, { root: true })
        store.commit('user/SET_AVATAR_URL', res.data.images[0].url, {
          root: true,
        })
        store.commit('user/SET_USERNAME', res.data.id, { root: true })
      })
      .catch(async (err) => {
        const status = err.response.status
        if (status === 401) {
          if (app.$cookies.get('refresh_token')) {
            await app.$axios
              .get(`${process.env.SERVER_URL}/refresh_token`, {
                params: {
                  refresh_token: app.$cookies.get('refresh_token'),
                },
              })
              .then((res) => {
                app.$cookies.set('access_token', res.access_token)
              })
              .catch(() => {
                redirect(`${loginRedirect}`)
              })
          } else {
            redirect(`${loginRedirect}`)
          }
        }
      })
  } else {
    redirect(`${loginRedirect}`)
  }
}
