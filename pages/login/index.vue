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
}
</script>

<style scoped></style>
