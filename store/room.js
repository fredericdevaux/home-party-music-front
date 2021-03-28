import { deleteObjectFromArray } from '@/utils/deleteObjectFromArray'

export const state = () => ({
  room: null,
  users: [],
  messages: [],
  songsQueue: [],
})

export const getters = {
  admin: (state) => {
    const { admin } = state.room.state
    return admin
  },
  isAdmin: (state, getters, rootState, rootGetters) => {
    return getters.admin === rootGetters['spotify/id']
  },
}

export const mutations = {
  SET_ROOM(state, room) {
    state.room = room
  },
  RESET_ROOM(state) {
    state.room = null
    state.users = []
    state.messages = []
    state.songsQueue = []
  },
  SET_USERS(state, users) {
    state.users = users
  },
  SET_SONGS_QUEUE(state, songQueues) {
    state.songsQueue = songQueues
  },
  ADD_MESSAGE(state, message) {
    state.messages.push(message)
  },
  ADD_USER(state, user) {
    state.users.push(user)
  },
  DELETE_USER(state, userId) {
    deleteObjectFromArray(state.users, 'sessionId', userId)
  },
  ADD_SONG(state, song) {
    state.songsQueue.push(song)
  },
  DELETE_SONG(state, songId) {
    deleteObjectFromArray(state.songsQueue, 'id', songId)
  },
}

export const actions = {
  setRoom({ state, commit, dispatch, getters, rootState }, room) {
    commit('SET_ROOM', room)
    state.room.onMessage('user_join', (user) => {
      commit('ADD_USER', user)
    })

    state.room.onMessage('set_state', (currentState) => {
      commit('player/SET_CURRENT_TRACK', currentState.trackState, {
        root: true,
      })
      commit('SET_SONGS_QUEUE', currentState.songsQueue)
      commit('SET_USERS', currentState.users)
    })

    state.room.onMessage('user_leave', (userId) => {
      commit('DELETE_USER', userId)
    })

    state.room.onMessage('message', (message) => {
      if (message.authorId) {
        if (message.authorId === state.room.sessionId) {
          message.type = 'me'
        } else {
          message.type = 'other'
        }
      }

      commit('ADD_MESSAGE', message)
    })

    state.room.onMessage('track_state', (trackState) => {
      commit('player/SET_CURRENT_TRACK', trackState, { root: true })
    })

    state.room.onMessage('update_track_state', (trackState) => {
      commit('player/SET_CURRENT_TRACK', trackState, { root: true })
    })

    state.room.onMessage('new_song_added', (song) => {
      commit('ADD_SONG', song)
    })

    state.room.onMessage('song_deleted', (songId) => {
      commit('DELETE_SONG', songId)
    })
  },
  sendMessage({ state, rootState }, messageContent) {
    const message = {}
    message.author = rootState.user.username
    message.authorSessionId = state.room.sessionId
    message.content = messageContent
    state.room.send('message', message)
  },
  sendTrackState({ state }) {
    this.$axios
      .get(`${process.env.SPOTIFY_BASE_API_URL}/me/player/currently-playing`, {
        credentials: true,
        headers: {
          Authorization: `Bearer ${this.$cookies.get('access_token')}`,
        },
      })
      .then((res) => {
        state.room.send('track_state', res.data)
      })
  },
  updateTrackState({ state }) {
    this.$axios
      .get(`${process.env.SPOTIFY_BASE_API_URL}/me/player/currently-playing`, {
        credentials: true,
        headers: {
          Authorization: `Bearer ${this.$cookies.get('access_token')}`,
        },
      })
      .then((res) => {
        state.room.send('update_track_state', res.data)
      })
  },
  addSongToQueue({ state }, song) {
    state.room.send('add_song_to_queue', song)
  },
  deleteSongFromQueue({ state }, songId) {
    state.room.send('delete_song_from_queue', songId)
  },
  leaveRoom({ state, commit }) {
    state.room.leave()
    commit('RESET_ROOM')
  },
}
