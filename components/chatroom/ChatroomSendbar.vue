<template>
  <div class="chatroom-sendbar">
    <form @submit.prevent="prepareMessage(message)">
      <input
        ref="message"
        v-model="message"
        type="text"
        placeholder="Votre message"
      />
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
