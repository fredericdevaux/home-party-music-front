export default function ({ app, redirect, route }) {
  if (route.query.access_token) {
    app.$cookies.set('access_token', route.query.access_token)
  }
  if (route.query.refresh_token) {
    app.$cookies.set('refresh_token', route.query.refresh_token)
  }

  if (route.query.to) {
    redirect(route.query.to)
  }
}
