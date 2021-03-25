<template>
  <div
    :class="`chatroom-messages-item--${message.type}`"
    class="chatroom-messages-item"
  >
    <div
      v-if="message.type !== 'system'"
      class="chatroom-messages-item__header"
    >
      <span class="chatroom-messages-item__author"
        >{{ message.author }} a dit :</span
      >
    </div>

    <div class="chatroom-messages-item__content">
      {{ message.content }}
    </div>

    <div
      v-if="message.type !== 'system'"
      class="chatroom-messages-item__bottom"
    >
      <span class="text-right">{{ formatedDate }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatroomMessagesItem',
  props: {
    message: {
      default() {
        return { message: {} }
      },
      type: Object,
    },
  },
  computed: {
    formatedDate() {
      return this.$dayjs(this.message.date).format(
        this.$dayjs(this.message.date).isToday() ? 'HH:mm' : 'DD/MM/YYYY HH:mm'
      )
    },
  },
}
</script>

<style scoped>
.chatroom-messages-item {
  padding: 10px;
  display: inline-block;
  max-width: 70%;
}

.chatroom-messages-item--other {
  @apply bg-gray-500 text-white rounded-t-xl rounded-br-xl;
}

.chatroom-messages-item--me {
  @apply bg-blue-400 text-white rounded-t-xl rounded-bl-xl;
}

.chatroom-messages-item--system {
  font-style: italic;
}
</style>
