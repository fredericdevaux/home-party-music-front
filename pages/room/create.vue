<template>
  <div class="container mx-auto mt-6">
    <label for="username">Nom d'utilisateur</label>
    <input
      id="username"
      v-model="username"
      class="
        focus:ring-indigo-500 focus:border-indigo-500
        pl-2
        pr-2
        sm:text-sm
        border-gray-400 border-2
        rounded-md
        text-black
        p-2
      "
      type="text"
      name="username"
    />
    <button
      class="bg-green-600 rounded-md text-white pr-1.5 pl-1.5 pt-1 pb-1.5 mt-4"
      :disabled="username.length < 3"
      @click="createRoom()"
    >
      Créer une room
    </button>
  </div>
</template>

<script>
import { websocket } from '@/mixins/websocket'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  name: 'Create',
  layout: 'default',
  middleware: ['tokens', 'spotify'],
  mixins: [websocket],
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
      id: (state) => state.user.id,
      avatarUrl: (state) => state.user.avatarUrl,
    }),
    ...mapGetters({
      idSpotify: 'spotify/id',
    }),
  },
  methods: {
    createRoom() {
      this.setUsername(this.username)
      this.client
        .create('my_room', {
          username: this.username,
          id: this.id,
          avatarUrl: this.avatarUrl,
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
