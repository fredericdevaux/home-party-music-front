export const state = () => ({
  room: null,
  users: [],
})

export const mutations = {
  SET_USERS(state, users) {
    state.users = users
  },
  SET_ROOM(state, room) {
    state.room = room
  },
}

export const actions = {
  setRoom({ state, commit }, room) {
    commit('SET_ROOM', room)
    state.room.onStateChange((state) => {
      commit('SET_USERS', Array.from(state.users.$items))
    })
  },
}
