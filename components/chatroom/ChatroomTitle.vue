<template>
  <div class="chatroom-title">Room : {{ roomId }}</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ChatroomTitle',
  computed: {
    ...mapState({
      roomId: (state) => state.room.room.id,
    }),
  },
}
</script>

<style scoped></style>
