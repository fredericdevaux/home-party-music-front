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
      <span>{{ formatedDate }}</span>
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
      return this.$date(this.message.date).format(
        this.$date(this.message.date).isToday() ? 'HH:mm' : 'DD/MM/YYYY HH:mm'
      )
    },
  },
}
</script>

<style scoped>
.chatroom-messages-item {
  border-radius: 20px;
  padding: 10px;
  display: inline-block;
  max-width: 70%;
}

.chatroom-messages-item--other {
  background-color: white;
}

.chatroom-messages-item--me {
  background-color: darkgreen;
}

.chatroom-messages-item--system {
  font-style: italic;
}
</style>
