<template>
  <div>
    <a :href="loginUrl">Test login</a>
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
