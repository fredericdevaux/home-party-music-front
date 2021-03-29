export const state = () => ({
  id: '',
  sessionId: '',
  username: '',
  avatarUrl: '',
})

export const mutations = {
  SET_SESSION_ID(state, sessionId) {
    state.sessionId = sessionId
  },
  SET_ID(state, id) {
    state.id = id
  },
  SET_USERNAME(state, username) {
    state.username = username
  },
  SET_AVATAR_URL(state, avatarUrl) {
    state.avatarUrl = avatarUrl
  },
}
