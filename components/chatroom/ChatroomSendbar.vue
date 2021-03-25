<template>
  <div class="chatroom-sendbar">
    <form class="flex flex-row" @submit.prevent="prepareMessage(message)">
      <input
        ref="message"
        v-model="message"
        class="flex-grow"
        type="text"
        placeholder="Votre message"
      />
      <i>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </i>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ChatroomSendbar',
  data: () => ({
    message: '',
  }),
  mounted() {
    this.$refs.message.focus()
  },
  methods: {
    prepareMessage(message) {
      this.$refs.message.value = ''
      this.sendMessage(message)
    },
    ...mapActions({
      sendMessage: 'room/sendMessage',
    }),
  },
}
</script>

<style scoped>
input {
  width: 100%;
}
</style>
