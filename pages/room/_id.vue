<template>
  <div class="h-full">
    <div v-if="room" class="room flex overflow-hidden h-full">
      <div class="room__part pt-16 h-full overflow-y-scroll flex-grow">
        <blindtest v-if="roomState === 'blindtest'"></blindtest>
        <ball v-if="roomState === 'default'"></ball>
      </div>
      <div class="w-1/3 h-full flex flex-col relative bg-black pt-16">
        <button class='hover:bg-purple-800 bg-purple-600 text-white p-2 font-bold'
                v-if="isAdmin && roomState !== 'blindtest'" @click="createBlindtest">
          Lancer un blindtest
        </button>
        <button class='hover:bg-purple-800 bg-purple-600 text-white p-2 font-bold'
                :disabled="blindtestState === 'end'"
                v-if="isAdmin && roomState === 'blindtest'" @click="stopBlindtest">
          Arrêter le blindtest
        </button>
        <songs-queue-searchbar/>
        <jukebox class="h-1/2 overflow-hidden"/>
        <chatroom class="flex-grow h-72"/>
        <player ref="player"/>
      </div>
    </div>
    <div v-else class="h-full flex justify-center items-center text-4xl">
      <label for="username">Nom d'utilisateur :</label>
      <input
        id="username"
        v-model="username"
        type="text"
        name="username"
        class="mx-3 p-2 rounded outline-none text-black"
      />
      <button
        class="text-black bg-gray-200 rounded-xl p-2"
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
import { websocket } from '@/mixins/websocket'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import Chatroom from '../../components/chatroom/Chatroom'

export default {
  name: 'Id',
  components: { Chatroom },
  middleware: ['tokens', 'spotify'],
  mixins: [websocket],
  layout: 'room',
  data: () => ({
    usernameModel: ''
  }),
  computed: {
    username: {
      get() {
        return this.usernameState
      },
      set(value) {
        this.setUsername(value)
      }
    },
    ...mapState({
      client: (state) => state.client.client,
      usernameState: (state) => state.user.username,
      room: (state) => state.room.room,
      id: (state) => state.user.id,
      avatarUrl: (state) => state.user.avatarUrl,
      roomState: (state) => state.room.roomState,
      blindtestState: (state) => state.blindtest.blindtestState
    }),
    ...mapGetters({
      isAdmin: 'room/isAdmin'
    })
  },
  beforeDestroy() {
    this.leaveRoom()
  },
  methods: {
    joinRoom() {
      this.client
        .joinById(this.$route.params.id, {
          username: this.username,
          id: this.id,
          avatarUrl: this.avatarUrl
        })
        .then((room) => {
          this.setRoom(room)
        })
        .catch((err) => {
          console.error(err)
        })
    },

    ...mapMutations({
      setUsername: 'user/SET_USERNAME'
    }),
    ...mapActions({
      setRoom: 'room/setRoom',
      leaveRoom: 'room/leaveRoom',
      createBlindtest: 'room/createBlindtest',
      stopBlindtest: 'room/stopBlindtest'
    })
  }
}
</script>
