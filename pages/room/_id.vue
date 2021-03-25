<template>
  <div>
    <div v-if="room" class="room flex">
      <div class="room__part flex-grow"></div>
      <div class="w-1/3">
        <player />
        <chatroom />
      </div>
    </div>
    <div v-else>
      <label for="username">Nom d'utilisateur</label>
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
/* eslint-disable camelcase */
import { mapState, mapMutations, mapActions } from 'vuex'
import Chatroom from '../../components/chatroom/Chatroom'

export default {
  name: 'Id',
  components: { Chatroom },
  middleware: 'spotify',
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
