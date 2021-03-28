export const strict = false

export const state = () => ({
  username: '',
})

export const mutations = {
  SET_USERNAME(state, username) {
    state.username = username
  },
}
