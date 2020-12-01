export const state = () => ({
  room: null,
  users: [],
  messages: [],
})

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
}

export const actions = {
  setRoom({ state, commit }, room) {
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
  },
  sendMessage({ state, rootState }, messageContent) {
    const message = {}
    message.author = rootState.user.username
    message.authorSessionId = state.room.sessionId
    message.content = messageContent
    state.room.send('message', message)
  },
}
