<template>
  <div>
    <nuxt-link class="button" :to="{ name: 'room-create' }">
      Créer une room
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'Index',
  layout: 'default',
  middleware: ['spotify', 'tokens'],
}
</script>

<style scoped>
.button {
  @apply border border-white p-4 rounded-xl;
}
</style>
