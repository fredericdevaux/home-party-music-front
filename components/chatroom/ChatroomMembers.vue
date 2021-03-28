<template>
  <div class="chatroom-members">
    Participants ({{ members.length }}) :
    <span v-for="(member, index) in members" :key="member.sessionId"
      >{{ member.username
      }}<template v-if="index + 1 !== members.length">, </template></span
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ChatroomMembers',
  computed: {
    ...mapState({
      members: (state) => state.room.users,
    }),
  },
}
</script>

<style scoped></style>
