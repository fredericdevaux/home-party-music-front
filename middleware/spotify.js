export default function ({ app, redirect }) {
  const spotifyAccessToken = app.$cookies.get('access_token') || {}
  if (!spotifyAccessToken) {
    // @TODO check si il ya un access token, est-ce qu'il est valide ?
    redirect('/login')
  }
}
