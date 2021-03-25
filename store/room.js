export const state = () => ({
  room: null,
  users: [],
  messages: [],
  playlistId: '',
  playlistUri: '',
})

export const getters = {
  admin: (state) => {
    const { admin } = state.room.state
    return admin
  },
}

export const mutations = {
  SET_USERS(state, users) {
    state.users = users
  },
  SET_ROOM(state, room) {
    state.room = room
  },
  ADD_MESSAGE(state, message) {
    state.messages.push(message)
  },
  SET_PLAYLIST(state, { playlistId, playlistUri }) {
    state.playlistId = playlistId
    state.playlistUri = playlistUri
  },
}

export const actions = {
  setRoom({ state, commit, dispatch, getters, rootState }, room) {
    commit('SET_ROOM', room)
    state.room.onStateChange((state) => {
      commit('SET_USERS', Array.from(state.users.$items))
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
      console.log('TRACKSTATE', trackState)
      commit('player/SET_CURRENT_TRACK', trackState, { root: true })
    })

    state.room.onMessage('joined', () => {
      getters.admin === rootState.user.username && dispatch('sendTrackState')
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
      .get('https://api.spotify.com/v1/me/player/currently-playing', {
        credentials: true,
        headers: {
          Authorization: `Bearer ${this.$cookies.get('access_token')}`,
        },
      })
      .then((res) => {
        console.log(res)
        state.room.send('track_state', res.data)
      })
  },
}
