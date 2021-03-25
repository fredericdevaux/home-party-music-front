<template>
  <div class="h-full w-full flex justify-center items-center">
    <nuxt-link class="button" :to="{ name: 'room-create' }">
      Créer une room
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'Index',
  layout: 'websocket',
  middleware: 'spotify',
}
</script>

<style scoped>
.button {
  @apply border border-white p-4 rounded-xl;
}
</style>
