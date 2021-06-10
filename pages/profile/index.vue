<template>
  <div class='h-full'>
    <div class='container mx-auto'>
      <nuxt-link class='hover:bg-purple-800 bg-purple-600 rounded-md text-white p-2 mt-4 font-bold' :to="{ name: 'room-create' }">
        Créer une room
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  layout: 'default',
  middleware: ['spotify', 'tokens']
}
</script>

<style scoped>
.button {
  @apply border border-white p-4 rounded-xl;
}
</style>
