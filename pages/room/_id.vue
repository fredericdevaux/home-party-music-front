<template>
  <div>
    <div v-if="room">
      <div>Le lobby {{ $route.params.id }}</div>
      <div>
        <h2>Joueurs :</h2>
        <ul v-if="users.length">
          <li v-for="(user, index) in users" :key="index">
            {{ user[1].username }}
          </li>
        </ul>
      </div>
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
export default {
  name: 'Id',
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
      users: (state) => state.room.users,
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

<style scoped></style>
