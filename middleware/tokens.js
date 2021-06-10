export default async function ({ app, redirect, route }) {
  if (route.query.access_token) {
    await app.$cookies.set('access_token', route.query.access_token)
  }
  if (route.query.refresh_token) {
    await app.$cookies.set('refresh_token', route.query.refresh_token)
  }

  if (route.query.to) {
    redirect(route.query.to)
  } else if (route.query.access_token) {
    redirect('/profile')
  }
}
