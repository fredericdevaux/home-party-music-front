<template>
  <div>
    <label for="username">Ton p'tit nom</label>
    <input id="username" v-model="username" type="text" name="username" />
    <button :disabled="username.length < 3" @click="createRoom()">
      Créer une room
    </button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'Create',
  layout: 'websocket',
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
    }),
  },
  methods: {
    createRoom() {
      this.setUsername(this.username)
      this.client
        .create('my_room', {
          username: this.username,
        })
        .then((room) => {
          this.setRoom(room)
          this.$router.push({ name: 'room-id', params: { id: room.id } })
        })
        .catch((e) => {
          console.error('join error', e)
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

<style scoped></style>
