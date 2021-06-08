<template>
  <div class="chatroom">
    <chatroom-title />
    <chatroom-members />
    <chatroom-messages />
    <chatroom-sendbar />
  </div>
</template>

<script>
import ChatroomTitle from './ChatroomTitle'
import ChatroomMembers from './ChatroomMembers'
import ChatroomMessages from './ChatroomMessages'
import ChatroomSendbar from './ChatroomSendbar'
export default {
  name: 'Chatroom',
  components: {
    ChatroomSendbar,
    ChatroomMessages,
    ChatroomMembers,
    ChatroomTitle,
  },
}
</script>

<style scoped>
.chatroom {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chatroom-messages {
  flex-grow: 1;
}
</style>
