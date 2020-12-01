<template>
  <div>
    <div v-if="room" class="room">
      <div class="room__part"></div>
      <chatroom />
    </div>
    <div v-else>
      <label for="username">Ton p'tit nom</label>
      <input id="username" v-model="username" type="text" name="username" />
      <button
        :disabled="!username.length && username.length < 3"
        @click="joinRoom()"
      >
        Rejoindre la room
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Chatroom from '../../components/chatroom/Chatroom'
export default {
  name: 'Id',
  components: { Chatroom },
  layout: 'websocket',
  data: () => ({
    usernameModel: '',
  }),
  computed: {
    username: {
      get() {
        return this.usernameState
      },
      set(value) {
        this.setUsername(value)
      },
    },
    ...mapState({
      client: (state) => state.client.client,
      usernameState: (state) => state.user.username,
      room: (state) => state.room.room,
    }),
  },
  created() {
    this.username && !this.room && this.joinRoom()
  },
  methods: {
    joinRoom() {
      this.client
        .joinById(this.$route.params.id, {
          username: this.username,
        })
        .then((room) => {
          this.setRoom(room)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    ...mapMutations({
      setUsername: 'user/SET_USERNAME',
    }),
    ...mapActions({
      setRoom: 'room/setRoom',
    }),
  },
}
</script>

<style lang="scss" scoped>
.room {
  display: flex;
}

.room__part {
  width: 70%;
}

.chatroom {
  width: 30%;
  max-width: 430px;
}
</style>
