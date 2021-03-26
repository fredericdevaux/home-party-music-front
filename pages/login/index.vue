<template>
  <div class="h-screen flex justify-center items-center">
    <a
      :href="loginUrl"
      class="rounded-full text-white py-4 px-6 bg-green-600 font-bold"
      >SE CONNECTER</a
    >
  </div>
</template>

<script>
export default {
  name: 'Index',
  computed: {
    loginUrl() {
      return `${process.env.SERVER_URL}/login`
    },
  },
  created() {
    // @TODO à faire au niveau du middleware p-e ?
    if (process.client) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString)
      urlParams.get('refresh_token') &&
        this.$cookies.set('refresh_token', urlParams.get('refresh_token'))
      urlParams.get('access_token') &&
        this.$cookies.set('access_token', urlParams.get('access_token'))
      urlParams.get('access_token') && this.$router.push('/')
    }
  },
}
</script>

<style scoped></style>
