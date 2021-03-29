<template>
  <div class="chatroom-members">
    <div
      v-for="member in members"
      :key="member.sessionId"
      class="flex items-center p-1.5 border-b"
    >
      <img class="w-10" :src="member.avatarUrl" alt="" />
      <i
        v-if="isAdmin(member.id)"
        class="ml-1.5 text-yellow-300"
        title="Administrateur de la room"
      >
        <star class="w-5 h-5" />
      </i>
      <p class="ml-1.5">{{ member.username }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import star from '~/assets/svg/star.svg?inline'
export default {
  name: 'ChatroomMembers',
  components: {
    star,
  },
  computed: {
    ...mapState({
      members: (state) => state.room.users,
    }),
    ...mapGetters({
      admin: 'room/admin',
    }),
  },
  methods: {
    isAdmin(userId) {
      return userId === this.admin.id
    },
  },
}
</script>

<style scoped></style>
