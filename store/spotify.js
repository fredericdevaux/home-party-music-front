export const state = () => ({
  user: null,
})

export const getters = {
  id: (state) => {
    return state.user?.id || ''
  },
}

export const mutations = {
  SET_USER: (state, user) => {
    state.user = user
  },
}
