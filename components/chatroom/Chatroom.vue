<template>
  <div class="chatroom">
    <chatroom-messages />
    <chatroom-sendbar />
  </div>
</template>

<script>
import ChatroomMessages from './ChatroomMessages'
import ChatroomSendbar from './ChatroomSendbar'
export default {
  name: 'Chatroom',
  components: {
    ChatroomSendbar,
    ChatroomMessages,
  },
}
</script>

<style scoped>
.chatroom {
  display: flex;
  flex-direction: column;
}

.chatroom-messages {
  flex-grow: 1;
}
</style>
