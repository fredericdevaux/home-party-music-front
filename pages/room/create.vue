<template>
  <div class="h-full">
    <div class="container mx-auto">
      <div class="flex flex-col p-8">
        <label for="username" class="mb-4 text-4xl">Nom d'utilisateur</label>
        <input
          id="username"
          v-model="username"
          class="p-2 text-black w-full sm:text-sm"
          type="text"
          name="username"
        />
        <button
          class="
            hover:bg-purple-800
            bg-purple-600
            rounded-md
            text-white
            p-2
            mt-4
            font-bold
          "
          :disabled="username.length < 3"
          @click="createRoom()"
        >
          Créer une room
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { websocket } from '@/mixins/websocket'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import SongsQueueSearchbar from '../../components/songsqueue/SongsQueueSearchbar'

export default {
  name: 'Create',
  components: { SongsQueueSearchbar },
  layout: 'default',
  middleware: ['spotify', 'tokens'],
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
