<template>
  <div class="chatroom-members">
    <div
      v-for="(member, index) in prettyMembers"
      :key="member.sessionId"
      class="flex items-center p-1.5 border-b"
    >
      <span v-if="roomState === 'blindtest'" class="mr-1.5">
        {{ index + 1 }}.
      </span>
      <img
        class="w-10"
        :src="member.avatarUrl ? member.avatarUrl : '/images/default-user.png'"
        alt=""
      />
      <i
        v-if="isAdmin(member.id)"
        class="ml-1.5 text-yellow-300"
        title="Administrateur de la room"
      >
        <star class="w-5 h-5" />
      </i>
      <p class="ml-1.5">{{ member.username }}</p>
      <span v-if="roomState === 'blindtest'" class="ml-auto mr-0"
        >{{ member.blindtestScore }}pts</span
      >
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
      roomState: (state) => state.room.roomState,
    }),
    ...mapGetters({
      admin: 'room/admin',
    }),
    prettyMembers() {
      return this.roomState === 'blindtest'
        ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.members.sort((a, b) =>
            a.blindtestScore < b.blindtestScore ? 1 : -1
          )
        : this.members
    },
  },
  methods: {
    isAdmin(userId) {
      return userId === this.admin.id
    },
  },
}
</script>

<style scoped></style>
