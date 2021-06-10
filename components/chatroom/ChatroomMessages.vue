<template>
  <div class="chatroom-messages border border-white">
    <div ref="messagesWrapper" class="chatroom-messages__wrapper">
      <div ref="messagesContent" class="chatroom-messages__content">
        <chatroom-messages-item
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChatroomMessagesItem from './ChatroomMessagesItem'
export default {
  name: 'ChatroomMessages',
  components: { ChatroomMessagesItem },
  computed: {
    ...mapState({
      messages: (state) => state.room.messages,
    }),
  },
  watch: {
    messages() {
      setTimeout(() => {
        this.$refs.messagesWrapper.scrollTop =
          this.$refs.messagesWrapper.scrollHeight
      }, 10)
    },
  },
}
</script>

<style lang="scss" scoped>
.chatroom-messages {
  overflow: hidden;
}

.chatroom-messages__wrapper {
  overflow-y: scroll;
  height: 100%;
}

.chatroom-messages__content {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.chatroom-messages-item {
  align-self: flex-start;

  &:not(:first-child) {
    margin-top: 20px;
  }

  &.chatroom-messages-item--me {
    align-self: flex-end;
  }
}

.chatroom-messages-item--me + .chatroom-messages-item--me,
.chatroom-messages-item--system + .chatroom-messages-item--system {
  margin-top: 5px;
}
</style>
